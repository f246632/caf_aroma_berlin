// ============================================
// Café Aroma Berlin - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // Navigation & Mobile Menu
    // ============================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // Smooth Scrolling
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Contact Form Validation & Submission
    // ============================================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !message) {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            // Success message (in production, this would send to a server)
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
            contactForm.reset();

            // In production, you would send this data to a server:
            // const formData = { name, email, phone, message };
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
        });
    }

    // ============================================
    // Scroll Animations
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.menu-category, .review-card, .feature-item, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // Active Navigation Link on Scroll
    // ============================================

    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // Lazy Loading Images
    // ============================================

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        document.body.appendChild(script);

        script.onload = function() {
            const observer = lozad();
            observer.observe();
        };
    }

    // ============================================
    // Performance Optimization
    // ============================================

    // Debounce function for scroll events
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Apply debounce to scroll events
    window.addEventListener('scroll', debounce(function() {
        // Scroll-dependent functions can be called here
    }, 15));

    // ============================================
    // Console Welcome Message
    // ============================================

    console.log('%c Welcome to Café Aroma Berlin! ',
        'background: #8B4513; color: #FAF8F5; font-size: 16px; padding: 10px; border-radius: 5px;');
    console.log('%c A Café with Family Atmosphere ',
        'color: #8B4513; font-size: 14px; font-style: italic;');
    console.log('Visit us at Tassostraße 22, 13086 Berlin');
    console.log('Follow us on Instagram: @cafe.aroma.berlin');
});

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// ============================================
// Service Worker Registration (for PWA - optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed:', err));
    });
}
