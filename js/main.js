// JavaScript code for interactive elements of the portfolio

document.addEventListener("DOMContentLoaded", function() {
    // Mobile navigation functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Prevent menu from closing when clicking inside it
        navMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Set active navigation link based on current page
    setActiveNavLink();

    // Form validation and reset for contact form
    const contactForm = document.getElementById('contact-form');

    function openModal(message) {
        const modal = document.getElementById('popup-modal');
        const msgEl = document.getElementById('popup-message');
        const closeBtn = document.getElementById('popup-close');
        const okBtn = document.getElementById('popup-ok');
        if (modal && msgEl) {
            msgEl.textContent = message;
            modal.style.display = 'flex';
            function hide() { modal.style.display = 'none'; }
            if (closeBtn) closeBtn.onclick = hide;
            if (okBtn) okBtn.onclick = hide;
            modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
        } else {
            // Fallback
            alert(message);
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                event.preventDefault();
                openModal("Please fill in all fields.");
                return;
            }

            // After successful submission, clear fields and show modal feedback
            event.preventDefault(); // Prevent default form submission

            // Send form data via AJAX
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm)
            })
            .then(response => response.text())
            .then(data => {
                openModal(data || "Thank you! Your message has been sent.");
                contactForm.reset(); // Clear fields
                // Do not redirect; keep user on page for smoother UX
            })
            .catch(() => {
                openModal("Sorry, there was an error. Please try again later.");
            });
        });
    }

    // Page transition effect + in-page smooth scrolling
    document.querySelectorAll('a[href]').forEach(link => {
        // Skip external links with target="_blank" (social media links)
        if (link.target === '_blank') return;
        
        // Only apply to internal links
        const isSameHost = (link.hostname === window.location.hostname) || link.hostname === '';
        if (!isSameHost) return;

        const linkUrl = new URL(link.href, window.location.href);
        const isHashOnly = !!linkUrl.hash && linkUrl.pathname === window.location.pathname;

        if (isHashOnly) {
            // In-page anchor: smooth scroll, no fade-out
            link.addEventListener('click', function(e) {
                const target = document.querySelector(linkUrl.hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            return;
        }

        // Internal page navigation with fade-out
        if (!link.href.endsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location = link.href;
                }, 500); // Match the CSS transition duration
            });
        }
    });

    // Typing effect is now handled by the shared utility in typing-effect.js
    // This file focuses on mobile navigation and form handling
});

// Function to set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'home.html')) {
            link.classList.add('active');
        }
    });
    
    // Special case for about link on home page
    if (currentPage === 'home.html' || currentPage === '') {
        const aboutLink = document.querySelector('nav ul li a[href="#about"]');
        if (aboutLink) {
            // Don't add active class to about link, let home link stay active
        }
    }
}

// Bubble animation for homepage background
(function() {
    const canvas = document.getElementById('bubble-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let bubbles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function randomColor() {
        const colors = ['#6a11cb', '#ffb347', '#00bcd4', '#ff6f61', '#f9d423'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createBubble() {
        return {
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            radius: 10 + Math.random() * 30,
            speed: 1 + Math.random() * 2,
            color: randomColor(),
            alpha: 0.3 + Math.random() * 0.4
        };
    }

    function drawBubbles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach(bubble => {
            ctx.save();
            ctx.globalAlpha = bubble.alpha;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            ctx.restore();
        });
    }

    function updateBubbles() {
        for (let i = 0; i < bubbles.length; i++) {
            bubbles[i].y -= bubbles[i].speed;
            if (bubbles[i].y + bubbles[i].radius < 0) {
                bubbles[i] = createBubble();
                bubbles[i].y = canvas.height + bubbles[i].radius;
            }
        }
    }

    function animate() {
        updateBubbles();
        drawBubbles();
        requestAnimationFrame(animate);
    }

    // Initialize bubbles
    bubbles = Array.from({length: 30}, createBubble);

    animate();
})();