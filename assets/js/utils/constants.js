// Constantes et configuration globale
const CONFIG = {
    // EmailJS Configuration
    EMAILJS: {
        SERVICE_ID: 'service_your_service_id', // À remplacer avec votre Service ID
        TEMPLATE_ID: 'template_your_template_id', // À remplacer avec votre Template ID
        PUBLIC_KEY: 'your_public_key' // À remplacer avec votre Public Key
    },
    
    // Animation Delays
    ANIMATION: {
        STAGGER_DELAY: 100,
        LOADING_DELAY: 500
    },
    
    // Validation Rules
    VALIDATION: {
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 50
        },
        EMAIL: {
            REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        MESSAGE: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 1000
        }
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        THEME_PREFERENCE: 'portfolio_theme_preference',
        FORM_DATA: 'portfolio_contact_form_data'
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
}