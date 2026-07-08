// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // HAMBURGER TOGGLE
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
            // Toggle aria-expanded
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
        });
    }


    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const nav = document.getElementById('mainNav');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
            nav.classList.remove('shadow-md');
        } else {
            nav.classList.remove('shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
            nav.classList.add('shadow-md');
        }

        lastScroll = currentScroll;
    });


    // ============================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('mainNav')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    hamburger?.click();
                }
            }
        });
    });


    // ============================================
    // BACK TO TOP
    // ============================================
    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ============================================
    // SLICK CAROUSEL
    // ============================================
    if (typeof $ !== 'undefined' && $.fn.slick) {
        $('.programs-slider').slick({
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }


    // ============================================
    // FORM STEPS (Register Page)
    // ============================================
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;

    function updateSteps(stepIndex) {
        // Hide all steps
        steps.forEach((step, index) => {
            step.classList.add('hidden');
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.remove('hidden');
                step.classList.add('active');
            }
        });

        // Update progress
        progressSteps.forEach((step, index) => {
            const fill = step.querySelector('.h-full');
            if (index <= stepIndex) {
                if (fill) fill.style.width = '100%';
                step.classList.add('active');
            } else {
                if (fill) fill.style.width = '0%';
                step.classList.remove('active');
            }
        });

        // Update step indicator text
        const stepIndicator = document.querySelector('.progress-header .text-xs');
        if (stepIndicator) {
            stepIndicator.textContent = `Step ${stepIndex + 1} of ${steps.length}`;
        }
    }

    if (nextBtns.length > 0) {
        nextBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const parentStep = this.closest('.form-step');
                const stepIndex = parseInt(parentStep.dataset.step) - 1;

                // Basic validation for current step
                const inputs = parentStep.querySelectorAll('input[required], select[required]');
                let valid = true;
                inputs.forEach(input => {
                    if (!input.value) {
                        input.classList.add('border-red-500');
                        valid = false;
                    } else {
                        input.classList.remove('border-red-500');
                    }
                });

                if (valid && stepIndex < steps.length - 1) {
                    currentStep = stepIndex + 1;
                    updateSteps(currentStep);
                } else if (!valid) {
                    alert('Please fill in all required fields.');
                }
            });
        });
    }

    if (prevBtns.length > 0) {
        prevBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const parentStep = this.closest('.form-step');
                const stepIndex = parseInt(parentStep.dataset.step) - 1;
                if (stepIndex > 0) {
                    currentStep = stepIndex - 1;
                    updateSteps(currentStep);
                }
            });
        });
    }


    // ============================================
    // REGISTRATION FORM SUBMIT
    // ============================================
    const registerForm = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all required fields
            const inputs = this.querySelectorAll('input[required], select[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value) {
                    input.classList.add('border-red-500');
                    valid = false;
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (!valid) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show success
            if (successMessage) {
                successMessage.classList.remove('hidden');
                this.classList.add('hidden');
                successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Registration Successful! Welcome to UniRewards.');
            }
        });
    }


    // ============================================
    // QUIZ OPTIONS (Tata Soulfull style)
    // ============================================
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                // Remove active class from siblings
                this.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('bg-[#001E82]/5', 'border-[#001E82]');
                });
                this.classList.add('bg-[#001E82]/5', 'border-[#001E82]');
            }
        });
    });


    // ============================================
    // MODAL HANDLING (Reusable)
    // ============================================
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });


    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    if ('IntersectionObserver' in window) {
        const animateElements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(el => observer.observe(el));
    }


    // ============================================
    // KEYBOARD ACCESSIBILITY
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });

            // Close sidebar on escape
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                closeSidebar();
            }
        }
    });


    // ============================================
    // SIDEBAR FUNCTIONS (Global)
    // ============================================
    window.openSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) {
            sidebar.classList.remove('-translate-x-full');
            if (overlay) overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) {
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };


    // ============================================
    // CONSOLE LOG (Welcome message)
    // ============================================
    console.log('🚀 UniRewards Platform v2.0');
    console.log('📚 Built with ❤️ using Bootstrap, Tailwind, and SCSS');
    console.log('⭐ Features: University Landing | Rewards | Gamification | KYC');
});