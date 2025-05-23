# 🚀 Guia de Deployment - Clínica Holozonic

Este guia fornece instruções passo a passo para colocar o site da Holozonic em produção com todas as funcionalidades PWA, SSL e Analytics configuradas.

## 📋 Pré-requisitos

### Antes de começar, você precisará de:

1. **Servidor Web** (VPS/Dedicado)
   - Ubuntu 20.04+ ou CentOS 7+
   - Mínimo 1GB RAM, 20GB storage
   - Acesso root/sudo

2. **Domínio**
   - Domínio registrado (ex: holozonic.com.br)
   - Acesso ao painel DNS

3. **Contas e Chaves de API**
   - Google Analytics 4 Measurement ID
   - Formspree Account (para formulários)
   - Portal Telemedicina credentials (se aplicável)

## 🔧 Etapa 1: Configuração do Servidor

### 1.1 Conectar ao Servidor
```bash
ssh root@SEU_IP_DO_SERVIDOR
```

### 1.2 Atualizar Sistema
```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# CentOS/RHEL
yum update -y
```

### 1.3 Instalar Dependências Básicas
```bash
# Ubuntu/Debian
apt install -y wget curl git unzip

# CentOS/RHEL
yum install -y wget curl git unzip
```

## 🌐 Etapa 2: Configuração do Domínio

### 2.1 Configurar DNS
No painel do seu provedor de domínio, configure:

```
Tipo: A
Nome: @
Valor: IP_DO_SEU_SERVIDOR
TTL: 3600

Tipo: A  
Nome: www
Valor: IP_DO_SEU_SERVIDOR
TTL: 3600
```

### 2.2 Verificar Propagação DNS
```bash
nslookup holozonic.com.br
dig holozonic.com.br
```

## 📁 Etapa 3: Upload dos Arquivos

### 3.1 Fazer Upload via SCP
```bash
# Do seu computador local
scp -r . root@SEU_IP:/tmp/holozonic-upload/
```

### 3.2 Ou Clonar via Git (se estiver em repositório)
```bash
cd /var/www/
git clone https://github.com/SEU_USUARIO/holozonic.git
```

## 🔒 Etapa 4: Configuração SSL Automática

### 4.1 Executar Script SSL
```bash
cd /var/www/holozonic/
chmod +x ssl-setup.sh
sudo ./ssl-setup.sh
```

### 4.2 Seguir as Instruções do Script
- Digite seu domínio: `holozonic.com.br`
- Confirmar subdomínio www: `y`
- Digite seu email: `admin@holozonic.com.br`

### 4.3 Verificar Instalação SSL
```bash
sudo certbot certificates
systemctl status apache2
```

## 📊 Etapa 5: Configuração do Google Analytics

### 5.1 Obter Measurement ID
1. Acesse [Google Analytics](https://analytics.google.com)
2. Crie uma nova propriedade
3. Configure para Web
4. Copie o Measurement ID (formato: G-XXXXXXXXXX)

### 5.2 Atualizar Configurações
Edite os arquivos:

**index.html** (linha ~15):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=SEU_MEASUREMENT_ID"></script>
<script>
    gtag('config', 'SEU_MEASUREMENT_ID');
</script>
```

**js/analytics.js** (linha 5):
```javascript
const GA_MEASUREMENT_ID = 'SEU_MEASUREMENT_ID';
```

### 5.3 Aplicar Mudanças
```bash
systemctl reload apache2
```

## 📝 Etapa 6: Configuração do Formspree

### 6.1 Criar Conta Formspree
1. Acesse [Formspree.io](https://formspree.io)
2. Crie uma conta gratuita
3. Crie um novo formulário
4. Copie o endpoint

### 6.2 Atualizar Formulário
Edite `js/main.js` (linha ~135):
```javascript
const response = await fetch('https://formspree.io/f/SEU_FORM_ID', {
```

## 🏥 Etapa 7: Configurações Específicas da Clínica

### 7.1 Atualizar Informações de Contato
Edite `index.html` e atualize:
- Telefone: `(11) 99999-8888`
- Email: `contato@holozonic.com.br`
- Endereço: `Rua da Saúde, 123 - São Paulo`
- WhatsApp: `5511999998888`

### 7.2 Configurar Portal Telemedicina
Se usando portal personalizado, edite `js/main.js`:
```javascript
function openPortalTelemedicina() {
    window.open('https://seu-portal-telemedicina.com', '_blank');
}
```

## 🔧 Etapa 8: Otimizações Finais

### 8.1 Criar Ícones PWA
Gere ícones nos tamanhos necessários e coloque em `/icons/`:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

Use ferramentas como [PWA Asset Generator](https://www.pwabuilder.com/).

### 8.2 Verificar Configurações PWA
```bash
# Testar service worker
curl -I https://holozonic.com.br/sw.js

# Testar manifest
curl -I https://holozonic.com.br/manifest.json
```

### 8.3 Otimizar Performance
```bash
# Ativar compressão
sudo a2enmod deflate
sudo systemctl reload apache2

# Verificar headers de cache
curl -I https://holozonic.com.br/
```

## ✅ Etapa 9: Testes e Validação

### 9.1 Testes Básicos
- [ ] Site carrega em HTTPS
- [ ] Redirecionamento HTTP → HTTPS funciona
- [ ] Menu responsivo funciona
- [ ] Formulários enviam corretamente
- [ ] PWA pode ser instalado

### 9.2 Testes de Performance
Use estas ferramentas:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### 9.3 Testes PWA
- [PWA Testing Tool](https://www.pwabuilder.com/)
- Chrome DevTools → Application → Manifest

### 9.4 Testes Mobile
- Responsividade em diferentes telas
- Touch events funcionando
- Install prompt aparece

## 📈 Etapa 10: Monitoramento

### 10.1 Configurar Logs
```bash
# Visualizar logs Apache
tail -f /var/log/apache2/holozonic.com.br-access.log
tail -f /var/log/apache2/holozonic.com.br-error.log

# Visualizar logs SSL
tail -f /var/log/holozonic-ssl-renewal.log
```

### 10.2 Configurar Alertas
Configure monitoramento com:
- UptimeRobot (gratuito)
- Google Analytics alertas
- Logs de erro por email

## 🔄 Etapa 11: Backup e Manutenção

### 11.1 Script de Backup
```bash
#!/bin/bash
# backup-holozonic.sh

BACKUP_DIR="/backups/holozonic"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup arquivos
tar -czf $BACKUP_DIR/holozonic_files_$DATE.tar.gz /var/www/holozonic/

# Backup configurações Apache
cp /etc/apache2/sites-available/holozonic.com.br* $BACKUP_DIR/

# Backup certificados SSL
cp -r /etc/letsencrypt/live/holozonic.com.br/ $BACKUP_DIR/ssl_$DATE/

echo "Backup concluído: $BACKUP_DIR"
```

### 11.2 Cron para Backup Automático
```bash
# Executar todo domingo às 2h
0 2 * * 0 /root/backup-holozonic.sh
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### SSL não funciona
```bash
sudo certbot renew --dry-run
sudo systemctl restart apache2
```

#### PWA não instala
- Verificar manifest.json syntax
- Confirmar HTTPS ativo
- Verificar service worker registrado

#### Analytics não rastreia
- Verificar Measurement ID
- Confirmar consentimento cookies
- Verificar network requests no DevTools

#### Formulário não envia
- Verificar endpoint Formspree
- Confirmar CORS configurado
- Verificar console errors

## 📞 Suporte

Para suporte técnico:
- 📧 Email: suporte@holozonic.com.br
- 📱 WhatsApp: (11) 99999-8888
- 🌐 Portal: https://holozonic.com.br/suporte

## 📝 Checklist Final

Antes de ir ao ar:
- [ ] Domínio configurado e propagado
- [ ] SSL instalado e funcionando
- [ ] Google Analytics configurado
- [ ] Formspree configurado
- [ ] Informações da clínica atualizadas
- [ ] PWA funcionando (manifest + service worker)
- [ ] Testes de performance aprovados
- [ ] Backup configurado
- [ ] Monitoramento ativo

## 🎉 Conclusão

Após seguir todos os passos, seu site da Holozonic estará:
- ✅ Seguro com HTTPS
- ✅ Otimizado para performance
- ✅ Funcionando como PWA
- ✅ Rastreando com Analytics
- ✅ Pronto para receber pacientes

**Parabéns! A Holozonic está online!** 🏥✨

---

*© 2024 Clínica Holozonic - Medicina Integrativa e Tecnologia Vestível* 