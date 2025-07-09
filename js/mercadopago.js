// Configuração do Mercado Pago
const PUBLIC_KEY = 'APP_USR-101288b1-79a0-477a-b6ef-ae973433bc65';
const WHATSAPP_NUMBER = '5548999128212';
const CALENDAR_URL = 'https://calendar.google.com/calendar/embed?src=holozonic%40gmail.com&ctz=America%2FSao_Paulo';

// Inicializar Mercado Pago
const mp = new MercadoPago(PUBLIC_KEY, {
    locale: 'pt-BR'
});

// Função para criar preferência de pagamento
async function createPreference() {
    try {
        const response = await fetch('/create_preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    title: 'Consulta Holozonic',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: 390.00
                }]
            })
        });
        const preference = await response.json();
        return preference.id;
    } catch (error) {
        console.error('Erro ao criar preferência:', error);
        return null;
    }
}

// Função para processar pagamento
async function processPayment(formData) {
    try {
        // Salvar dados do formulário
        localStorage.setItem('preAnamnese', JSON.stringify(formData));
        
        // Criar preferência de pagamento
        const preferenceId = await createPreference();
        if (!preferenceId) {
            throw new Error('Erro ao criar preferência de pagamento');
        }

        // Iniciar checkout
        mp.checkout({
            preference: {
                id: preferenceId
            },
            render: {
                container: '.cho-container',
                label: 'Pagar',
            }
        });
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        alert('Erro ao processar pagamento. Por favor, tente novamente.');
    }
}

// Função para redirecionar para WhatsApp
function redirectToWhatsApp(service) {
    const messages = {
        'sono': 'Olá, gostaria de agendar um exame do sono.',
        'imagem': 'Olá, gostaria de agendar um exame de imagem.',
        'avaliacao': 'Olá, gostaria de agendar uma avaliação.',
        'default': 'Olá, gostaria de agendar um atendimento pela clínica Holozonic.'
    };

    const message = encodeURIComponent(messages[service] || messages.default);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

// Função para redirecionar para Google Calendar
function redirectToCalendar() {
    window.open(CALENDAR_URL, '_blank');
}

// Exportar funções
window.HolozonicPayment = {
    processPayment,
    redirectToWhatsApp,
    redirectToCalendar
}; 