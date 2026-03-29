/* ========================================
   GS Blow Dry Bar - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Language Switcher
    // ========================================
    const langButtons = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en][data-es]');
    
    let currentLang = 'en';
    
    function setLanguage(lang) {
        currentLang = lang;
        
        translatableElements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            
            if (element.tagName === 'META') {
                element.setAttribute('content', text);
            } else if (element.tagName === 'TITLE') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        });
        
        // Update button states
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
    
    // Load saved preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);
    
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ========================================
    // Carousel
    // ========================================
    const carouselTrack = document.getElementById('carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselIndicators = document.getElementById('carousel-indicators');
    
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 5000; // 5 seconds
    
    // Create indicators
    carouselSlides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.addEventListener('click', () => goToSlide(index));
        if (index === 0) indicator.classList.add('active');
        carouselIndicators.appendChild(indicator);
    });
    
    const indicators = document.querySelectorAll('.carousel-indicators button');
    
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateIndicators();
        resetInterval();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
        goToSlide(currentSlide);
    }
    
    function startInterval() {
        slideInterval = setInterval(nextSlide, slideDelay);
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Event listeners
    carouselNext.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    carouselPrev.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    // Touch support for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetInterval();
        }
    }
    
    // Pause on hover
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        startInterval();
    });
    
    // Start carousel
    startInterval();
    
    // ========================================
    // Scroll to Top Button
    // ========================================
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ========================================
    // Portfolio Modal
    // ========================================
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    let currentImageIndex = 0;
    const portfolioImages = Array.from(portfolioItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));
    
    function openModal(index) {
        currentImageIndex = index;
        updateModalImage();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateModalImage() {
        const image = portfolioImages[currentImageIndex];
        modalImg.src = image.src;
        modalImg.alt = image.alt;
        modalCaption.textContent = image.alt;
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
        updateModalImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
        updateModalImage();
    }
    
    // Open modal on portfolio item click
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    
    // Navigation
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
    
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
    
    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // Intersection Observer for Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + navbar.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // ========================================
    // Preload Images
    // ========================================
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }
    
    preloadImages();

    // ========================================
    // Booking Form Handler
    // ========================================
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                subject: document.getElementById('subject').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                message: document.getElementById('message').value
            };
            
            // Validate phone number (basic validation)
            const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phonePattern.test(formData.phone)) {
                alert('Please enter a valid phone number');
                return;
            }
            
            // Here you would typically send the data to a server
            // For now, we'll show a success message
            console.log('Booking Form Submitted:', formData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            bookingForm.reset();
        });
    }
    
    function showSuccessMessage() {
        // Create success message element if it doesn't exist
        let successMsg = document.querySelector('.form-success');
        
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Booking Request Sent!</h3>
                <p>We will contact you shortly to confirm your appointment.</p>
            `;
            
            const form = document.getElementById('booking-form');
            form.style.display = 'none';
            form.parentNode.appendChild(successMsg);
        }
        
        successMsg.classList.add('active');
        
        // Auto-hide after 5 seconds and reset form
        setTimeout(() => {
            successMsg.classList.remove('active');
            const form = document.getElementById('booking-form');
            form.style.display = 'block';
        }, 5000);
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.slice(0, 10); // Limit to 10 digits
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '+1 ($1) $2');
            } else if (value.length > 0) {
                value = '+1 (' + value;
            }
            e.target.value = value;
        });
    }

    // ========================================
    // Console Info
    // ========================================
    console.log('%c GS Blow Dry Bar Midtown ', 'background: #FF0000; color: #000000; font-size: 20px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Professional Hair & Makeup Services ', 'color: #FF0000; font-size: 14px;');
    console.log('%c Developed by Christian Herencia ', 'color: #666; font-size: 12px;');
    console.log('%c https://christian-freelance.us/ ', 'color: #d4af37; font-size: 12px; text-decoration: underline;');
});
