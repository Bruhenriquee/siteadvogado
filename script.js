// Silva & Associados - Main JavaScript File

// Mobile Menu Management
class MobileMenu {
    constructor() {
        this.menuButton = document.querySelector('.mobile-menu-button');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.init();
    }

    init() {
        if (this.menuButton) {
            this.menuButton.addEventListener('click', () => this.toggle());
        }
        
        // Close menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menuButton.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        this.mobileMenu.classList.toggle('hidden');
        const isOpen = !this.mobileMenu.classList.contains('hidden');
        this.menuButton.setAttribute('aria-expanded', isOpen);
        
        // Update button icon
        const icon = this.menuButton.querySelector('svg');
        if (isOpen) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        }
    }

    close() {
        this.mobileMenu.classList.add('hidden');
        this.menuButton.setAttribute('aria-expanded', 'false');
        
        // Reset icon
        const icon = this.menuButton.querySelector('svg');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    }
}

// Smooth Scrolling for Anchor Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbar = document.getElementById('navbar');
                    const headerOffset = navbar ? navbar.offsetHeight : 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animated Counters
class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.stats-card [data-count]');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            // Fallback for older browsers
            this.animateCounters();
        }
    }

    createObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, options);

        // Observe the first counter element
        if (this.counters.length > 0) {
            observer.observe(this.counters[0].parentElement.parentElement);
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const suffix = counter.dataset.suffix || '';
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000; // ms
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
                const currentValue = Math.floor(easedProgress * target);
                counter.textContent = currentValue;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else { // Animation complete
                    counter.textContent = target + suffix;
                }
            };
            window.requestAnimationFrame(step);
        });
    }
}

// Testimonials Carousel
class TestimonialsCarousel {
    constructor() {
        this.track = document.querySelector('.testimonial-track');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.carousel-dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.init();
    }

    init() {
        if (!this.track) return;

        this.setupNavigation();
        this.startAutoplay();
        this.setupPauseOnHover();
    }

    setupNavigation() {
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
            dot.classList.toggle('bg-blue-600', index === this.currentSlide);
            dot.classList.toggle('bg-gray-300', index !== this.currentSlide);
        });
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }

    setupPauseOnHover() {
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }
}

// FAQ Accordion
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            // Prepare for smooth transition
            answer.classList.remove('hidden');
            answer.style.maxHeight = 0;

            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
                
                // Keyboard accessibility
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQ(item);
                    }
                });
            }
        });

        if (this.faqItems.length > 0) {
            this.generateFaqSchema();
        }
    }

    toggleFAQ(currentItem) {
        const answer = currentItem.querySelector('.faq-answer');
        const question = currentItem.querySelector('.faq-question');
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== currentItem) {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherQuestion.setAttribute('aria-expanded', 'false');
                otherAnswer.style.maxHeight = 0;
            }
        });
        
        // Toggle current item
        if (isOpen) {
            question.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = 0;
        } else {
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    }

    generateFaqSchema() {
        const schemaScript = document.getElementById('faq-schema');
        if (!schemaScript) {
            console.warn('FAQ schema script tag with id="faq-schema" not found.');
            return;
        }

        const mainEntity = [];
        this.faqItems.forEach(item => {
            const questionEl = item.querySelector('.faq-question span');
            const answerEl = item.querySelector('.faq-answer div');
            
            if (questionEl && answerEl) {
                mainEntity.push({
                    "@type": "Question",
                    "name": questionEl.textContent.trim(),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answerEl.textContent.trim()
                    }
                });
            }
        });

        if (mainEntity.length > 0) {
            const schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": mainEntity
            };
            schemaScript.textContent = JSON.stringify(schema, null, 2);
        }
    }
}

// Form Validation and Handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupValidation();
        this.setupPhoneMask();
        this.setupSubmission();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        this.form.querySelectorAll('input[required], select[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input, false));
            input.addEventListener('input', () => {
                this.clearValidationState(input);
                this.validateField(input, true); // Real-time validation
            });
        });

        this.form.querySelectorAll('textarea[required]').forEach(textarea => {
            textarea.addEventListener('blur', () => this.validateField(textarea, false));
            textarea.addEventListener('input', () => this.clearValidationState(textarea));
        });
    }

    validateField(field, isTyping) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearValidationState(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        }

        // Specific field validations
        switch (fieldName) {
            case 'nome':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um e-mail válido.';
                }
                break;

            case 'telefone':
                // Validate unmasked length, assuming mask handles formatting
                const unmaskedValue = value.replace(/\D/g, '');
                if (unmaskedValue && (unmaskedValue.length < 10 || unmaskedValue.length > 11)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um telefone válido no formato (11) 99999-9999.';
                }
                break;
            
            case 'mensagem':
                if (value && value.length < 10) {
                    isValid = false;
                    errorMessage = 'A mensagem deve ter pelo menos 10 caracteres.';
                }
                break;
        }

        // LGPD checkbox validation
        if (fieldName === 'lgpd' && field.type === 'checkbox' && !field.checked) {
            isValid = false;
            errorMessage = 'Você deve concordar com a Política de Privacidade.';
            this.setError(document.getElementById('lgpd-error'), errorMessage);
            return false;
        }

        if (isTyping) {
            if (isValid) this.setSuccess(field);
        } else {
            if (!isValid) {
                this.setError(field, errorMessage);
            } else {
                this.setSuccess(field);
            }
        }

        return isValid;
    }

    setError(field, message) {
        let errorElement;
        if (field.id === 'lgpd-error') {
            errorElement = field; // This is already the error span
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            const iconContainer = field.parentElement.querySelector('.validation-icon');
            if (iconContainer) {
                iconContainer.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
            }
            errorElement = (field.closest('div.relative') || field).parentElement.querySelector('.error-message');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    setSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        const iconContainer = field.parentElement.querySelector('.validation-icon');
        if (iconContainer) {
            iconContainer.innerHTML = `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
        }
    }

    clearValidationState(field) {
        field.classList.remove('error', 'success');
        const errorElement = (field.closest('div.relative') || field).parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        const iconContainer = field.parentElement.querySelector('.validation-icon');
        if (iconContainer) {
            iconContainer.innerHTML = '';
        }
    }

    setupPhoneMask() {
        const phoneInput = document.getElementById('telefone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{2})(\d{4})/, '($1) $2');
            } else if (value.length >= 2) {
                value = value.replace(/(\d{2})/, '($1) ');
            }
            
            e.target.value = value;
        });
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        let isFormValid = true;

        // Validate all fields
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!this.validateField(input, false)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll to first error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('.submit-text');
        const spinner = submitButton.querySelector('.loading-spinner');
        
        submitText.textContent = 'Enviando...';
        spinner.classList.remove('hidden');
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        const clientName = formData.get('nome').split(' ')[0]; // Get first name
        setTimeout(() => {
            this.showSuccessMessage(clientName);
            this.resetForm();
            
            // Reset button state
            submitText.textContent = 'Enviar Mensagem';
            spinner.classList.add('hidden');
            submitButton.disabled = false;
        }, 2000);
    }

    showSuccessMessage(name) {
        // Use toast notification system
        toastManager.success(
            `Obrigado, ${name}! Recebemos sua mensagem e entraremos em contato em breve.`,
            'Mensagem Enviada'
        );
    }

    resetForm() {
        this.form.reset();
        
        // Clear all errors
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.clearValidationState(input));
    }
}

// Navbar Scroll Effect
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                this.navbar.classList.add('navbar-scrolled');
            } else {
                this.navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.html = document.documentElement;
        this.fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
        this.contrastMode = localStorage.getItem('contrastMode') === 'true';
        this.init();
    }

    init() {
        this.applyPreferences();
        this.setupControls();
    }

    applyPreferences() {
        this.html.style.fontSize = `${this.fontSize}px`;
        if (this.contrastMode) {
            this.html.setAttribute('data-contrast', 'high');
        } else {
            this.html.removeAttribute('data-contrast');
        }
    }

    setupControls() {
        document.getElementById('increase-font')?.addEventListener('click', () => this.changeFontSize(1));
        document.getElementById('decrease-font')?.addEventListener('click', () => this.changeFontSize(-1));
        document.getElementById('contrast-toggle')?.addEventListener('click', () => this.toggleContrast());
    }

    changeFontSize(step) {
        const newSize = this.fontSize + step;
        if (newSize >= 12 && newSize <= 22) { // Set min/max font size
            this.fontSize = newSize;
            localStorage.setItem('fontSize', this.fontSize);
            this.applyPreferences();
        }
    }

    toggleContrast() {
        this.contrastMode = !this.contrastMode;
        localStorage.setItem('contrastMode', this.contrastMode);
        this.applyPreferences();
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            // Fallback for older browsers
            this.animatedElements.forEach(el => el.classList.add('animate'));
        }
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(el => observer.observe(el));
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileMenu();
    new SmoothScroll();
    new AnimatedCounters();
    new TestimonialsCarousel();
    new FAQAccordion();
    new ContactForm();
    new NavbarScroll();
    new ScrollAnimations();
    new AccessibilityManager();
    
    // Initialize new components
    toastManager = new ToastManager();
    cookieManager = new CookieManager();
    lazyLoader = new LazyLoader();
    loadingManager = new LoadingManager();

    // Add focus-visible polyfill for better accessibility
    if (!('focus-visible' in document.createElement('div'))) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/focus-visible@5.2.0/dist/focus-visible.min.js';
        document.head.appendChild(script);
    }

    // Console message for developers
    console.log('%c🏛️ Silva & Associados', 'color: #1e3a8a; font-size: 20px; font-weight: bold;');
    console.log('%cSite desenvolvido com HTML5, CSS3 e JavaScript vanilla', 'color: #6b7280; font-size: 12px;');
    
    // Performance monitoring
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`%c⚡ Página carregada em ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`, 'color: #10b981; font-size: 12px;');
    });
});

// Error handling for uncaught exceptions
window.addEventListener('error', (e) => {
    console.error('Erro JavaScript:', e.error);
    
    // In production, you might want to send this to an error tracking service
    // Example: analytics.track('JavaScript Error', { error: e.error.message });
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Map();
    }

    show(message, type = 'info', title = '', duration = 5000) {
        const toastId = Date.now() + Math.random();
        const toast = this.createToast(toastId, message, type, title);
        
        this.container.appendChild(toast);
        this.toasts.set(toastId, toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toastId), duration);
        }
        
        return toastId;
    }

    createToast(id, message, type, title) {
        const icons = {
            success: `<svg class="toast-icon text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
            error: `<svg class="toast-icon text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
            warning: `<svg class="toast-icon text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
            info: `<svg class="toast-icon text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.toastId = id;
        
        const toastContent = document.createElement('div');
        toastContent.className = 'flex items-start';
        toastContent.innerHTML = `
            ${icons[type]}
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
        `;

        const closeButton = document.createElement('button');
        closeButton.className = 'ml-4 text-gray-400 hover:text-gray-600 transition-colors';
        closeButton.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        `;
        closeButton.addEventListener('click', () => this.remove(id));

        toastContent.appendChild(closeButton);
        toast.appendChild(toastContent);
        
        return toast;
    }

    remove(toastId) {
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                this.toasts.delete(toastId);
            }, 500);
        }
    }

    success(message, title = 'Sucesso') {
        return this.show(message, 'success', title);
    }

    error(message, title = 'Erro') {
        return this.show(message, 'error', title);
    }

    warning(message, title = 'Atenção') {
        return this.show(message, 'warning', title);
    }

    info(message, title = 'Informação') {
        return this.show(message, 'info', title);
    }
}

// Cookie Banner Management
class CookieManager {
    constructor() {
        this.banner = document.getElementById('cookie-banner');
        this.acceptBtn = document.getElementById('cookie-accept');
        this.rejectBtn = document.getElementById('cookie-reject');
        this.init();
    }

    init() {
        if (!this.hasConsent()) {
            this.showBanner();
        }
        
        this.acceptBtn?.addEventListener('click', () => this.accept());
        this.rejectBtn?.addEventListener('click', () => this.reject());
    }

    hasConsent() {
        return localStorage.getItem('cookieAccepted') !== null;
    }

    showBanner() {
        this.banner.classList.remove('hidden');
        setTimeout(() => {
            this.banner.classList.remove('translate-y-full');
        }, 100);
    }

    hideBanner() {
        this.banner.classList.add('translate-y-full');
        setTimeout(() => {
            this.banner.classList.add('hidden');
        }, 500);
    }

    accept() {
        localStorage.setItem('cookieAccepted', 'true');
        this.hideBanner();
        toastManager.success('Cookies aceitos. Obrigado por nos ajudar a melhorar sua experiência!');
        
        // Enable analytics or other cookie-dependent features here
        this.enableAnalytics();
    }

    reject() {
        localStorage.setItem('cookieAccepted', 'false');
        this.hideBanner();
        toastManager.info('Preferências salvas. Apenas cookies essenciais serão utilizados.');
    }

    enableAnalytics() {
        // Add Google Analytics or other tracking code here
        console.log('Analytics enabled');
    }
}

// Lazy Loading for Images
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('.lazy-load');
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    createObserver() {
        const options = {
            rootMargin: '50px 0px',
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => this.imageObserver.observe(img));
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.src = src;
        img.classList.add('loaded');
        
        img.onload = () => {
            img.classList.add('loaded');
        };
        
        img.onerror = () => {
            console.error('Failed to load image:', src);
            // Set a fallback image or show error state
        };
        
        this.imageObserver?.unobserve(img);
    }

    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// Loading States Manager
class LoadingManager {
    constructor() {
        this.overlay = document.getElementById('loading-overlay');
    }

    show(message = 'Carregando...') {
        if (this.overlay) {
            this.overlay.querySelector('p').textContent = message;
            this.overlay.classList.remove('hidden');
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.add('hidden');
        }
    }

    showFor(duration, message = 'Carregando...') {
        this.show(message);
        setTimeout(() => this.hide(), duration);
    }
}

// Global instances
let toastManager, cookieManager, lazyLoader, loadingManager;

// Export functions for potential external use
window.SilvaAssociados = {
    MobileMenu,
    TestimonialsCarousel,
    ContactForm,
    ToastManager,
    CookieManager,
    LazyLoader,
    LoadingManager,
    AccessibilityManager,
    // Global instances
    toast: () => toastManager,
    loading: () => loadingManager
};
