// Formulário de Pré-Anamnese

// Utilitário para log seguro (mantém consistência com main.js)
const log = {
    info: (msg, ...args) => console.info(`[Holozonic Form] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[Holozonic Form] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[Holozonic Form] ${msg}`, ...args)
};

// Função segura para remover elemento
function safeRemoveElement(selector) {
    try {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
            return true;
        }
        return false;
    } catch (error) {
        log.error(`Erro ao remover elemento ${selector}:`, error);
        return false;
    }
}

function showPreAnamneseForm() {
    log.info('Abrindo formulário de pré-anamnese...');
    
    // Remover formulário existente se houver
    safeRemoveElement('.modal-overlay');
    
    try {
        const modalHTML = `
            <div class="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                    <button type="button" onclick="window.PreAnamnese?.closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                    
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-primary mb-2">Formulário de Pré-Anamnese</h3>
                        <p class="text-gray-600">Por favor, preencha as informações abaixo</p>
                    </div>
                    
                    <form id="preAnamneseForm" class="space-y-4">
                        <!-- Dados Pessoais -->
                        <div class="space-y-2">
                            <label class="block text-gray-700 font-medium">Nome Completo</label>
                            <input type="text" name="nome" required
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="block text-gray-700 font-medium">Data de Nascimento</label>
                                <input type="date" name="nascimento" required
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                            </div>
                            <div class="space-y-2">
                                <label class="block text-gray-700 font-medium">Telefone</label>
                                <input type="tel" name="telefone" required
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                            </div>
                        </div>
                        
                        <!-- Histórico de Saúde -->
                        <div class="space-y-2">
                            <label class="block text-gray-700 font-medium">Queixas Principais</label>
                            <textarea name="queixas" rows="3" required
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-gray-700 font-medium">Medicamentos em Uso</label>
                            <textarea name="medicamentos" rows="2"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-gray-700 font-medium">Alergias</label>
                            <input type="text" name="alergias"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                        </div>
                        
                        <!-- Botões -->
                        <div class="flex justify-end space-x-4 pt-4">
                            <button type="button" onclick="window.PreAnamnese?.closeModal()"
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit"
                                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                                Prosseguir para Pagamento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        log.info('Formulário inserido no DOM');
        setupFormListeners();
    } catch (error) {
        log.error('Erro ao criar formulário:', error);
        alert('Erro ao abrir formulário. Por favor, tente novamente.');
    }
}

function closePreAnamneseModal() {
    log.info('Fechando formulário...');
    if (safeRemoveElement('.modal-overlay')) {
        log.info('Formulário removido do DOM');
    } else {
        log.warn('Modal não encontrado para fechar');
    }
}

function setupFormListeners() {
    log.info('Configurando listeners do formulário...');
    const form = document.getElementById('preAnamneseForm');
    
    if (!form) {
        log.error('Formulário não encontrado para configurar listeners');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        log.info('Formulário enviado');
        
        try {
            // Coletar dados do formulário
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            log.info('Dados do formulário:', data);
            
            // Fechar modal do formulário
            closePreAnamneseModal();
            
            // Processar pagamento
            if (window.HolozonicPayment?.processPayment) {
                await window.HolozonicPayment.processPayment(data);
            } else {
                throw new Error('Função de processamento de pagamento não encontrada');
            }
        } catch (error) {
            log.error('Erro ao processar formulário:', error);
            alert('Ocorreu um erro ao processar o formulário. Por favor, tente novamente.');
        }
    });
    
    log.info('Listener de submit configurado');
}

// Exportar funções
window.PreAnamnese = {
    showForm: showPreAnamneseForm,
    closeModal: closePreAnamneseModal
}; 