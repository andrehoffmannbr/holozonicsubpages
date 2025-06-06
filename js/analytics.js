// Google Analytics 4 - Configuração Avançada para Holozonic
// Configuração personalizada para clínica médica

// Configurações do GA4
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Substitua pelo seu Measurement ID real
const DEBUG_MODE = window.location.hostname === 'localhost';

// Inicializar Google Analytics
function initializeAnalytics() {
    if (!window.gtag) {
        console.warn('Google Analytics não carregou corretamente');
        return;
    }

    // Configuração base
    gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: true,
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
            'custom_parameter_1': 'section_viewed',
            'custom_parameter_2': 'user_journey_step'
        },
        // Conformidade com LGPD/GDPR
        anonymize_ip: true,
        allow_google_signals: false, // Ativar apenas com consentimento
        allow_ad_personalization_signals: false
    });

    // Debug mode para desenvolvimento
    if (DEBUG_MODE) {
        gtag('config', GA_MEASUREMENT_ID, {
            debug_mode: true
        });
        console.log('🔍 Google Analytics em modo debug');
    }

    console.log('📊 Google Analytics inicializado');
}

// Tracking de eventos personalizados
const trackEvent = (eventName, parameters = {}) => {
    if (!window.gtag) {
        console.warn('gtag não disponível para tracking:', eventName);
        return;
    }

    const eventData = {
        event_category: parameters.category || 'engagement',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters
    };

    gtag('event', eventName, eventData);
    
    if (DEBUG_MODE) {
        console.log('📈 Evento trackado:', eventName, eventData);
    }
};

// Eventos específicos da Holozonic
const HolozonicAnalytics = {
    // Agendamento
    trackAgendamento: (method) => {
        trackEvent('agendamento_iniciado', {
            category: 'conversions',
            method: method, // 'portal_telemedicina', 'whatsapp', 'teleconsulta'
            label: `Agendamento via ${method}`,
            value: 1
        });
    },

    // Planos VitaLin
    trackVitaLinInterest: (planType) => {
        trackEvent('vitalin_interesse', {
            category: 'lead_generation',
            plan_type: planType,
            label: `Interesse no plano ${planType}`,
            value: getPlanValue(planType)
        });
    },

    trackVitaLinSubscription: (planType) => {
        trackEvent('purchase', {
            transaction_id: generateTransactionId(),
            value: getPlanValue(planType),
            currency: 'BRL',
            items: [{
                item_id: `vitalin_${planType}`,
                item_name: `VitaLin ${planType}`,
                category: 'subscription',
                quantity: 1,
                price: getPlanValue(planType)
            }]
        });
    },

    // Formulário de Pré-Anamnese
    trackFormSubmission: (formData) => {
        trackEvent('form_submit', {
            category: 'lead_generation',
            form_name: 'pre_anamnese',
            label: 'Formulário de Pré-Anamnese',
            value: 1,
            user_age_group: getAgeGroup(formData.idade),
            health_interest: formData.objetivos ? 'specified' : 'general'
        });
    },

    // Navegação por seções
    trackSectionView: (sectionName) => {
        trackEvent('page_view', {
            page_title: `${document.title} - ${sectionName}`,
            page_location: `${window.location.href}#${sectionName}`,
            section_name: sectionName,
            category: 'navigation'
        });
    },

    // Engajamento com vídeo
    trackVideoEngagement: (action, progress = 0) => {
        trackEvent('video_' + action, {
            category: 'engagement',
            video_name: 'hero_background',
            video_progress: progress,
            label: `Vídeo ${action} - ${progress}%`
        });
    },

    // Cliques em serviços
    trackServiceClick: (serviceName) => {
        trackEvent('service_click', {
            category: 'engagement',
            service_name: serviceName,
            label: `Clique em ${serviceName}`,
            value: 1
        });
    },

    // Tempo na página
    trackTimeOnPage: (timeInSeconds) => {
        const timeCategory = getTimeCategory(timeInSeconds);
        
        trackEvent('page_engagement', {
            category: 'engagement',
            engagement_time_msec: timeInSeconds * 1000,
            time_category: timeCategory,
            label: `Tempo na página: ${timeCategory}`
        });
    },

    // Downloads (futuros)
    trackDownload: (fileName, fileType) => {
        trackEvent('file_download', {
            category: 'downloads',
            file_name: fileName,
            file_type: fileType,
            label: `Download: ${fileName}`
        });
    },

    // Erros e problemas
    trackError: (errorType, errorMessage) => {
        trackEvent('exception', {
            description: errorMessage,
            fatal: false,
            error_type: errorType,
            category: 'errors'
        });
    },

    // Performance
    trackPerformance: (metricName, value) => {
        trackEvent('performance_metric', {
            category: 'performance',
            metric_name: metricName,
            metric_value: value,
            label: `${metricName}: ${value}ms`
        });
    }
};

// Funções auxiliares
function getPlanValue(planType) {
    const values = {
        'mensal': 299,
        'trimestral': 799,
        'anual': 2599
    };
    return values[planType] || 0;
}

function getAgeGroup(age) {
    if (age < 18) return 'menor_18';
    if (age < 30) return '18_29';
    if (age < 50) return '30_49';
    if (age < 65) return '50_64';
    return 'maior_65';
}

function getTimeCategory(seconds) {
    if (seconds < 30) return 'bounce';
    if (seconds < 60) return 'quick_visit';
    if (seconds < 180) return 'moderate_engagement';
    if (seconds < 300) return 'good_engagement';
    return 'high_engagement';
}

function generateTransactionId() {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Tracking automático de scroll
let maxScroll = 0;
let scrollMilestones = [25, 50, 75, 90, 100];
let trackedMilestones = [];

function trackScrollDepth() {
    const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    maxScroll = Math.max(maxScroll, scrollPercent);
    
    scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
            trackedMilestones.push(milestone);
            trackEvent('scroll', {
                category: 'engagement',
                percent_scrolled: milestone,
                label: `Scroll ${milestone}%`
            });
        }
    });
}

// Tracking de elementos em viewport
function setupIntersectionTracking() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elementId = entry.target.id || entry.target.className;
                const sectionName = getSectionName(entry.target);
                
                if (sectionName) {
                    HolozonicAnalytics.trackSectionView(sectionName);
                }
            }
        });
    }, {
        threshold: 0.5 // 50% do elemento visível
    });

    // Observar seções principais
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
}

function getSectionName(element) {
    const sectionMap = {
        'hero': 'Hero',
        'sobre': 'Sobre Holozonic',
        'medicina-chinesa': 'Medicina Chinesa',
        'oxigenio': 'Oxigenioozonioterapia',
        'exames': 'Exames',
        'vitalin': 'VitaLin',
        'servicos': 'Serviços',
        'pre-anamnese': 'Pré-Anamnese',
        'monitoramento': 'Monitoramento'
    };
    
    return sectionMap[element.id] || null;
}

// Tracking de performance
function trackWebVitals() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            HolozonicAnalytics.trackPerformance('LCP', Math.round(lastEntry.startTime));
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                HolozonicAnalytics.trackPerformance('FID', Math.round(entry.processingStart - entry.startTime));
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            HolozonicAnalytics.trackPerformance('CLS', Math.round(clsValue * 1000) / 1000);
        }).observe({ entryTypes: ['layout-shift'] });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    setupIntersectionTracking();
    trackWebVitals();
    
    // Tracking de scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });
    
    // Tracking de tempo na página
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        HolozonicAnalytics.trackTimeOnPage(timeOnPage);
    });
});

// Exportar para uso global
window.HolozonicAnalytics = HolozonicAnalytics;
window.trackEvent = trackEvent;

// Conformidade com LGPD
const CookieConsent = {
    show: function() {
        if (!localStorage.getItem('holozonic_cookie_consent')) {
            this.createBanner();
        }
    },
    
    createBanner: function() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50';
        banner.innerHTML = `
            <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
                <div class="mb-4 md:mb-0">
                    <p class="text-sm">
                        🍪 Utilizamos cookies para melhorar sua experiência e analisar o desempenho do site. 
                        Ao continuar navegando, você concorda com nossa política de privacidade.
                    </p>
                </div>
                <div class="space-x-4">
                    <button onclick="CookieConsent.accept()" class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
                        Aceitar
                    </button>
                    <button onclick="CookieConsent.decline()" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Recusar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
    },
    
    accept: function() {
        localStorage.setItem('holozonic_cookie_consent', 'accepted');
        localStorage.setItem('holozonic_analytics_consent', 'true');
        this.removeBanner();
        
        // Reativar Google Analytics
        gtag('consent', 'update', {
            analytics_storage: 'granted'
        });
    },
    
    decline: function() {
        localStorage.setItem('holozonic_cookie_consent', 'declined');
        localStorage.setItem('holozonic_analytics_consent', 'false');
        this.removeBanner();
        
        // Desativar Google Analytics
        gtag('consent', 'update', {
            analytics_storage: 'denied'
        });
    },
    
    removeBanner: function() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.remove();
        }
    }
};

// Mostrar banner de cookies
document.addEventListener('DOMContentLoaded', () => {
    CookieConsent.show();
});

// Exportar CookieConsent para uso global
window.CookieConsent = CookieConsent; 