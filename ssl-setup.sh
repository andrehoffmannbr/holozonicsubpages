#!/bin/bash

# Script de Configuração SSL para Holozonic
# Instala e configura certificado SSL gratuito via Let's Encrypt

echo "🔒 Configuração SSL para Holozonic - Iniciando..."
echo "================================================"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para logs
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está executando como root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Este script deve ser executado como root (sudo)"
        exit 1
    fi
}

# Verificar sistema operacional
check_os() {
    if [[ -f /etc/debian_version ]]; then
        OS="debian"
        log_info "Sistema detectado: Debian/Ubuntu"
    elif [[ -f /etc/redhat-release ]]; then
        OS="redhat"
        log_info "Sistema detectado: Red Hat/CentOS"
    else
        log_error "Sistema operacional não suportado"
        exit 1
    fi
}

# Instalar dependências
install_dependencies() {
    log_info "Instalando dependências..."
    
    if [[ $OS == "debian" ]]; then
        apt update
        apt install -y snapd apache2
        systemctl enable snapd
        systemctl start snapd
        snap install core; snap refresh core
        snap install --classic certbot
        ln -sf /snap/bin/certbot /usr/bin/certbot
    elif [[ $OS == "redhat" ]]; then
        yum update -y
        yum install -y epel-release
        yum install -y snapd httpd
        systemctl enable snapd
        systemctl start snapd
        snap install core; snap refresh core
        snap install --classic certbot
        ln -sf /snap/bin/certbot /usr/bin/certbot
    fi
    
    log_info "Dependências instaladas com sucesso!"
}

# Configurar domínio
configure_domain() {
    echo ""
    read -p "Digite o domínio principal (ex: holozonic.com.br): " DOMAIN
    read -p "Incluir subdomínio www? (y/n): " INCLUDE_WWW
    read -p "Digite seu email para notificações SSL: " EMAIL
    
    if [[ $INCLUDE_WWW == "y" || $INCLUDE_WWW == "Y" ]]; then
        DOMAINS="-d $DOMAIN -d www.$DOMAIN"
    else
        DOMAINS="-d $DOMAIN"
    fi
    
    log_info "Domínio configurado: $DOMAIN"
}

# Configurar Apache Virtual Host
configure_apache() {
    log_info "Configurando Apache Virtual Host..."
    
    # Criar arquivo de configuração do site
    cat > "/etc/apache2/sites-available/$DOMAIN.conf" << EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot /var/www/holozonic
    
    # Logs
    ErrorLog \${APACHE_LOG_DIR}/$DOMAIN-error.log
    CustomLog \${APACHE_LOG_DIR}/$DOMAIN-access.log combined
    
    # Configurações específicas da Holozonic
    <Directory /var/www/holozonic>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Headers de segurança básicos
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
EOF

    # Criar diretório do site
    mkdir -p /var/www/holozonic
    
    # Copiar arquivos do site (assumindo que estão no diretório atual)
    if [[ -f "index.html" ]]; then
        cp -r * /var/www/holozonic/
        chown -R www-data:www-data /var/www/holozonic
        chmod -R 755 /var/www/holozonic
        log_info "Arquivos do site copiados para /var/www/holozonic"
    else
        log_warning "Arquivos do site não encontrados no diretório atual"
    fi
    
    # Ativar site e módulos necessários
    a2enmod rewrite headers ssl
    a2ensite $DOMAIN
    a2dissite 000-default
    systemctl reload apache2
    
    log_info "Apache configurado com sucesso!"
}

# Obter certificado SSL
get_ssl_certificate() {
    log_info "Obtendo certificado SSL com Let's Encrypt..."
    
    # Parar Apache temporariamente para validação
    systemctl stop apache2
    
    # Obter certificado
    certbot certonly \
        --standalone \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        $DOMAINS
    
    if [[ $? -eq 0 ]]; then
        log_info "Certificado SSL obtido com sucesso!"
    else
        log_error "Falha ao obter certificado SSL"
        systemctl start apache2
        exit 1
    fi
    
    # Criar configuração HTTPS
    cat > "/etc/apache2/sites-available/$DOMAIN-ssl.conf" << EOF
<VirtualHost *:443>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot /var/www/holozonic
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$DOMAIN/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$DOMAIN/privkey.pem
    
    # SSL Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Logs
    ErrorLog \${APACHE_LOG_DIR}/$DOMAIN-ssl-error.log
    CustomLog \${APACHE_LOG_DIR}/$DOMAIN-ssl-access.log combined
    
    # Configurações específicas da Holozonic
    <Directory /var/www/holozonic>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    Redirect permanent / https://$DOMAIN/
</VirtualHost>
EOF

    # Ativar site SSL
    a2ensite $DOMAIN-ssl
    systemctl start apache2
    systemctl reload apache2
    
    log_info "Configuração HTTPS ativada!"
}

# Configurar renovação automática
setup_auto_renewal() {
    log_info "Configurando renovação automática..."
    
    # Criar script de renovação
    cat > "/usr/local/bin/renew-holozonic-ssl.sh" << 'EOF'
#!/bin/bash
# Script de renovação automática SSL para Holozonic

/usr/bin/certbot renew --quiet --post-hook "systemctl reload apache2"

# Log da renovação
echo "$(date): Verificação de renovação SSL executada" >> /var/log/holozonic-ssl-renewal.log
EOF

    chmod +x /usr/local/bin/renew-holozonic-ssl.sh
    
    # Adicionar ao crontab (verificar renovação duas vezes por dia)
    (crontab -l 2>/dev/null; echo "0 2,14 * * * /usr/local/bin/renew-holozonic-ssl.sh") | crontab -
    
    log_info "Renovação automática configurada!"
}

# Teste de configuração
test_ssl() {
    log_info "Testando configuração SSL..."
    
    echo ""
    echo "Testando conectividade HTTPS..."
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200\|301\|302"; then
        log_info "✅ HTTPS funcionando corretamente!"
    else
        log_warning "⚠️  Problemas detectados na configuração HTTPS"
    fi
    
    echo ""
    echo "Para testar a configuração SSL complete, acesse:"
    echo "🔗 https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
}

# Mostrar resumo
show_summary() {
    echo ""
    echo "================================================"
    echo "🎉 Configuração SSL Concluída!"
    echo "================================================"
    echo ""
    echo "📋 Resumo da Configuração:"
    echo "• Domínio: $DOMAIN"
    echo "• Certificado SSL: Let's Encrypt"
    echo "• Renovação: Automática (via cron)"
    echo "• Localização dos arquivos: /var/www/holozonic"
    echo ""
    echo "🔗 URLs do site:"
    echo "• https://$DOMAIN"
    if [[ $INCLUDE_WWW == "y" || $INCLUDE_WWW == "Y" ]]; then
        echo "• https://www.$DOMAIN (redirect)"
    fi
    echo ""
    echo "📁 Arquivos importantes:"
    echo "• Certificado: /etc/letsencrypt/live/$DOMAIN/"
    echo "• Configuração Apache: /etc/apache2/sites-available/$DOMAIN-ssl.conf"
    echo "• Log de renovação: /var/log/holozonic-ssl-renewal.log"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "• Verificar status SSL: sudo certbot certificates"
    echo "• Renovar manualmente: sudo certbot renew"
    echo "• Recarregar Apache: sudo systemctl reload apache2"
    echo ""
    log_info "Configuração SSL da Holozonic finalizada com sucesso!"
}

# Função principal
main() {
    echo "🏥 Holozonic - Configuração SSL Automatizada"
    echo "=============================================="
    echo ""
    
    check_root
    check_os
    install_dependencies
    configure_domain
    configure_apache
    get_ssl_certificate
    setup_auto_renewal
    test_ssl
    show_summary
}

# Executar apenas se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 