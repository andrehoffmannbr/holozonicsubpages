// Sistema de Agendamento e Pagamento - Holozonic
class HolozonicPaymentSystem {
    constructor() {
        this.servicos = {
            // Pacotes Principais
            'laser-acupuntura-pacote': { nome: 'Laser Acupuntura (Pacote 8 sessões)', preco: 576 },
            'moxabustao-pacote': { nome: 'Moxabustão (Pacote 8 sessões)', preco: 720 },
            'ventosaterapia-pacote': { nome: 'Ventosaterapia (Pacote 8 sessões)', preco: 800 },
            'ozonioterapia-pacote': { nome: 'Ozonioterapia (Pacote 8 sessões)', preco: 960 },
            'dietoterapia-chinesa-pacote': { nome: 'Dietoterapia Chinesa (Pacote 8 sessões)', preco: 720 },
            'fitoterapia-suplementacao-pacote': { nome: 'Fitoterapia & Suplementação (Pacote 8 sessões)', preco: 880 },
            
            // Consultas
            'consulta-clinica': { nome: 'Consulta Clínica através do Método MIB', preco: 390 },
            
            // Tratamentos Complementares Individuais
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
        
        this.baseURL = window.location.protocol + '//' + window.location.host;
        
        // Usar Vercel Functions (sempre na mesma URL)
        this.serverURL = this.baseURL;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Sistema de Pagamento Holozonic inicializado');
        console.log('🔍 Debug: Verificando botões disponíveis...');
        
        // Debug - contar todos os botões
        const allButtons = document.querySelectorAll('button');
        console.log(`📊 Total de botões encontrados: ${allButtons.length}`);
        
        allButtons.forEach((btn, index) => {
            console.log(`Botão ${index + 1}: "${btn.textContent.trim()}"`);
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (document.readyState === 'loading') {
            console.log('📅 DOM ainda carregando, aguardando DOMContentLoaded...');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ DOM carregado! Anexando listeners...');
                this.attachButtonListeners();
            });
        } else {
            console.log('✅ DOM já carregado! Anexando listeners imediatamente...');
            this.attachButtonListeners();
        }
    }
    
    attachButtonListeners() {
        // Pacotes principais
        this.attachServiceButton('Laser Acupuntura', 'laser-acupuntura-pacote');
        this.attachServiceButton('Moxabustão', 'moxabustao-pacote');
        this.attachServiceButton('Ventosaterapia', 'ventosaterapia-pacote');
        this.attachServiceButton('Ozonioterapia', 'ozonioterapia-pacote');
        this.attachServiceButton('Dietoterapia Chinesa', 'dietoterapia-chinesa-pacote');
        this.attachServiceButton('Fitoterapia & Suplementação', 'fitoterapia-suplementacao-pacote');
        
        // Consulta clínica
        this.attachServiceButton('Agende sua Consulta', 'consulta-clinica');
        
        // Tratamentos complementares individuais
        this.attachIndividualButtons();
        
        // Exames
        this.attachExamButtons();
        
        // Botões de agendamento geral
        this.attachGeneralAgendamentoButtons();
    }
    
    attachServiceButton(buttonText, serviceId) {
        console.log(`🔍 Procurando botões para: "${buttonText}" (serviceId: ${serviceId})`);
        
        const buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
            const text = btn.textContent.trim();
            const matches = text.includes(buttonText) || text.includes('Agende seu Tratamento');
            if (matches) {
                console.log(`✅ Botão encontrado: "${text}"`);
            }
            return matches;
        });
        
        console.log(`📊 Total de botões encontrados para "${buttonText}": ${buttons.length}`);
        
        buttons.forEach((button, index) => {
            // Evitar adicionar múltiplos listeners
            if (button.dataset.holozonicAttached) {
                console.log(`⚠️ Botão ${index + 1} já tem listener anexado`);
                return;
            }
            
            button.dataset.holozonicAttached = 'true';
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🔥 CLIQUE DETECTADO! Botão: "${button.textContent.trim()}" → Serviço: ${serviceId}`);
                this.redirectToForm(serviceId);
            });
            
            console.log(`✅ Listener anexado ao botão ${index + 1}: "${button.textContent.trim()}"`);
        });
    }
    
    attachIndividualButtons() {
        // Mapear botões individuais por texto e cor
        const individualMappings = [
            { text: 'Laseracupuntura', serviceId: 'laser-acupuntura-individual' },
            { text: 'Moxabustão', serviceId: 'moxabustao-individual' },
            { text: 'Ventosaterapia', serviceId: 'ventosaterapia-individual' },
            { text: 'Dietoterapia Chinesa', serviceId: 'dietoterapia-chinesa-individual' },
            { text: 'Fitoterapia & Suplementação', serviceId: 'fitoterapia-suplementacao-individual' },
            { text: 'Oxigênio-Ozonioterapia Asséptica', serviceId: 'ozonioterapia-individual' },
            { text: 'Feridas', serviceId: 'feridas-presencial' }
        ];
        
        individualMappings.forEach(mapping => {
            const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
                btn.textContent.includes(mapping.text)
            );
            
            buttons.forEach(button => {
                if (button.dataset.holozonicAttached) return;
                button.dataset.holozonicAttached = 'true';
                
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Para tratamento de feridas, verificar se é presencial ou domicílio
                    if (mapping.serviceId === 'feridas-presencial') {
                        if (button.textContent.includes('Domicílio')) {
                            this.redirectToForm('feridas-domicilio');
                        } else {
                            this.redirectToForm('feridas-presencial');
                        }
                    } else {
                        this.redirectToForm(mapping.serviceId);
                    }
                });
            });
        });
        
        // Botões específicos Presencial/Domicílio para feridas - SEM jQuery
        const presencialBtn = this.findElementByText('button', 'Presencial');
        const domicilioBtn = this.findElementByText('button', 'Domicílio');
        
        if (presencialBtn && !presencialBtn.dataset.holozonicAttached) {
            presencialBtn.dataset.holozonicAttached = 'true';
            presencialBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.redirectToForm('feridas-presencial');
            });
        }
        
        if (domicilioBtn && !domicilioBtn.dataset.holozonicAttached) {
            domicilioBtn.dataset.holozonicAttached = 'true';
            domicilioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.redirectToForm('feridas-domicilio');
            });
        }
    }
    
    attachExamButtons() {
        // Exame do Sono
        const exameSonoButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent.includes('Agendar Exame do Sono')
        );
        
        exameSonoButtons.forEach(button => {
            if (button.dataset.holozonicAttached) return;
            button.dataset.holozonicAttached = 'true';
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.redirectToForm('exame-sono');
            });
        });
        
        // Biorressonância
        const bioButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent.includes('Biorressonância')
        );
        
        bioButtons.forEach(button => {
            if (button.dataset.holozonicAttached) return;
            button.dataset.holozonicAttached = 'true';
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.redirectToForm('bioressonnancia');
            });
        });
        
        // Oxigenio-ozonioterapia Estética
        const esteticaButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent.includes('Quero Agendar Minha Consulta') ||
            btn.textContent.includes('Agende sua Avaliação')
        );
        
        esteticaButtons.forEach(button => {
            if (button.dataset.holozonicAttached) return;
            button.dataset.holozonicAttached = 'true';
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.redirectToForm('oxigenio-estetica');
            });
        });
    }
    
    attachGeneralAgendamentoButtons() {
        // Botões gerais de agendamento
        const generalButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent.includes('Agendamento Online') ||
            btn.textContent.includes('Agendar Agora') ||
            btn.textContent.includes('Agendar')
        );
        
        generalButtons.forEach(button => {
            if (button.dataset.holozonicAttached) return;
            button.dataset.holozonicAttached = 'true';
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showServiceSelector();
            });
        });
    }
    
    redirectToForm(serviceId) {
        const servico = this.servicos[serviceId];
        
        if (!servico) {
            console.error('❌ Serviço não encontrado:', serviceId);
            alert('Serviço não encontrado. Entre em contato conosco.');
            return;
        }
        
        console.log('📋 Redirecionando para formulário:', servico.nome);
        
        // Construir URL do formulário com parâmetros
        const formURL = `formulario-preanamnese.html?servico=${encodeURIComponent(servico.nome)}&valor=${servico.preco}&serviceId=${serviceId}`;
        
        // Redirecionar
        window.location.href = formURL;
    }
    
    showServiceSelector() {
        // Modal para seleção de serviço quando botão genérico é clicado
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-2xl max-h-96 overflow-y-auto">
                <h3 class="text-2xl font-bold mb-6 text-primary">Selecione um Serviço</h3>
                <div class="grid md:grid-cols-2 gap-4">
                    ${Object.entries(this.servicos).map(([id, data]) => `
                        <button onclick="holozonicPayment.redirectToForm('${id}')" 
                                class="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <h4 class="font-semibold text-gray-800">${data.nome}</h4>
                            <p class="text-primary font-bold">R$ ${data.preco}</p>
                        </button>
                    `).join('')}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="mt-6 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    async createPayment(serviceId, userData) {
        const servico = this.servicos[serviceId];
        
        if (!servico) {
            throw new Error('Serviço não encontrado');
        }
        
        try {
            const response = await fetch(`${this.serverURL}/criar-pagamento`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    servicoId: serviceId,
                    servicoNome: servico.nome,
                    valor: servico.preco,
                    userData: userData
                })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao criar pagamento');
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao criar pagamento:', error);
            throw error;
        }
    }
    
    // Método para ser chamado pelo formulário de pré-anamnese
    async processFormSubmission(formData, serviceId) {
        try {
            console.log('📝 Processando envio do formulário para:', serviceId);
            
            // Aqui você pode enviar os dados do formulário para o Formspree
            // e depois redirecionar para o pagamento
            
            const paymentData = await this.createPayment(serviceId, formData);
            
            // Redirecionar para checkout do Mercado Pago
            window.location.href = paymentData.init_point;
            
                } catch (error) {
            console.error('❌ Erro ao processar formulário:', error);
            alert('Erro ao processar pagamento. Tente novamente ou entre em contato conosco.');
        }
    }
    
    // Função para encontrar elementos por texto - Substituindo jQuery :contains()
    findElementByText(selector, text) {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.find(el => el.textContent.includes(text));
    }
    
    // Função para encontrar múltiplos elementos por texto
    findElementsByText(selector, text) {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.filter(el => el.textContent.includes(text));
    }
}

// Inicializar sistema quando o DOM carregar
let holozonicPayment;

document.addEventListener('DOMContentLoaded', function() {
    holozonicPayment = new HolozonicPaymentSystem();
    
    // Tornar disponível globalmente para uso em outros scripts
    window.holozonicPayment = holozonicPayment;
}); 