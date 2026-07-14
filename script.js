/**
 * Rishi Funde Portfolio - Clean and optimized scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Loading Screen Anim
    // ==========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 300);
    });


    // ==========================================
    // 2. Custom Cursor (Desktop Only)
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    if (cursor && cursorDot && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        // Hover Effect on interactive elements
        const hoverables = document.querySelectorAll('a, button, .glass-card');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.style.width = '35px';
                cursor.style.height = '35px';
                cursor.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            });
            item.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            });
        });
    }


    // ==========================================
    // 3. Scroll Progress Indicator & Back to Top
    // ==========================================
    const scrollBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            scrollBar.style.width = `${progress}%`;
        }

        // Back to top appearance
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================
    // 4. Reveal Animations on Scroll
    // ==========================================
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 100; // Trigger slightly before element is in full view

            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };
    
    // Run on init and scroll
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initial check


    // ==========================================
    // 5. Mobile Navigation Menu Toggle
    // ==========================================
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksList = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link, .nav-link-btn');

    const toggleMenu = () => {
        const isOpen = navLinksList.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when links are clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinksList.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    // ==========================================
    // 6. Active Navigation on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});
