// Interactions pour la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Données des compétences
    const skillsData = {
        web: {
            icon: '💻',
            title: 'Développement Web',
            description: 'Expert en création d\'applications web modernes et performantes. Je maîtrise l\'ensemble des technologies nécessaires pour concevoir, développer et déployer des solutions web complètes, du frontend au backend.',
            technologies: {
                'Frontend': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Bootstrap', 'Tailwind CSS'],
                'Backend': ['PHP', 'Laravel', 'Node.js', 'Python', 'Django'],
                'Bases de données': ['MySQL', 'MongoDB', 'PostgreSQL'],
                'Outils': ['Git', 'Webpack', 'Docker', 'REST API', 'GraphQL']
            }
        },
        design: {
            icon: '🎨',
            title: 'Design UX/UI',
            description: 'Spécialiste en conception d\'interfaces utilisateur intuitives et d\'expériences utilisateur optimisées. Je crée des designs qui allient esthétique et fonctionnalité pour une expérience utilisateur exceptionnelle.',
            technologies: {
                'Design': ['Figma', 'Adobe XD', 'Sketch', 'Prototypage'],
                'Research': ['User Research', 'Tests Utilisateurs', 'Analytics'],
                'Outils': ['Pencil', 'Yed Graph Editor', 'Wireframing']
            }
        },
        software: {
            icon: '⚙️',
            title: 'Développement Logiciel',
            description: 'Développement d\'applications desktop et solutions logicielles robustes. Expertise en architecture logicielle et en création d\'applications performantes et maintenables.',
            technologies: {
                'Langages': ['Java', 'Jakarta EE', 'Python', 'Visual Basic'],
                'Frameworks': ['Spring Boot', 'Django', 'Electron'],
                'Concepts': ['OOP', 'Design Patterns', 'Architecture Logicielle']
            }
        },
        gaming: {
            icon: '🎮',
            title: 'Développement Jeux Vidéo',
            description: 'Création d\'expériences gaming interactives et immersives. Spécialiste en développement de jeux avec Godot Engine et conception de mécaniques de jeu engageantes.',
            technologies: {
                'Moteurs': ['Godot Engine', 'GD Script'],
                'Concepts': ['Game Design', 'Mécaniques de Jeu', 'Level Design'],
                'Graphisme': '2D/3D Integration'
            }
        },
        automation: {
            icon: '🤖',
            title: 'Automatisation & Workflows',
            description: 'Expert en automatisation de processus et création de workflows intelligents. J\'optimise les flux de travail pour gagner en efficacité et productivité.',
            technologies: {
                'Outils': ['N8N', 'Python Scripting', 'API Integration'],
                'Domaines': ['Workflow Automation', 'Data Processing', 'System Integration']
            }
        },
        graphics: {
            icon: '✨',
            title: 'Graphisme & Création Visuelle',
            description: 'Création de contenus visuels impactants et développement d\'identités visuelle cohérentes. Maîtrise des outils de design moderne pour des créations percutantes.',
            technologies: {
                'Design': ['Canva', 'Adobe Creative Suite', 'Figma'],
                'Compétences': ['Identité Visuelle', 'Marketing Visual', 'Content Creation']
            }
        }
    };

    // Données des projets
    const projectsData = {
        ecommerce: {
            title: "Plateforme E-commerce Évolutive",
            description: "Solution complète de vente en ligne développée avec React et Laravel, intégrant un système de paiement sécurisé, gestion d'inventaire en temps réel et interface d'administration avancée.",
            technologies: ['React', 'Laravel', 'MySQL', 'Stripe', 'Redis'],
            features: ['Panier dynamique', 'Paiement sécurisé', 'Gestion stock', 'Dashboard admin']
        },
        portfolio: {
            title: "Portfolio Interactif Dynamique",
            description: "Site portfolio moderne avec animations fluides GSAP, chargement dynamique des projets et design responsive. Intégration de micro-interactions pour une expérience utilisateur optimale.",
            technologies: ['JavaScript', 'CSS3', 'HTML5', 'GSAP', 'REST API'],
            features: ['Animations avancées', 'Design responsive', 'Chargement dynamique']
        },
        automation: {
            title: "Système d'Automatisation Intelligent",
            description: "Plateforme d'automatisation de workflows professionnels avec N8N, intégrant multiples APIs et fournissant une interface de gestion intuitive pour l'orchestration de tâches complexes.",
            technologies: ['Python', 'N8N', 'REST API', 'Docker', 'PostgreSQL'],
            features: ['Workflows visuels', 'Intégrations multiples', 'Monitoring en temps réel']
        }
    };

    // Gestion des modals de compétences
    const skillModal = document.getElementById('skillModal');
    const skillDetailButtons = document.querySelectorAll('.btn-skill-details');

    skillDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const skillCard = this.closest('.skill-card');
            const skillType = skillCard.dataset.skill;
            const skillData = skillsData[skillType];
            
            if (skillData) {
                openSkillModal(skillData);
            }
        });
    });

    // Gestion des projets
    const projectDetailButtons = document.querySelectorAll('.btn-project-details');
    const viewProjectButtons = document.querySelectorAll('.view-project-btn');

    projectDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectType = this.dataset.project;
            // Pour l'instant, rediriger vers la page projects
            // Plus tard, rediriger vers la page dédiée du projet
            window.location.href = 'projects.html';
        });
    });

    viewProjectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectType = projectCard.dataset.project;
            // Pour l'instant, rediriger vers la page projects
            window.location.href = 'projects.html';
        });
    });

    // Fonction pour ouvrir le modal de compétence
    function openSkillModal(skillData) {
        document.getElementById('modalSkillIcon').textContent = skillData.icon;
        document.getElementById('modalSkillTitle').textContent = skillData.title;
        
        const technologiesHtml = generateTechnologiesHTML(skillData.technologies);
        document.getElementById('modalTechnologies').innerHTML = technologiesHtml;
        
        document.getElementById('modalDescription').textContent = skillData.description;
        
        skillModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Générer le HTML des technologies
    function generateTechnologiesHTML(technologies) {
        let html = '';
        for (const [category, items] of Object.entries(technologies)) {
            html += `
                <div class="technology-category">
                    <h4>${category}</h4>
                    <div class="technology-items">
                        ${Array.isArray(items) 
                            ? items.map(item => `<span>${item}</span>`).join('')
                            : `<span>${items}</span>`
                        }
                    </div>
                </div>
            `;
        }
        return html;
    }

    // Fermer le modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    skillModal.addEventListener('click', function(e) {
        if (e.target === skillModal) {
            closeModal();
        }
    });

    function closeModal() {
        skillModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Échap pour fermer le modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && skillModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Animation au scroll pour les cartes de compétences
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

    // Observer les cartes de compétences et projets
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});