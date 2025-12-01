// Theme Toggle
let currentTheme = 'light';

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('themeToggle').textContent = currentTheme === 'light' ? '🌙' : '☀️';
    localStorage.setItem('theme', currentTheme);
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').textContent = savedTheme === 'light' ? '🌙' : '☀️';
});

// Language Toggle
let currentLang = 'fr';

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    const langFlag = document.getElementById('langFlag');
    
    // Change flag image
    if (currentLang === 'fr') {
        langFlag.src = 'assets/flag_en.webp';
        langFlag.alt = 'English';
    } else {
        langFlag.src = 'assets/flag_fr.webp';
        langFlag.alt = 'Français';
    }
    
    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-fr][data-en]').forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = element.getAttribute(`data-${currentLang}`);
        } else {
            element.textContent = element.getAttribute(`data-${currentLang}`);
        }
    });

    localStorage.setItem('language', currentLang);
}

// Load saved language
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'fr';
    currentLang = savedLang;
    const langFlag = document.getElementById('langFlag');
    
    if (savedLang === 'en') {
        langFlag.src = 'assets/flag_fr.webp';
        langFlag.alt = 'Français';
        // Update all text elements
        document.querySelectorAll('[data-fr][data-en]').forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-en');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });
    }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Smooth Scrolling
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.getElementById('navLinks').classList.remove('active');
            }
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// EmailJS Configuration
// Obtenez-les sur https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'VOTRE_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'VOTRE_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'VOTRE_TEMPLATE_ID';

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// Form submission
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formStatus = document.getElementById('formStatus');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';
        submitBtn.disabled = true;
        formStatus.style.display = 'none';

        // Send email using EmailJS
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
            .then(function() {
                // Success
                formStatus.className = 'form-status success';
                formStatus.textContent = currentLang === 'fr' 
                    ? 'Message envoyé avec succès !' 
                    : 'Message sent successfully!';
                formStatus.style.display = 'block';
                
                // Reset form
                document.getElementById('contactForm').reset();
            }, function(error) {
                // Error
                formStatus.className = 'form-status error';
                formStatus.textContent = currentLang === 'fr' 
                    ? 'Erreur lors de l\'envoi. Veuillez réessayer.' 
                    : 'Error sending message. Please try again.';
                formStatus.style.display = 'block';
                console.error('EmailJS error:', error);
            })
            .finally(function() {
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.experience-card, .skill-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});