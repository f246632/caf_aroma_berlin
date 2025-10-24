// ============================================
// Café Aroma Berlin - Gallery & Lightbox
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // Gallery Lightbox Functionality
    // ============================================

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    let images = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        images.push({
            src: img.src,
            alt: img.alt
        });

        // Click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View ${img.alt} in fullscreen`);

        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = images[index].src;
        lightboxImage.alt = images[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        lightboxClose.focus();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Previous image
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    });

    // Next image
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                lightboxPrev.click();
                break;
            case 'ArrowRight':
                lightboxNext.click();
                break;
        }
    });

    // ============================================
    // Gallery Filtering (Optional Enhancement)
    // ============================================

    const galleryFilters = document.querySelectorAll('[data-filter]');

    if (galleryFilters.length > 0) {
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-filter');

                // Remove active class from all filters
                galleryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');

                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ============================================
    // Touch Swipe Support for Mobile
    // ============================================

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                lightboxNext.click();
            } else {
                // Swipe right - previous image
                lightboxPrev.click();
            }
        }
    }

    // ============================================
    // Image Preloading for Better Performance
    // ============================================

    function preloadImages() {
        images.forEach(imageData => {
            const img = new Image();
            img.src = imageData.src;
        });
    }

    // Preload images after page load
    window.addEventListener('load', function() {
        setTimeout(preloadImages, 1000);
    });

    // ============================================
    // Gallery Animation on Scroll
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50); // Stagger animation
                galleryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        galleryObserver.observe(item);
    });
});
