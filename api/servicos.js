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

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const servicosFormatados = Object.entries(servicos).map(([id, dados]) => ({
            id,
            ...dados
        }));
        
        res.json({
            servicos: servicosFormatados,
            total: servicosFormatados.length
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar serviços:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message 
        });
    }
} 