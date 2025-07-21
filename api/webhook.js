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
        console.log('🔔 Webhook recebido:', req.body);
        
        const { type, data } = req.body;
        
        if (type === 'payment') {
            console.log('💰 Notificação de pagamento:', data.id);
            // Aqui você pode processar a notificação de pagamento
            // Verificar status, atualizar banco de dados, enviar emails, etc.
            
            // Por enquanto, apenas loggar
            console.log('✅ Pagamento processado com sucesso');
        }
        
        res.status(200).json({ message: 'Webhook processado com sucesso' });
        
    } catch (error) {
        console.error('❌ Erro ao processar webhook:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message 
        });
    }
} 