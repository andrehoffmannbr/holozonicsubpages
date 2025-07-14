// Holozonic Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupMobileMenu();
    setupMegaMenu();
    setupScrollEffects();
    setupFormHandling();
    setupAgendamentoButtons();
    setupVitaLinPlans();
    setupSmoothScrolling();
    setupProgressBars();
    setupIntersectionObserver();
    setupModalHandlers();
    setupMonitoramentoInteligente();
    setupPreAnamneseProtection();
    setupPWA();
}

// Mobile Menu Functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
                isMenuOpen = false;
            });
        });
    }
}

// Mega Menu Functionality
function setupMegaMenu() {
    const megaMenu = document.getElementById('mega-menu');
    const menuButtons = document.querySelectorAll('nav button');
    let megaMenuTimeout;

    menuButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            clearTimeout(megaMenuTimeout);
            megaMenu.classList.remove('hidden');
        });

        button.addEventListener('mouseleave', function() {
            megaMenuTimeout = setTimeout(() => {
                if (!megaMenu.matches(':hover')) {
                    megaMenu.classList.add('hidden');
                }
            }, 300);
        });
    });

    megaMenu.addEventListener('mouseenter', function() {
        clearTimeout(megaMenuTimeout);
    });

    megaMenu.addEventListener('mouseleave', function() {
        megaMenu.classList.add('hidden');
    });
}

// Scroll Effects
function setupScrollEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('bg-white/95', 'backdrop-blur-sm');
            } else {
                header.classList.remove('bg-white/95', 'backdrop-blur-sm');
            }

            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
    });
}

// Form Handling with Formspree
function setupFormHandling() {
    const form = document.getElementById('pre-anamnese-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            submitButton.disabled = true;
            
            try {
                const response = await fetch('https://formspree.io/f/your_form_id', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('Formulário enviado com sucesso! Entraremos em contato em breve.', 'success');
                    form.reset();
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Erro ao enviar formulário. Tente novamente.', 'error');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Agendamento Buttons
function setupAgendamentoButtons() {
    const agendamentoButtons = document.querySelectorAll('#agendamento-btn, #hero-agendamento');
    
    agendamentoButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simulate Portal Telemedicina integration
            showAgendamentoModal();
        });
    });
    
    // Teste do Ronco Gratuito Button
    const testeRoncoButton = document.getElementById('teste-ronco-btn');
    if (testeRoncoButton) {
        testeRoncoButton.addEventListener('click', function() {
            showTesteRoncoModal();
        });
    }
}

// VitaLin Plans
function setupVitaLinPlans() {
    const planButtons = document.querySelectorAll('[class*="Assinar Plano"], [class*="bg-primary"], [class*="bg-secondary"], [class*="bg-accent"]');
    
    planButtons.forEach(button => {
        if (button.textContent.includes('Assinar')) {
            button.addEventListener('click', function() {
                const planType = this.textContent.includes('Mensal') ? 'mensal' : 
                               this.textContent.includes('Trimestral') ? 'trimestral' : 'anual';
                showVitaLinModal(planType);
            });
        }
    });
}

// Smooth Scrolling for anchor links
function setupSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Progress Bars Animation
function setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const width = bar.parentElement.getAttribute('data-width') || '75%';
                bar.style.width = width;
            }
        });
    };

    window.addEventListener('scroll', animateProgressBars);
    animateProgressBars(); // Initial check
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.card-hover, .service-icon, section > div');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Modal Handlers
function setupModalHandlers() {
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Show Agendamento Modal
function showAgendamentoModal() {
    const modalHTML = `
        <div class="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
                
                <div class="text-center mb-6">
                    <div class="text-4xl text-primary mb-4">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-primary mb-2">Agendamento Online</h3>
                    <p class="text-gray-600">Escolha como deseja agendar sua consulta</p>
                </div>
                
                <div class="space-y-4">
                    <button onclick="openPortalTelemedicina()" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-external-link-alt mr-2"></i>
                        Portal Telemedicina
                    </button>
                    
                    <button onclick="openWhatsApp()" class="w-full bg-secondary text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fab fa-whatsapp mr-2"></i>
                        WhatsApp
                    </button>
                    
                    <button onclick="openTeleconsulta()" class="w-full bg-accent text-white py-3 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fas fa-video mr-2"></i>
                        Teleconsulta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

// Show VitaLin Modal
function showVitaLinModal(planType) {
    const plans = {
        mensal: { price: 'R$ 299', period: 'mês' },
        trimestral: { price: 'R$ 799', period: 'trimestre' },
        anual: { price: 'R$ 2.599', period: 'ano' }
    };
    
    const plan = plans[planType];
    
    const modalHTML = `
        <div class="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
                
                <div class="text-center mb-6">
                    <div class="text-4xl text-accent mb-4">
                        <i class="fas fa-crown"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-accent mb-2">VitaLin ${planType.charAt(0).toUpperCase() + planType.slice(1)}</h3>
                    <p class="text-3xl font-bold text-gray-800">${plan.price}<span class="text-lg text-gray-500">/${plan.period}</span></p>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div class="text-center text-gray-600">
                        Confirme sua assinatura do plano VitaLin
                    </div>
                </div>
                
                <div class="space-y-4">
                    <button onclick="processPlanSubscription('${planType}')" class="w-full bg-accent text-white py-3 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fas fa-credit-card mr-2"></i>
                        Confirmar Assinatura
                    </button>
                    
                    <button onclick="closeModal()" class="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Show Teste do Ronco Modal
function showTesteRoncoModal() {
    const modalHTML = `
        <div class="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
                
                <div class="text-center mb-6">
                    <div class="text-4xl text-orange-500 mb-4">
                        <i class="fas fa-volume-up"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-orange-600 mb-2">Teste do Ronco Gratuito</h3>
                    <p class="text-gray-600">Preencha o formulário abaixo e entraremos em contato</p>
                </div>
                
                <form id="teste-ronco-form" class="space-y-4">
                    <input type="hidden" name="_to" value="holozonic@gmail.com">
                    <input type="hidden" name="_subject" value="Teste do Ronco Gratuito - Novo Formulário">
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                        <input type="text" name="nome" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Telefone (WhatsApp)</label>
                        <input type="tel" name="telefone" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <input type="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Descreva seu problema e sua necessidade</label>
                        <textarea name="problema" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"></textarea>
                    </div>
                    
                    <button type="submit" class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
                        <i class="fas fa-paper-plane mr-2"></i>
                        Enviar Formulário
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Setup form submission
    const form = document.getElementById('teste-ronco-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch('https://formspree.io/f/your_form_id', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Formulário enviado com sucesso! Entraremos em contato em breve.', 'success');
                closeModal();
            } else {
                throw new Error('Erro no envio');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Erro ao enviar formulário. Tente novamente.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Portal Telemedicina
function openPortalTelemedicina() {
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'portal_telemedicina_access', {
            event_category: 'engagement',
            event_label: 'Portal Telemedicina Button Click'
        });
    }
    
    showNotification('Conectando ao Portal de Telemedicina...', 'info');
    
    setTimeout(() => {
        // Simulate successful appointment scheduling
        showNotification('Agendamento realizado com sucesso! Formulário de pré-anamnese liberado.', 'success');
        closeModal();
        
        // Liberar acesso ao formulário de pré-anamnese após agendamento
        scheduleAppointment();
    }, 2000);
}

// WhatsApp Business
function openWhatsApp() {
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_contact', {
            event_category: 'engagement',
            event_label: 'WhatsApp Button Click'
        });
    }
    
    const phoneNumber = '5511999998888';
    const message = encodeURIComponent('Olá! Gostaria de agendar uma consulta na Clínica Holozonic.');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    
    showNotification('Redirecionando para WhatsApp...', 'info');
    
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        closeModal();
    }, 1000);
}

// Teleconsulta
function openTeleconsulta() {
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'teleconsulta_initiated', {
            event_category: 'engagement',
            event_label: 'Teleconsulta Button Click'
        });
    }
    
    // Simulate Portal integration - redirect to teleconsulta
    // In a real implementation, this would integrate with your teleconsulta system
    showNotification('Redirecionando para a plataforma de teleconsulta...', 'info');
    
    setTimeout(() => {
        // Replace with actual teleconsulta URL
        window.open('https://teleconsulta.holozonic.com.br', '_blank');
    }, 1500);
}

// Plan Subscription Processing
function processPlanSubscription(planType) {
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'plan_subscription', {
            event_category: 'conversion',
            event_label: planType,
            value: planType === 'anual' ? 2599 : planType === 'trimestral' ? 799 : 299
        });
    }
    
    // Simulate payment processing
    showNotification('Processando assinatura do plano ' + planType + '...', 'info');
    
    setTimeout(() => {
        showNotification('Assinatura confirmada! Bem-vindo ao VitaLin ' + planType + '!', 'success');
        
        // Liberar acesso ao formulário de pré-anamnese após compra
        completePurchase();
    }, 3000);
}

// Notification System
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    const notificationHTML = `
        <div class="notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300">
            <div class="flex items-center">
                <i class="${icons[type]} mr-3"></i>
                <span>${message}</span>
                <button onclick="closeNotification(this)" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    
    const notification = document.querySelector('.notification:last-child');
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('button'));
        }
    }, 5000);
}

// Close Notification
function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.classList.add('translate-x-full');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Loja Integrada API Integration
async function setupLojaIntegrada() {
    try {
        // In a real implementation, use your actual API keys
        const apiUrl = 'https://api.lojaintegrada.com.br/v1/produto';
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer YOUR_API_TOKEN'
        };

        // This is a placeholder for the actual integration
        console.log('Loja Integrada API setup ready');
        
    } catch (error) {
        console.error('Erro na integração com Loja Integrada:', error);
    }
}

// Performance Optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
}

// Initialize performance optimizations
optimizeImages();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error reporting service
});

// PWA Configuration and Service Worker
function setupPWA() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('🔧 Service Worker registrado:', registration.scope);
                    
                    // Verificar atualizações
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('❌ Falha no registro do Service Worker:', error);
                });
        });
    }
    
    // Prompt de instalação PWA
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar botão de instalação após 10 segundos
        setTimeout(() => {
            if (!isPWA()) {
                showInstallPrompt(deferredPrompt);
            }
        }, 10000);
    });
    
    // Verificar se já está instalado como PWA
    if (isPWA()) {
        console.log('📱 Rodando como PWA');
        // Adicionar estilos específicos para PWA se necessário
        document.body.classList.add('pwa-mode');
    }
}

// Verificar se é PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
}

// Mostrar prompt de instalação
function showInstallPrompt(deferredPrompt) {
    const installBanner = document.createElement('div');
    installBanner.className = 'fixed bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm';
    installBanner.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h4 class="font-bold">Instalar App Holozonic</h4>
                <p class="text-sm opacity-90">Acesso rápido e funcionamento offline</p>
            </div>
            <div class="flex space-x-2 ml-4">
                <button id="install-pwa" class="bg-white text-primary px-3 py-1 rounded text-sm font-medium">
                    Instalar
                </button>
                <button id="dismiss-install" class="text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(installBanner);
    
    // Event listeners
    document.getElementById('install-pwa').addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('📱 PWA instalado pelo usuário');
                    showNotification('App Holozonic instalado com sucesso!', 'success');
                }
                deferredPrompt = null;
                installBanner.remove();
            });
        }
    });
    
    document.getElementById('dismiss-install').addEventListener('click', () => {
        installBanner.remove();
    });
}

// Mostrar notificação de atualização
function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'fixed top-4 left-4 right-4 bg-secondary text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm';
    updateBanner.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h4 class="font-bold">🔄 Atualização Disponível</h4>
                <p class="text-sm opacity-90">Nova versão do app disponível</p>
            </div>
            <div class="flex space-x-2 ml-4">
                <button id="update-app" class="bg-white text-secondary px-3 py-1 rounded text-sm font-medium">
                    Atualizar
                </button>
                <button id="dismiss-update" class="text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(updateBanner);
    
    // Event listeners
    document.getElementById('update-app').addEventListener('click', () => {
        window.location.reload();
    });
    
    document.getElementById('dismiss-update').addEventListener('click', () => {
        updateBanner.remove();
    });
}

// Monitoramento Inteligente
function setupMonitoramentoInteligente() {
    const btnAtivarMonitoramento = document.getElementById('ativar-monitoramento');
    
    if (btnAtivarMonitoramento) {
        btnAtivarMonitoramento.addEventListener('click', function() {
            const originalText = this.innerHTML;
            
            // Simular ativação do monitoramento
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Ativando Monitoramento...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check mr-2"></i>Monitoramento Ativo';
                this.classList.remove('bg-primary', 'hover:bg-blue-600');
                this.classList.add('bg-green-500', 'hover:bg-green-600');
                
                showNotification('Monitoramento Inteligente ativado com sucesso!', 'success');
                
                // Atualizar status no dashboard
                const statusElement = document.querySelector('.text-green-300');
                if (statusElement) {
                    statusElement.textContent = 'Monitoramento Ativo';
                }
            }, 2000);
        });
    }
}

// Proteção do Formulário de Pré-Anamnese
function setupPreAnamneseProtection() {
    const preAnamneseSection = document.getElementById('pre-anamnese');
    const btnAgendar = document.getElementById('btn-agendar');
    const btnComprar = document.getElementById('btn-comprar');
    
    if (btnAgendar) {
        btnAgendar.addEventListener('click', function() {
            showAgendamentoModal();
        });
    }
    
    if (btnComprar) {
        btnComprar.addEventListener('click', function() {
            // Redirecionar para a seção VitaLin
            const vitaLinSection = document.getElementById('vitalin');
            if (vitaLinSection) {
                vitaLinSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Verificar se há token de acesso (simulação)
    checkPreAnamneseAccess();
}

// Verificar acesso ao formulário
function checkPreAnamneseAccess() {
    // Simular verificação de token/autenticação
    const accessToken = localStorage.getItem('pre_anamnese_access');
    const hasCompletedPurchase = localStorage.getItem('purchase_completed');
    const hasScheduledAppointment = localStorage.getItem('appointment_scheduled');
    
    if (accessToken && (hasCompletedPurchase || hasScheduledAppointment)) {
        unlockPreAnamneseForm();
    }
}

// Desbloquear formulário de pré-anamnese
function unlockPreAnamneseForm() {
    const preAnamneseSection = document.getElementById('pre-anamnese');
    const acessoNegado = document.getElementById('acesso-negado');
    const formularioAnamnese = document.getElementById('formulario-anamnese');
    
    if (preAnamneseSection && acessoNegado && formularioAnamnese) {
        preAnamneseSection.classList.remove('hidden');
        acessoNegado.classList.add('hidden');
        formularioAnamnese.classList.remove('hidden');
        
        showNotification('Formulário de Pré-Anamnese liberado!', 'success');
    }
}

// Simular conclusão de compra (para testes)
function completePurchase() {
    localStorage.setItem('purchase_completed', 'true');
    localStorage.setItem('pre_anamnese_access', generateAccessToken());
    unlockPreAnamneseForm();
}

// Simular agendamento (para testes)
function scheduleAppointment() {
    localStorage.setItem('appointment_scheduled', 'true');
    localStorage.setItem('pre_anamnese_access', generateAccessToken());
    unlockPreAnamneseForm();
}

// Gerar token de acesso
function generateAccessToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export functions for global access
window.closeModal = closeModal;
window.closeNotification = closeNotification;
window.openPortalTelemedicina = openPortalTelemedicina;
window.openWhatsApp = openWhatsApp;
window.openTeleconsulta = openTeleconsulta;
window.processPlanSubscription = processPlanSubscription; 