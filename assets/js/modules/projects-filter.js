// Module de filtrage et affichage des projets
class ProjectsFilter {
    constructor() {
        this.projects = [];
        this.categories = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentSearch = '';
        this.currentPage = 1;
        this.projectsPerPage = 6;
        
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
        this.renderCategories();
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            this.projects = data.projects;
            this.categories = data.categories;
            this.filteredProjects = [...this.projects];
        } catch (error) {
            console.error('Erreur lors du chargement des projets:', error);
            this.showError();
        }
    }

    setupEventListeners() {
        // Filtres par catégorie
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        // Recherche
        const searchInput = document.getElementById('projectSearch');
        searchInput.addEventListener('input', (e) => {
            this.handleSearchChange(e.target.value);
        });

        // Tri
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.handleSortChange(e.target.value);
        });

        // Pagination (gérée dynamiquement)
    }

    handleFilterChange(filter) {
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.currentFilter = filter;
        this.currentPage = 1;
        this.applyFilters();
    }

    handleSearchChange(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }

    handleSortChange(sortType) {
        this.currentSort = sortType;
        this.applyFilters();
    }

    applyFilters() {
        // Filtrer par catégorie
        let filtered = this.currentFilter === 'all' 
            ? [...this.projects] 
            : this.projects.filter(project => project.category === this.currentFilter);

        // Filtrer par recherche
        if (this.currentSearch) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(this.currentSearch) ||
                project.description.toLowerCase().includes(this.currentSearch) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.currentSearch))
            );
        }

        // Trier
        filtered = this.sortProjects(filtered, this.currentSort);

        this.filteredProjects = filtered;
        this.renderProjects();
    }

    sortProjects(projects, sortType) {
        switch (sortType) {
            case 'newest':
                return projects.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
            case 'oldest':
                return projects.sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
            case 'name':
                return projects.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return projects;
        }
    }

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        
        if (this.filteredProjects.length === 0) {
            grid.innerHTML = this.getNoResultsHTML();
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        // Pagination
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const paginatedProjects = this.filteredProjects.slice(startIndex, startIndex + this.projectsPerPage);

        // Rendu des projets
        grid.innerHTML = paginatedProjects.map(project => this.getProjectHTML(project)).join('');
        
        // Rendu de la pagination
        this.renderPagination(totalPages);
    }

    getProjectHTML(project) {
        return `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <div class="image-placeholder">💻</div>
                    ${project.featured ? '<div class="project-badge">⭐ Projet phare</div>' : ''}
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-link project-link--primary">Voir le projet</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">Code source</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getNoResultsHTML() {
        return `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Aucun projet trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
            </div>
        `;
    }

    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                onclick="projectsFilter.goToPage(${this.currentPage - 1})">
                ← Précédent
            </button>
            <div class="pagination-pages">
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-page ${i === this.currentPage ? 'active' : ''}" 
                    onclick="projectsFilter.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        paginationHTML += `
            </div>
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                onclick="projectsFilter.goToPage(${this.currentPage + 1})">
                Suivant →
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProjects();
        window.scrollTo({ top: document.getElementById('projectsGrid').offsetTop - 100, behavior: 'smooth' });
    }

    renderCategories() {
        const categoryContainer = document.querySelector('.category-filters');
        const categoryHTML = this.categories.map(category => `
            <button class="filter-btn" data-filter="${category.id}">
                ${category.name} (${category.count})
            </button>
        `).join('');
        
        categoryContainer.innerHTML = categoryHTML;
        
        // Réattacher les event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });
    }

    showError() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">⚠️</div>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les projets. Veuillez réessayer plus tard.</p>
            </div>
        `;
    }
}

// Initialisation
let projectsFilter;

document.addEventListener('DOMContentLoaded', () => {
    projectsFilter = new ProjectsFilter();
});