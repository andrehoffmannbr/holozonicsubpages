// Formulário de Pré-Anamnese
function showPreAnamneseForm() {
    const modalHTML = `
        <div class="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button onclick="closePreAnamneseModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
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
                        <button type="button" onclick="closePreAnamneseModal()"
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
    setupFormListeners();
}

function closePreAnamneseModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function setupFormListeners() {
    const form = document.getElementById('preAnamneseForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Fechar modal do formulário
            closePreAnamneseModal();
            
            // Processar pagamento
            await window.HolozonicPayment.processPayment(data);
        });
    }
}

// Exportar funções
window.PreAnamnese = {
    showForm: showPreAnamneseForm,
    closeModal: closePreAnamneseModal
}; 