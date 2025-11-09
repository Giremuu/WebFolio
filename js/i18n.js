/*
====================================
INTERNATIONALIZATION (i18n)
====================================
*/

let currentLang = localStorage.getItem('language') || 'fr';
let translations = {};

async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Erreur lors du chargement des traductions:', error);
    }
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(key);
        
        if (translation) {
            if (translation.includes('<') && translation.includes('>')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    document.documentElement.lang = currentLang;
    
    updateLanguageButton();
}

function getNestedTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            console.warn(`Traduction manquante pour: ${key} (langue: ${currentLang})`);
            return key;
        }
    }
    
    return value;
}

function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Langue non supportée: ${lang}`);
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    
    document.body.classList.add('lang-transition');
    setTimeout(() => {
        document.body.classList.remove('lang-transition');
    }, 300);
}

function updateLanguageButton() {
    const langBtn = document.getElementById('currentLang');
    if (langBtn) {
        const langCodes = {
            'fr': 'FR',
            'en': 'EN',
            'jp': 'JP'
        };
        langBtn.textContent = langCodes[currentLang] || 'FR';
    }
}

function initLanguageSwitcher() {
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langBtn || !langMenu) return;
    
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('active');
        const themeMenu = document.getElementById('themeMenu');
        if (themeMenu) themeMenu.classList.remove('active');
    });
    
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            changeLanguage(lang);
            langMenu.classList.remove('active');
        });
    });
    
    document.addEventListener('click', () => {
        langMenu.classList.remove('active');
    });
    
    langMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function detectBrowserLanguage() {
    if (!localStorage.getItem('language')) {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        const supportedLangs = {
            'fr': 'fr',
            'en': 'en',
            'ja': 'jp'
        };
        
        if (supportedLangs[langCode]) {
            currentLang = supportedLangs[langCode];
            localStorage.setItem('language', currentLang);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    detectBrowserLanguage();
    loadTranslations();
    initLanguageSwitcher();
});

window.i18n = {
    changeLanguage,
    getCurrentLanguage: () => currentLang,
    getTranslation: getNestedTranslation,
    t: getNestedTranslation
};