// Module d'animations et d'effets visuels
class Animations {
    constructor() {
        this.observer = null;
        this.scrollProgress = 0;
        this.isScrolling = false;
        this.lastScrollY = window.scrollY;
        
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupTypingEffect();
        this.setupParallaxEffects();
        this.setupScrollProgress();
        this.setupHoverEffects();
        this.setupPageTransitions();
    }

    // Observer pour les animations au scroll
    setupScrollObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, options);

        // Observer les éléments avec la classe 'reveal'
        document.querySelectorAll('.reveal').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateOnScroll(element) {
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Animation spécifique selon le type d'élément
            if (element.classList.contains('reveal-left')) {
                element.style.transform = 'translateX(0)';
            } else if (element.classList.contains('reveal-right')) {
                element.style.transform = 'translateX(0)';
            } else if (element.classList.contains('reveal-scale')) {
                element.style.transform = 'scale(1)';
            }
        }, delay);
    }

    // Effet de typing pour le hero
    setupTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Développeur Passionné',
            'Créatif & Innovant',
            'Spécialiste Frontend',
            'Solutionneur de Problèmes'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                typingSpeed = 2000; // Pause à la fin
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause avant nouveau texte
            }

            setTimeout(type, typingSpeed);
        };

        // Démarrer l'effet après un délai initial
        setTimeout(type, 1000);
    }

    // Effets parallax
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        // Utiliser le throttle pour optimiser les performances
        const throttledParallax = Helpers.throttle(handleParallax, 16);
        window.addEventListener('scroll', throttledParallax);
    }

    // Barre de progression du scroll
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset;
            const progress = (scrollTop / documentHeight) * 100;
            
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', Helpers.throttle(updateProgress, 16));
    }

    // Effets de hover avancés
    setupHoverEffects() {
        // Hover sur les cartes de projet
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateCardHover(e.currentTarget, true);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.animateCardHover(e.currentTarget, false);
            });
        });

        // Hover sur les liens de navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.animateNavHover(e.currentTarget, true);
            });
            
            link.addEventListener('mouseleave', (e) => {
                this.animateNavHover(e.currentTarget, false);
            });
        });
    }

    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }

    animateNavHover(link, isHovering) {
        const underline = link.querySelector('.nav-underline') || this.createNavUnderline(link);
        
        if (isHovering) {
            underline.style.width = '100%';
            underline.style.opacity = '1';
        } else {
            if (!link.classList.contains('active')) {
                underline.style.width = '0%';
                underline.style.opacity = '0';
            }
        }
    }

    createNavUnderline(link) {
        const underline = document.createElement('span');
        underline.className = 'nav-underline';
        underline.style.cssText = `
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            transition: all 0.3s ease;
            opacity: 0;
        `;
        link.style.position = 'relative';
        link.appendChild(underline);
        return underline;
    }

    // Transitions entre pages
    setupPageTransitions() {
        // Animation d'entrée de page
        this.animatePageEnter();
        
        // Gérer les clics sur les liens internes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.includes(window.location.origin)) {
                const isInternal = !link.href.includes('#') && link.target !== '_blank';
                if (isInternal) {
                    e.preventDefault();
                    this.animatePageExit(link.href);
                }
            }
        });
    }

    animatePageEnter() {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            document.body.style.transition = 'all 0.5s ease';
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
            
            // Supprimer la transition après l'animation
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        });
    }

    animatePageExit(url) {
        document.body.style.transition = 'all 0.3s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // Animation des compétences (barres de progression)
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress-bar');
        
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 100);
        });
    }

    // Effet de particules pour le hero (optionnel)
    createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particlesContainer);

        // Créer des particules
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: 0.3;
                animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            `;
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
        }

        // Ajouter l'animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100px) translateX(20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Réinitialiser les animations
    resetAnimations() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.setupScrollObserver();
    }
}

// Initialisation
let animations;

document.addEventListener('DOMContentLoaded', () => {
    animations = new Animations();
});