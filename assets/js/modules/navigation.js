// Module de navigation et gestion du header
class Navigation {
    constructor() {
        this.header = document.querySelector('header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.currentSection = '';
        
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupScrollEffects();
        this.setupActiveLinks();
        this.setupSmoothScroll();
        this.setupKeyboardNavigation();
    }

    // Navigation mobile
    setupMobileNavigation() {
        if (!this.navToggle) return;

        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.navLinks.classList.contains('active')) {
                    this.toggleMobileMenu(false);
                }
            });
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.toggleMobileMenu(false);
            }
        });
    }

    toggleMobileMenu(show) {
        const isActive = this.navLinks.classList.contains('active');
        const shouldShow = show !== undefined ? show : !isActive;

        if (shouldShow) {
            this.navLinks.classList.add('active');
            this.navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.navLinks.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Effets au scroll
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 100;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Header qui apparaît/disparaît
            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }

            // Ombre sur le header
            if (currentScrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', Helpers.throttle(handleScroll, 16));
    }

    // Liens actifs selon la section
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateActiveLinks();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    updateActiveLinks() {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${this.currentSection}` || 
                (href === 'index.html' && this.currentSection === '') ||
                (href.includes(this.currentSection) && !href.startsWith('#'))) {
                link.classList.add('active');
            }
        });
    }

    // Scroll fluide
    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            }
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // Offset pour le header fixe
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Navigation au clavier
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab pour naviguer dans les liens
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
            
            // Échap pour fermer le menu mobile
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.toggleMobileMenu(false);
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = this.header.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Tab + Shift pour navigation circulaire
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Mettre à jour la navigation pour la page actuelle
    updateForCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            link.classList.remove('active');
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Ajouter un indicateur de page active
    addActiveIndicator() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink && !activeLink.querySelector('.active-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'active-indicator';
            indicator.style.cssText = `
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
                border-radius: 1px;
            `;
            activeLink.style.position = 'relative';
            activeLink.appendChild(indicator);
        }
    }
}

// Initialisation
let navigation;

document.addEventListener('DOMContentLoaded', () => {
    navigation = new Navigation();
});