/*
====================================
THEME SWITCHER - Portfolio Kenma
====================================
*/

let currentTheme = localStorage.getItem('theme') || 'cyber-dark';

function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    currentTheme = themeName;
    localStorage.setItem('theme', themeName);
    
    updateThemeOptions();
    
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

function updateThemeOptions() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const theme = option.getAttribute('data-theme');
        if (theme === currentTheme) {
            option.classList.add('active');
            option.style.background = 'var(--color-bg-tertiary)';
        } else {
            option.classList.remove('active');
            option.style.background = 'transparent';
        }
    });
}

function initThemeSwitcher() {
    const themeBtn = document.getElementById('themeBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (!themeBtn || !themeMenu) return;
    
    applyTheme(currentTheme);
    
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('active');
        const langMenu = document.getElementById('langMenu');
        if (langMenu) langMenu.classList.remove('active');
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyTheme(theme);
            themeMenu.classList.remove('active');
        });
    });
    
    document.addEventListener('click', () => {
        themeMenu.classList.remove('active');
    });
    
    themeMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function detectSystemTheme() {
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'cyber-dark';
        } else {
            currentTheme = 'light-pro';
        }
        localStorage.setItem('theme', currentTheme);
    }
}

function watchSystemTheme() {
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme-user-selected')) {
                const newTheme = e.matches ? 'cyber-dark' : 'light-pro';
                applyTheme(newTheme);
            }
        });
    }
}

function markUserSelection() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            localStorage.setItem('theme-user-selected', 'true');
        });
    });
}

function addKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            const themes = ['cyber-dark', 'light-pro', 'matrix', 'ocean'];
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            applyTheme(themes[nextIndex]);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    detectSystemTheme();
    initThemeSwitcher();
    watchSystemTheme();
    markUserSelection();
    addKeyboardShortcut();
});

window.themeManager = {
    applyTheme,
    getCurrentTheme: () => currentTheme,
    cycleTheme: () => {
        const themes = ['cyber-dark', 'light-pro', 'matrix', 'ocean'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        applyTheme(themes[nextIndex]);
    }
};