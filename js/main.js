/*
====================================
MAIN SCRIPT
====================================
*/

// ==================== CONFIGURATION ====================
const CONFIG = {
    // EmailJS Configuration
    EMAILJS_SERVICE_ID: 'service_eqf5prm',
    EMAILJS_TEMPLATE_ID: 'template_sqpcdvc',
    EMAILJS_PUBLIC_KEY: 'DYWsLsM_S2oFFi2WS',

    DEBUG: false
};

// ==================== FORMULAIRE DE CONTACT ====================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusElement = document.getElementById('formStatus');
        this.submitButton = null;
        
        if (this.form) {
            this.submitButton = this.form.querySelector('button[type="submit"]');
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = window.i18n?.t('contact.form.required') || 'Ce champ est requis';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = window.i18n?.t('contact.form.invalid-email') || 'Email invalide';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.hideFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.hideFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentElement.appendChild(errorDiv);
        field.style.borderColor = 'var(--color-error)';
    }
    
    hideFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }
    
    async handleSubmit(e) {
        e.preventDefault();

        let isFormValid = true;
        this.form.querySelectorAll('input, textarea').forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showStatus('error', window.i18n?.t('contact.form.validation-error') || 'Veuillez corriger les erreurs');
            return;
        }

        this.setLoading(true);

        const templateParams = {
            from_name: this.form.name.value.trim(),
            from_email: this.form.email.value.trim(),
            subject: this.form.subject.value.trim(),
            message: this.form.message.value.trim()
        };

        try {
            emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);

            const response = await emailjs.send(
                CONFIG.EMAILJS_SERVICE_ID,
                CONFIG.EMAILJS_TEMPLATE_ID,
                templateParams
            );

            if (response.status === 200) {
                this.showStatus('success', window.i18n?.t('contact.form.success') || 'Message envoyé avec succès');
                this.form.reset();

                if (CONFIG.DEBUG) {
                    console.log('Email envoyé avec succès via EmailJS');
                }

                if (window.gtag) {
                    gtag('event', 'form_submit', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form EmailJS'
                    });
                }
            } else {
                throw new Error('Erreur EmailJS');
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            this.showStatus('error', window.i18n?.t('contact.form.error') || 'Une erreur s\'est produite. Veuillez réessayer.');
        } finally {
            this.setLoading(false);
        }
    }
    
    simulateSend() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setLoading(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Envoi...</span>';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = `<i class="fas fa-paper-plane"></i> <span data-i18n="contact.form.send">Envoyer le message</span>`;
            if (window.i18n) {
                const span = this.submitButton.querySelector('span');
                span.textContent = window.i18n.t('contact.form.send');
            }
        }
    }
    
    showStatus(type, message) {
        if (!this.statusElement) return;
        
        this.statusElement.className = `form-status ${type}`;
        this.statusElement.textContent = message;
        this.statusElement.style.display = 'block';
        
        setTimeout(() => {
            this.statusElement.style.display = 'none';
        }, 5000);
        
        this.statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ==================== UTILITAIRES ====================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function initEmailCopy() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const email = link.href.replace('mailto:', '');
                
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copié !');
                });
            }
        });
    });
}

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--color-bg-elevated);
        color: var(--color-text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-modal);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function logPerformance() {
    if (!CONFIG.DEBUG) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('📊 Performance:');
            console.log(`  Page Load: ${pageLoadTime}ms`);
            console.log(`  Connect Time: ${connectTime}ms`);
            console.log(`  Render Time: ${renderTime}ms`);
        }, 0);
    });
}

function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    if (window.themeManager) {
        window.themeManager.applyTheme('matrix');
    }
    
    showToast('🎮 Konami Code activated! Matrix mode enabled!', 5000);
    
    document.body.style.animation = 'matrix-glitch 0.5s';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    
    initLazyLoading();
    initEmailCopy();
    initKonamiCode();
    logPerformance();
    
    if (CONFIG.DEBUG) {
        console.log(
            '%cPortfolio',
            'font-size: 20px; font-weight: bold; color: #667eea;'
        );
        console.log(
            '%cCybersécurité & Infrastructure',
            'font-size: 14px; color: #64748b;'
        );
        console.log(
            '%c\n💡 Tips:\n' +
            '- Ctrl/Cmd + Shift + T pour changer de thème\n' +
            '- Ctrl/Cmd + Click sur un email pour le copier\n' +
            '- Essayez le Konami Code 😉',
            'font-size: 12px; color: #94a3b8;'
        );
    }
});

// ==================== SERVICE WORKER ====================
if ('serviceWorker' in navigator && CONFIG.DEBUG === false) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

window.portfolioDebug = {
    config: CONFIG,
    theme: () => window.themeManager?.getCurrentTheme(),
    lang: () => window.i18n?.getCurrentLanguage(),
    toast: showToast
};