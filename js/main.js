// Main JavaScript for Busan City Hall Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSwiper();
    initMobileMenu();
    initSearch();
    initScrollToTop();
    initAnimations();
    initWeatherWidget();
    initStatistics();
    initNavigationMenu();
    initSideNavigation();
    initSectionScroll();
});

// Swiper Initialization for main slider
function initSwiper() {
    const swiper = new Swiper('.jump_slide', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        on: {
            slideChange: function() {
                // Add animation to slide content
                const activeSlide = this.slides[this.activeIndex];
                const title = activeSlide.querySelector('.title');
                const imgArea = activeSlide.querySelector('.img_area');
                if (title) {
                    title.classList.add('fade-in-up');
                    setTimeout(() => {
                        title.classList.remove('fade-in-up');
                    }, 600);
                }
                if (imgArea) {
                    imgArea.classList.add('fade-in');
                    setTimeout(() => {
                        imgArea.classList.remove('fade-in');
                    }, 600);
                }
            }
        }
    });

    // Pause autoplay on hover
    const swiperContainer = document.querySelector('.jump_slide');
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', () => {
            swiper.autoplay.stop();
        });
        
        swiperContainer.addEventListener('mouseleave', () => {
            swiper.autoplay.start();
        });
    }
}

// Initialize Side Navigation
function initSideNavigation() {
    const navDots = document.querySelectorAll('.navi-dots');
    const sections = document.querySelectorAll('.section');
    
    // Update active dot based on scroll position
    function updateActiveDot() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${current}`) {
                dot.classList.add('active');
            }
        });
    }

    // Smooth scroll to section
    navDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update on scroll
    window.addEventListener('scroll', updateActiveDot);
    updateActiveDot(); // Initial call
}

// Initialize Section Scroll
function initSectionScroll() {
    const sections = document.querySelectorAll('.section');
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Mobile Menu - Complete Implementation
function initMobileMenu() {
    const mobileToggle = document.querySelector('.hd-gnb-mobile .btn-link');
    const mobileNav = document.querySelector('.hd-gnb');
    const navBack = document.getElementById('navBack');

    if (mobileToggle && mobileNav && navBack) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileNav.classList.toggle('mobile-active');
            navBack.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navBack.addEventListener('click', function() {
            mobileNav.classList.remove('mobile-active');
            navBack.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // Handle submenu toggles in mobile menu
        const submenuToggles = mobileNav.querySelectorAll('.depth01-list > .depth01-link');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                // Only toggle if it has a submenu
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('depth02')) {
                    e.preventDefault();
                    this.parentNode.classList.toggle('open');
                    const submenu = this.nextElementSibling;
                    if (submenu.style.display === 'block') {
                        submenu.style.display = 'none';
                    } else {
                        submenu.style.display = 'block';
                    }
                }
            });
        });
    }
}

// Search Functionality
function initSearch() {
    const searchLink = document.querySelector('.hd-searchbox .btn-search');
    if (searchLink) {
        searchLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('통합검색 기능은 개발 예정입니다.');
            // Implement actual search overlay or page navigation
        });
    }
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollTopButton = document.getElementById('scrollTop');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 200) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Animations
function initAnimations() {
    // AOS.init(); // If using AOS library
}

// Weather Widget
function initWeatherWidget() {
    // Fetch weather data and update .weather-temp and .weather-desc
    // For now, static data is used in HTML
}

// Statistics
function initStatistics() {
    // Fetch statistics data and update relevant sections
    // For now, static data is used in HTML
}

// Navigation Menu (Desktop) - Actual Busan City Hall Behavior
function initNavigationMenu() {
    const gnbContainer = document.querySelector('.hd-gnb');
    const allSubmenus = document.querySelectorAll('.depth02');
    const allSubmenuItems = document.querySelectorAll('.depth02-list');

    if (gnbContainer) {
        // Show all submenus when hovering over any main menu item
        gnbContainer.addEventListener('mouseenter', () => {
            allSubmenus.forEach(submenu => {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateY(0)';
            });
            
            // Animate submenu items with staggered delay
            allSubmenuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50 + 100);
            });
        });

        // Hide all submenus when leaving the navigation area
        gnbContainer.addEventListener('mouseleave', () => {
            allSubmenus.forEach(submenu => {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateY(-20px)';
            });
            
            // Reset submenu items
            allSubmenuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
            });
        });

        // Individual menu item hover effects
        const navItems = document.querySelectorAll('.depth01-list');
        navItems.forEach(item => {
            const link = item.querySelector('.depth01-link');
            if (link) {
                item.addEventListener('mouseenter', () => {
                    // Add active class for styling
                    item.classList.add('active');
                });

                item.addEventListener('mouseleave', () => {
                    item.classList.remove('active');
                });
            }
        });
    }
}