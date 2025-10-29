// Fichier principal - Initialisation de l'application
class PortfolioApp {
    constructor() {
        this.modules = {};
        this.isMobile = Helpers.getDeviceType() === 'mobile';
        
        this.init();
    }

    async init() {
        try {
            // Initialiser les utilitaires d'abord
            await this.initUtils();
            
            // Initialiser les modules principaux
            this.initModules();
            
            // Configurer les événements globaux
            this.setupGlobalEvents();
            
            // Initialiser les composants UI
            this.initUIComponents();
            
            // Démarrer l'application
            this.start();
            
        } catch (error) {
            console.error('Erreur lors du chargement de l\'application:', error);
            this.handleInitError();
        }
    }

    async initUtils() {
        // Charger les données de configuration si nécessaire
        await this.loadConfig();
        
        // Initialiser le thème
        this.initTheme();
        
        // Initialiser les analytics (optionnel)
        this.initAnalytics();
    }

    async loadConfig() {
        // Charger des configurations supplémentaires si besoin
        return Promise.resolve();
    }

    initTheme() {
        const savedTheme = Helpers.loadFromStorage(CONFIG.STORAGE_KEYS.THEME_PREFERENCE) || 'light';
        this.setTheme(savedTheme);
        
        // Créer le toggle de thème si nécessaire
        this.createThemeToggle();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Helpers.saveToStorage(CONFIG.STORAGE_KEYS.THEME_PREFERENCE, theme);
    }

    createThemeToggle() {
        // Ajouter un toggle de thème dans le footer ou header si souhaité
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌓';
        themeToggle.setAttribute('aria-label', 'Changer le thème');
        themeToggle.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        `;

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            
            // Animation du toggle
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });

        // Ajouter au footer ou créer un container dédié
        const footer = document.querySelector('footer .footer-content');
        if (footer) {
            footer.appendChild(themeToggle);
        }
    }

    initAnalytics() {
        // Intégration Google Analytics ou autre service d'analytics
        // Exemple basique avec Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID'); // Remplacer par votre ID
        }
        
        // Tracking des pages vues
        this.trackPageView();
    }

    trackPageView() {
        // Tracking personnalisé des pages vues
        const page = window.location.pathname;
        console.log('Page vue:', page);
        
        // Ici vous pourriez envoyer des données à votre service d'analytics
    }

    initModules() {
        // Initialiser les modules dans l'ordre approprié
        this.modules.navigation = new Navigation();
        this.modules.animations = new Animations();
        
        // Initialiser le filtre de projets si sur la page projects
        if (document.querySelector('.projects-grid')) {
            this.modules.projectsFilter = new ProjectsFilter();
        }
        
        // Initialiser la validation de formulaire si sur la page contact
        if (document.getElementById('contactForm')) {
            this.modules.formValidation = new FormValidation();
        }
    }

    setupGlobalEvents() {
        // Gestion des erreurs globales
        window.addEventListener('error', this.handleGlobalError.bind(this));
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Redimensionnement de la fenêtre
        window.addEventListener('resize', Helpers.debounce(this.handleResize.bind(this), 250));
        
        // Chargement des images
        this.handleImageLoading();
    }

    handleGlobalError(event) {
        console.error('Erreur globale:', event.error);
        // Ici vous pourriez envoyer l'erreur à un service de logging
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page non visible
            this.onPageHidden();
        } else {
            // Page visible
            this.onPageVisible();
        }
    }

    onPageHidden() {
        // Pause des animations ou vidéos si nécessaire
    }

    onPageVisible() {
        // Reprise des animations
    }

    handleResize() {
        // Recalculer les layouts si nécessaire
        const newIsMobile = Helpers.getDeviceType() === 'mobile';
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            this.onBreakpointChange();
        }
    }

    onBreakpointChange() {
        // Réinitialiser certaines fonctionnalités lors du changement de breakpoint
        if (this.modules.animations) {
            this.modules.animations.resetAnimations();
        }
    }

    handleImageLoading() {
        // Améliorer le chargement des images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    initUIComponents() {
        // Initialiser les composants UI supplémentaires
        this.initLoaders();
        this.initToasts();
        this.initModals();
        this.initTooltips();
    }

    initLoaders() {
        // Créer un loader global si nécessaire
        this.globalLoader = document.createElement('div');
        this.globalLoader.className = 'global-loader';
        this.globalLoader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        this.globalLoader.innerHTML = `
            <div class="loader-spinner"></div>
        `;
        
        // Styles pour le spinner
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            .loader-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--border-color);
                border-left: 4px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(spinnerStyle);
        
        document.body.appendChild(this.globalLoader);
        
        // Cacher le loader après le chargement
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.globalLoader.style.opacity = '0';
                setTimeout(() => {
                    this.globalLoader.remove();
                }, 300);
            }, 500);
        });
    }

    initToasts() {
        // Système de notifications toast
        window.showToast = (message, type = 'info', duration = 5000) => {
            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            toast.innerHTML = `
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">×</button>
            `;
            
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.getToastColor(type)};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            `;
            
            document.body.appendChild(toast);
            
            // Supprimer automatiquement après la durée
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, duration);
        };
    }

    getToastColor(type) {
        const colors = {
            info: 'var(--primary-color)',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#dc2626'
        };
        return colors[type] || colors.info;
    }

    initModals() {
        // Système de modals global
        window.openModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        };
        
        window.closeModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        };
        
        // Fermer les modals en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                window.closeModal(e.target.id);
            }
        });
    }

    initTooltips() {
        // Système de tooltips
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 0.5rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        
        element._tooltip = tooltip;
    }

    hideTooltip() {
        const existingTooltip = document.querySelector('.tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    start() {
        // L'application est complètement chargée
        console.log('Portfolio application started successfully');
        
        // Émettre un événement personnalisé
        document.dispatchEvent(new CustomEvent('portfolio:ready'));
        
        // Cacher le loader s'il existe encore
        if (this.globalLoader && this.globalLoader.parentElement) {
            this.globalLoader.remove();
        }
    }

    handleInitError() {
        // Afficher un message d'erreur élégant
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #dc2626;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
        `;
        errorMessage.textContent = 'Une erreur est survenue lors du chargement de l\'application.';
        document.body.appendChild(errorMessage);
    }

    // Méthodes utilitaires globales
    static getInstance() {
        if (!PortfolioApp.instance) {
            PortfolioApp.instance = new PortfolioApp();
        }
        return PortfolioApp.instance;
    }
}

// Styles CSS supplémentaires pour les nouvelles fonctionnalités
const additionalStyles = `
    [data-theme="dark"] {
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --text-muted: #94a3b8;
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-card: #1e293b;
        --border-color: #334155;
    }
    
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .reveal-left {
        transform: translateX(-30px);
    }
    
    .reveal-right {
        transform: translateX(30px);
    }
    
    .reveal-scale {
        transform: scale(0.9);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .theme-toggle:hover {
        background: var(--bg-secondary);
        transform: scale(1.1);
    }
`;

// Ajouter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialisation de l'application
let portfolioApp;

document.addEventListener('DOMContentLoaded', () => {
    portfolioApp = new PortfolioApp();
});

// Exposer certaines méthodes globalement pour un accès facile
window.PortfolioApp = PortfolioApp;
window.Helpers = Helpers;