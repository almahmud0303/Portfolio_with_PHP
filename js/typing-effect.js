// Shared Typing Effect Utility
// This file provides a consistent typing effect across all portfolio pages

class TypingEffect {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isRunning = false;
        
        // Default options
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 100;
        this.pauseBeforeDelete = options.pauseBeforeDelete || 2000;
        this.pauseBeforeNext = options.pauseBeforeNext || 1000;
        this.loop = options.loop !== false; // Default to true
        
        // Bind methods
        this.typeWriter = this.typeWriter.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
    }
    
    typeWriter() {
        if (!this.isRunning) return;
        
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            // Delete character by character
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                // Finished deleting, move to next word
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                
                if (!this.loop && this.currentWordIndex === 0) {
                    // Stop if not looping
                    this.stop();
                    return;
                }
                
                setTimeout(this.typeWriter, this.pauseBeforeNext);
            } else {
                setTimeout(this.typeWriter, this.deleteSpeed);
            }
        } else {
            // Type character by character
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentWord.length) {
                // Finished typing, wait then start deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.typeWriter();
                }, this.pauseBeforeDelete);
            } else {
                setTimeout(this.typeWriter, this.typeSpeed);
            }
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.reset();
        this.typeWriter();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    reset() {
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.element.textContent = '';
    }
    
    // Static method for quick setup
    static create(element, words, options = {}) {
        const typingEffect = new TypingEffect(element, words, options);
        typingEffect.start();
        return typingEffect;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypingEffect;
} else {
    window.TypingEffect = TypingEffect;
}

