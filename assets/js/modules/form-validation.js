// Module de validation et envoi du formulaire de contact
class FormValidation {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnSpinner = this.submitBtn.querySelector('.btn-spinner');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedFormData();
        this.initEmailJS();
    }

    setupEventListeners() {
        // Validation en temps réel
        this.form.addEventListener('input', this.debounce((e) => {
            this.validateField(e.target);
            this.saveFormData();
        }, 300));

        // Soumission du formulaire
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Réinitialisation des erreurs au focus
        this.form.addEventListener('focusin', (e) => {
            this.clearFieldError(e.target);
        });
    }

    initEmailJS() {
        // Initialiser EmailJS avec votre clé publique
        if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.EMAILJS.PUBLIC_KEY);
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                isValid = this.validateName(value);
                errorMessage = isValid ? '' : 'Le nom doit contenir entre 2 et 50 caractères';
                break;

            case 'email':
                isValid = this.validateEmail(value);
                errorMessage = isValid ? '' : 'Veuillez entrer une adresse email valide';
                break;

            case 'subject':
                isValid = this.validateSubject(value);
                errorMessage = isValid ? '' : 'Veuillez sélectionner un sujet';
                break;

            case 'message':
                isValid = this.validateMessage(value);
                errorMessage = isValid ? '' : 'Le message doit contenir entre 10 et 1000 caractères';
                break;
        }

        this.setFieldState(field, isValid, errorMessage);
        return isValid;
    }

    validateName(name) {
        return name.length >= CONFIG.VALIDATION.NAME.MIN_LENGTH && 
               name.length <= CONFIG.VALIDATION.NAME.MAX_LENGTH;
    }

    validateEmail(email) {
        return CONFIG.VALIDATION.EMAIL.REGEX.test(email);
    }

    validateSubject(subject) {
        return subject !== '';
    }

    validateMessage(message) {
        return message.length >= CONFIG.VALIDATION.MESSAGE.MIN_LENGTH && 
               message.length <= CONFIG.VALIDATION.MESSAGE.MAX_LENGTH;
    }

    setFieldState(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            errorElement.textContent = '';
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error', 'success');
        errorElement.textContent = '';
    }

    validateAllFields() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let allValid = true;

        fields.forEach(field => {
            if (field.hasAttribute('required')) {
                const isValid = this.validateField(field);
                if (!isValid) allValid = false;
            }
        });

        return allValid;
    }

    async handleSubmit() {
        if (!this.validateAllFields()) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        this.setLoadingState(true);

        try {
            await this.sendEmail();
            this.showSuccessModal();
            this.form.reset();
            this.clearSavedFormData();
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            this.showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async sendEmail() {
        const formData = new FormData(this.form);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            budget: formData.get('budget'),
            message: formData.get('message'),
            to_name: 'Honga Alexandre',
            reply_to: formData.get('email')
        };

        // Utilisation d'EmailJS
        if (typeof emailjs !== 'undefined') {
            await emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID,
                CONFIG.EMAILJS.TEMPLATE_ID,
                templateParams
            );
        } else {
            // Fallback: Envoi via FormSubmit ou autre méthode
            await this.sendViaFormSubmit(formData);
        }
    }

    async sendViaFormSubmit(formData) {
        // Alternative si EmailJS n'est pas configuré
        const response = await fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.btnText.style.display = 'none';
            this.btnSpinner.style.display = 'flex';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.style.display = 'block';
            this.btnSpinner.style.display = 'none';
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        
        // Fermer la modal en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Créer une notification toast
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc2626' : '#10b981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    saveFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData) {
            data[key] = value;
        }

        Helpers.saveToStorage(CONFIG.STORAGE_KEYS.FORM_DATA, data);
    }

    loadSavedFormData() {
        const savedData = Helpers.loadFromStorage(CONFIG.STORAGE_KEYS.FORM_DATA);
        
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = savedData[key];
                }
            });
        }
    }

    clearSavedFormData() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.FORM_DATA);
    }

    // Debounce helper
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Fonction globale pour fermer la modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Initialisation
let formValidation;

document.addEventListener('DOMContentLoaded', () => {
    formValidation = new FormValidation();
});