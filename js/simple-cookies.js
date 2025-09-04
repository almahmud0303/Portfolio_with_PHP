/**
 * Simple Cookie Management System
 * Easy to use cookie functions for your portfolio
 */

class SimpleCookies {
    constructor() {
        this.cookieName = 'portfolio_preferences';
        this.defaultSettings = {
            theme: 'light',
            language: 'en',
            visited: false,
            lastVisit: null,
            visitCount: 0
        };
        this.settings = this.loadSettings();
    }

    /**
     * Set a cookie with expiration
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Days until expiration (default: 30)
     */
    setCookie(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} - Cookie value or null if not found
     */
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }

    /**
     * Load user settings from cookies
     * @returns {object} - User settings
     */
    loadSettings() {
        const cookieData = this.getCookie(this.cookieName);
        if (cookieData) {
            try {
                return JSON.parse(cookieData);
            } catch (e) {
                console.error('Error parsing cookie data:', e);
                return this.defaultSettings;
            }
        }
        return this.defaultSettings;
    }

    /**
     * Save user settings to cookies
     * @param {object} settings - Settings to save
     */
    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.setCookie(this.cookieName, JSON.stringify(this.settings), 365);
    }

    /**
     * Get a specific setting
     * @param {string} key - Setting key
     * @returns {any} - Setting value
     */
    getSetting(key) {
        return this.settings[key] || this.defaultSettings[key];
    }

    /**
     * Set a specific setting
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     */
    setSetting(key, value) {
        this.saveSettings({ [key]: value });
    }

    /**
     * Track page visit
     * @param {string} page - Page name
     */
    trackVisit(page) {
        const visits = this.getSetting('visits') || [];
        visits.push({
            page: page,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 visits
        if (visits.length > 20) {
            visits.splice(0, visits.length - 20);
        }
        
        this.setSetting('visits', visits);
        this.setSetting('visitCount', this.getSetting('visitCount') + 1);
        this.setSetting('lastVisit', new Date().toISOString());
    }

    /**
     * Get visit history
     * @returns {array} - Visit history
     */
    getVisitHistory() {
        return this.getSetting('visits') || [];
    }

    /**
     * Set theme preference
     * @param {string} theme - Theme name (light/dark)
     */
    setTheme(theme) {
        this.setSetting('theme', theme);
        this.applyTheme(theme);
    }

    /**
     * Apply theme to the page
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        
        // Update theme toggle button if exists
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    /**
     * Initialize cookies and apply settings
     */
    init() {
        // Apply saved theme
        const savedTheme = this.getSetting('theme');
        this.applyTheme(savedTheme);
        
        // Track current page visit
        const currentPage = window.location.pathname.split('/').pop() || 'home';
        this.trackVisit(currentPage);
        
        // Show welcome message for first-time visitors
        if (!this.getSetting('visited')) {
            this.showWelcomeMessage();
            this.setSetting('visited', true);
        }
    }

    /**
     * Show welcome message for new visitors
     */
    showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = 'welcomeMessage';
        welcomeDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #6a11cb, #ffb347);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 1000;
                max-width: 300px;
                animation: slideIn 0.5s ease-out;
            ">
                <h4 style="margin: 0 0 8px 0; font-size: 1.1rem;">👋 Welcome!</h4>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">
                    Thanks for visiting my portfolio! I use cookies to enhance your experience.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 8px;
                    font-size: 0.8rem;
                ">Got it!</button>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(welcomeDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (welcomeDiv.parentNode) {
                welcomeDiv.remove();
            }
        }, 10000);
    }

    /**
     * Show cookie consent banner
     */
    showCookieConsent() {
        if (this.getCookie('cookieConsent')) return;
        
        const consentDiv = document.createElement('div');
        consentDiv.id = 'cookieConsent';
        consentDiv.innerHTML = `
            <div style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #6a11cb, #ffb347);
                color: white;
                padding: 20px;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 -5px 15px rgba(0,0,0,0.3);
            ">
                <p style="margin: 0 0 15px 0; font-size: 0.9rem;">
                    🍪 This website uses cookies to enhance your browsing experience and analyze site traffic.
                </p>
                <button onclick="window.simpleCookies.acceptCookies()" style="
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    margin-right: 10px;
                    font-weight: 500;
                ">Accept All</button>
                <button onclick="window.simpleCookies.declineCookies()" style="
                    background: transparent;
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 500;
                ">Decline</button>
            </div>
        `;
        document.body.appendChild(consentDiv);
    }

    /**
     * Accept cookies
     */
    acceptCookies() {
        this.setCookie('cookieConsent', 'accepted', 0.0417); // 1 hour (60 minutes)
        document.getElementById('cookieConsent').remove();
        this.showWelcomeMessage();
    }

    /**
     * Decline cookies
     */
    declineCookies() {
        this.setCookie('cookieConsent', 'declined', 0.0417); // 1 hour (60 minutes)
        document.getElementById('cookieConsent').remove();
    }

    /**
     * Get analytics data
     * @returns {object} - Analytics data
     */
    getAnalytics() {
        return {
            visitCount: this.getSetting('visitCount'),
            lastVisit: this.getSetting('lastVisit'),
            visits: this.getVisitHistory(),
            theme: this.getSetting('theme'),
            language: this.getSetting('language')
        };
    }

    /**
     * Clear all cookies
     */
    clearAllCookies() {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        }
        this.settings = this.defaultSettings;
    }
}

// Initialize the cookie system
window.simpleCookies = new SimpleCookies();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.simpleCookies.init();
    
    // Show cookie consent after 2 minutes (120,000 milliseconds)
    setTimeout(() => {
        window.simpleCookies.showCookieConsent();
    }, 120000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleCookies;
}
