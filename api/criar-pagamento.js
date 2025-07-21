const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-5956351957753101-061711-e7363d09d29a257c3e1d645ba3004ae8-1862853195',
});

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
    'ozonioterapia-individual': { nome: 'Ozonioterapia (Individual)', preco: 150 },
    'feridas-presencial': { nome: 'Tratamento de Feridas (Presencial)', preco: 150 },
    'feridas-domicilio': { nome: 'Tratamento de Feridas (Domicílio)', preco: 200 },
    
    // Exames
    'exame-sono': { nome: 'Exame do Sono - Polissonografia', preco: 350 },
    'bioressonnancia': { nome: 'Biorressonância Magnética Digital', preco: 300 },
    'oxigenio-estetica': { nome: 'Oxigenio-ozonioterapia Estética', preco: 200 }
};

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
            notification_url: `https://holozonicsubpages.vercel.app/api/webhook`,
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
} 