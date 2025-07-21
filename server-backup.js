const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Detectar URL base automaticamente
const getBaseURL = (req) => {
    if (process.env.NODE_ENV === 'production') {
        // Em produção, usar a URL do Railway
        return process.env.RAILWAY_STATIC_URL || `${req.protocol}://${req.get('host')}`;
    }
    return 'http://localhost:3000';
};

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-5956351957753101-061711-e7363d09d29a257c3e1d645ba3004ae8-1862853195',
});

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://holozonicsubpages.vercel.app',
        'https://andrehoffmannbr.github.io'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('.'));

// Definição dos serviços e preços
const servicos = {
    // Pacotes Principais
    'laser-acupuntura-pacote': { nome: 'Laser Acupuntura (Pacote)', preco: 576 },
    'moxabustao-pacote': { nome: 'Moxabustão (Pacote)', preco: 720 },
    'ventosaterapia-pacote': { nome: 'Ventosaterapia (Pacote)', preco: 800 },
    'ozonioterapia-pacote': { nome: 'Ozonioterapia (Pacote)', preco: 960 },
    'dietoterapia-chinesa-pacote': { nome: 'Dietoterapia Chinesa (Pacote)', preco: 720 },
    'fitoterapia-suplementacao-pacote': { nome: 'Fitoterapia & Suplementação (Pacote)', preco: 880 },
    
    // Consultas
    'consulta-clinica': { nome: 'Consulta Clínica', preco: 390 },
    
    // Tratamentos Complementares
    'laser-acupuntura-individual': { nome: 'Laser Acupuntura (Individual)', preco: 125 },
    'moxabustao-individual': { nome: 'Moxabustão (Individual)', preco: 90 },
    'ventosaterapia-individual': { nome: 'Ventosaterapia (Individual)', preco: 125 },
    'dietoterapia-chinesa-individual': { nome: 'Dietoterapia Chinesa (Individual)', preco: 120 },
    'fitoterapia-suplementacao-individual': { nome: 'Fitoterapia & Suplementação (Individual)', preco: 180 },
    'ozonioterapia-individual': { nome: 'Ozonioterapia (Individual)', preco: 150 }
};

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para criar preferência de pagamento
app.post('/criar-pagamento', async (req, res) => {
    try {
        const { servicoId, servicoNome, valor } = req.body;
        
        console.log('📝 Criando pagamento para:', { servicoId, servicoNome, valor });
        
        // Validar se o serviço existe
        const servico = servicos[servicoId];
        if (!servico) {
            return res.status(400).json({ 
                error: 'Serviço não encontrado',
                servicoId 
            });
        }
        
        // Validar se o valor corresponde ao serviço
        if (servico.preco !== parseFloat(valor)) {
            return res.status(400).json({ 
                error: 'Valor incorreto para o serviço',
                esperado: servico.preco,
                recebido: valor 
            });
        }

        const preference = new Preference(client);
        
        const body = {
            items: [
                {
                    id: servicoId,
                    title: servicoNome || servico.nome,
                    category_id: 'health_services',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: servico.preco
                }
            ],
            payment_methods: {
                excluded_payment_types: [],
                excluded_payment_methods: [],
                installments: 12
            },
            back_urls: {
                success: `https://holozonicsubpages.vercel.app/sucesso.html`,
                failure: `https://holozonicsubpages.vercel.app/erro.html`,
                pending: `https://holozonicsubpages.vercel.app/pendente.html`
            },
            auto_return: 'approved',
            external_reference: `HOLOZONIC-${Date.now()}-${servicoId}`,
            notification_url: `${req.protocol}://${req.get('host')}/webhook`,
            statement_descriptor: 'HOLOZONIC CLINICA',
            metadata: {
                servico_id: servicoId,
                servico_nome: servicoNome || servico.nome,
                timestamp: new Date().toISOString()
            }
        };

        console.log('🔄 Enviando preferência para Mercado Pago...');
        const result = await preference.create({ body });
        
        console.log('✅ Preferência criada com sucesso:', result.id);
        
        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
            servico: servico.nome,
            valor: servico.preco
        });

    } catch (error) {
        console.error('❌ Erro ao criar preferência:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// Rota para processar webhooks do Mercado Pago
app.post('/webhook', (req, res) => {
    console.log('🔔 Webhook recebido:', req.body);
    
    const { type, data } = req.body;
    
    if (type === 'payment') {
        console.log('💰 Notificação de pagamento:', data.id);
        // Aqui você pode processar a notificação de pagamento
        // Verificar status, atualizar banco de dados, enviar emails, etc.
    }
    
    res.status(200).send('OK');
});

// Rota para obter informações de um serviço
app.get('/servico/:id', (req, res) => {
    const servicoId = req.params.id;
    const servico = servicos[servicoId];
    
    if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    
    res.json({
        id: servicoId,
        ...servico
    });
});

// Rota para listar todos os serviços
app.get('/servicos', (req, res) => {
    const servicosFormatados = Object.entries(servicos).map(([id, dados]) => ({
        id,
        ...dados
    }));
    
    res.json(servicosFormatados);
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    console.error('❌ Erro não tratado:', error);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
    });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor rodando em:', `http://localhost:${PORT}`);
    console.log('💳 Mercado Pago configurado');
    console.log('📋 Serviços disponíveis:', Object.keys(servicos).length);
    
    if (process.env.NODE_ENV === 'development') {
        console.log('\n📝 Rotas disponíveis:');
        console.log('  GET  /', 'Página principal');
        console.log('  POST /criar-pagamento', 'Criar preferência de pagamento');
        console.log('  POST /webhook', 'Webhook do Mercado Pago');
        console.log('  GET  /servico/:id', 'Informações de um serviço');
        console.log('  GET  /servicos', 'Lista todos os serviços');
    }
});

module.exports = app; 