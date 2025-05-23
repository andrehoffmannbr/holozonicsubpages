# Site da Clínica Holozonic

Uma plataforma web moderna que integra medicina tradicional chinesa com tecnologia vestível e terapias inovadoras.

## 🚀 Características Principais

- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Medicina Integrativa**: Combinação de práticas tradicionais com tecnologia moderna
- **Agendamento Online**: Sistema integrado com Portal Telemedicina
- **Monitoramento Inteligente**: Dashboard com métricas de saúde em tempo real
- **Formulário de Pré-Anamnese**: Integração com Formspree para coleta de dados
- **Planos VitaLin**: Sistema de assinatura com benefícios exclusivos
- **Teleconsulta**: Atendimento remoto integrado

## 🛠️ Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com animações avançadas
- TailwindCSS para estilização
- JavaScript ES6+ vanilla
- Font Awesome para ícones
- Intersection Observer API
- Formspree para formulários

## 📁 Estrutura do Projeto

```
ClinicaHolozonic/
├── index.html              # Página principal
├── styles/
│   └── main.css            # Estilos customizados
├── js/
│   └── main.js             # JavaScript principal
├── img/
│   └── background.mp4      # Vídeo de fundo
├── documentation.md        # Documentação completa
└── README.md              # Este arquivo
```

## 🎯 Funcionalidades

### Seções do Site

1. **Header Inteligente**
   - Logo Holozonic
   - Mega menu responsivo
   - Menu mobile com animações

2. **Hero Section**
   - Vídeo de fundo com overlay
   - Call-to-action para agendamento
   - Título impactante

3. **Por que a Holozonic**
   - Missão, visão e valores
   - Diferenciais competitivos
   - Cards interativos

4. **Medicina Chinesa**
   - Diagnósticos tradicionais
   - Práticas terapêuticas
   - Botões de agendamento

5. **Oxigenioozonioterapia**
   - Benefícios do tratamento
   - Segurança e resultados
   - Avaliação gratuita

6. **Exames Especializados**
   - Exames de imagem
   - Exames do sono
   - Laudos digitais

7. **VitaLin - Planos**
   - Plano Mensal (R$ 299)
   - Plano Trimestral (R$ 799)
   - Plano Anual (R$ 2.599)

8. **Monitoramento Inteligente**
   - Dispositivos vestíveis
   - Dashboard personalizado
   - Métricas em tempo real

9. **Formulário de Pré-Anamnese**
   - Dados pessoais
   - Histórico de saúde
   - Estilo de vida

### Integrações

- **Portal Telemedicina**: Agendamento e teleconsulta
- **WhatsApp Business**: Comunicação direta
- **Formspree**: Processamento de formulários
- **Loja Integrada**: E-commerce (preparado para integração)

## 🔧 Instalação e Execução

### Pré-requisitos

- Navegador web moderno
- Servidor web local (opcional para desenvolvimento)

### Execução Local

1. **Clone ou baixe o projeto**
   ```bash
   # Se usando Git
   git clone [URL_DO_REPOSITORIO]
   cd ClinicaHolozonic
   ```

2. **Opção 1: Abrir diretamente no navegador**
   - Abra o arquivo `index.html` diretamente no seu navegador

3. **Opção 2: Usar servidor local (recomendado)**
   
   **Com Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Com Node.js:**
   ```bash
   npx http-server
   ```
   
   **Com PHP:**
   ```bash
   php -S localhost:8000
   ```

4. **Acessar no navegador**
   ```
   http://localhost:8000
   ```

## ⚙️ Configuração

### Formspree (Formulário de Pré-Anamnese)

1. Acesse [formspree.io](https://formspree.io)
2. Crie uma conta e um novo formulário
3. Substitua `your_form_id` no arquivo `js/main.js`:
   ```javascript
   const response = await fetch('https://formspree.io/f/SEU_FORM_ID', {
   ```

### Portal Telemedicina

Para integrar com o Portal Telemedicina:

1. Obtenha as credenciais da API
2. Configure os endpoints no `js/main.js`
3. Implemente os webhooks necessários

### Loja Integrada

Para ativar a integração com a Loja Integrada:

1. Solicite a Chave de Aplicação via formulário oficial
2. Configure a API no `js/main.js`:
   ```javascript
   const headers = {
       'Authorization': 'Bearer SUA_API_TOKEN',
       'Content-Type': 'application/json'
   };
   ```

## 🎨 Personalização

### Cores

As cores principais estão configuradas no TailwindCSS:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#1E90FF',    // Azul
                secondary: '#32CD32',  // Verde
                accent: '#8A2BE2',     // Roxo
                light: '#D3D3D3'       // Cinza claro
            }
        }
    }
}
```

### Conteúdo

- Edite o arquivo `index.html` para alterar textos e estrutura
- Modifique `styles/main.css` para ajustes visuais
- Atualize `js/main.js` para funcionalidades customizadas

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## ♿ Acessibilidade

Implementações de acessibilidade incluem:

- Contraste adequado (WCAG AA)
- Navegação por teclado
- Aria-labels e roles
- Textos alternativos
- Foco visível
- Suporte a leitores de tela

## 🚀 Deploy

### GitHub Pages

1. Faça push do código para um repositório GitHub
2. Vá em Settings > Pages
3. Selecione a branch principal
4. O site estará disponível em `username.github.io/repository-name`

### Netlify

1. Conecte seu repositório ao Netlify
2. Configure build settings:
   - Build command: (deixe vazio)
   - Publish directory: `/`
3. Deploy automático a cada push

### Vercel

1. Importe o projeto no Vercel
2. Deploy automático configurado
3. URL personalizada disponível

## 📊 Performance

### Métricas Alvo

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Performance Score**: > 90

### Otimizações Implementadas

- Lazy loading de imagens
- Compressão de assets
- Minificação de código
- CDN para bibliotecas
- Cache headers

## 🔒 Segurança

- Validação de formulários
- Sanitização de inputs
- Headers de segurança
- HTTPS obrigatório
- Conformidade com LGPD

## 📞 Suporte

Para dúvidas sobre implementação:

1. Consulte a documentação completa em `documentation.md`
2. Verifique os comentários no código
3. Abra uma issue no repositório (se aplicável)

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## ✅ Funcionalidades Avançadas Implementadas### 🔥 **PWA (Progressive Web App)**- ✅ Service Worker para funcionamento offline- ✅ Manifest.json para instalação como app- ✅ Cache inteligente de recursos estáticos- ✅ Notificações push (preparado)- ✅ Página offline personalizada- ✅ Prompt de instalação automático### 📊 **Google Analytics 4**- ✅ Tracking detalhado de eventos personalizados- ✅ Análise de comportamento do usuário- ✅ Métricas de conversão (agendamentos, VitaLin)- ✅ Core Web Vitals automático- ✅ Conformidade com LGPD- ✅ Banner de consentimento de cookies### 🔒 **SSL Automático**- ✅ Script automatizado para Let's Encrypt- ✅ Renovação automática via cron- ✅ Headers de segurança avançados- ✅ Redirecionamento HTTP → HTTPS- ✅ Configuração Apache completa### 🚀 **Para Colocar em Produção**1. **Execute o script SSL**:   ```bash   chmod +x ssl-setup.sh   sudo ./ssl-setup.sh   ```2. **Configure Google Analytics**:   - Obtenha seu Measurement ID   - Atualize em `index.html` e `js/analytics.js`3. **Siga o guia completo**:   - Consulte `DEPLOYMENT.md` para instruções detalhadas## 🏥 Sobre a HolozonicA Clínica Holozonic é pioneira na integração entre medicina tradicional chinesa e tecnologia vestível, oferecendo uma abordagem revolucionária para o cuidado com a saúde.---**Desenvolvido com ❤️ para a Clínica Holozonic** *Agora com PWA, Analytics e SSL prontos para produção!* 🚀 