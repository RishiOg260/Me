// ========================================
// Rishi Funde Portfolio - JavaScript
// Astonishing Animations: Particle System + 3D Tilt + Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 600);
    }, 1400);

    // 2. Scroll Progress Bar
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 3. Active Navigation Highlight
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0.1
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => navObserver.observe(section));

    // 4. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });

    // 5. Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // 6. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 7. Section Reveal Animations (enhanced)
    const revealElements = document.querySelectorAll('.glass-card, .section-title');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(35px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });

    // 8. Custom Cursor (Desktop only)
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactive = document.querySelectorAll('a, button, .glass-card, .skill-pill, .connect-btn');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.6)';
                cursor.style.borderColor = 'var(--accent)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--accent)';
            });
        });
    } else {
        cursor.style.display = 'none';
    }

    // 9. ASTONISHING: Canvas Particle System in Hero
    initParticleSystem();

    // 10. ASTONISHING: 3D Tilt Effect on all Glass Cards
    init3DTiltEffects();

    // 11. Staggered Animation for Skill Pills
    initStaggeredSkills();

    // 12. Add Aurora Background
    const aurora = document.createElement('div');
    aurora.id = 'aurora';
    document.body.prepend(aurora);

    // 13. Keyboard Accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });

    // Bonus: Subtle button ripple on click
    document.querySelectorAll('.btn, .connect-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.4)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.offsetX - 10) + 'px';
            ripple.style.top = (e.offsetY - 10) + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// ========================================
// ASTONISHING PARTICLE SYSTEM
// ========================================
function initParticleSystem() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let mouse = { x: null, y: null, active: false };

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.8 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.55 + 0.35;
            this.hue = 235 + Math.random() * 35; // Beautiful indigo range
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Gentle bounce at edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse repulsion (astonishing interaction)
            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.hypot(dx, dy);

                if (distance < 140 && distance > 0) {
                    const force = (140 - distance) / 140 * 1.8;
                    this.x += (dx / distance) * force;
                    this.y += (dy / distance) * force;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.shadowBlur = 12;
            ctx.shadowColor = `hsla(${this.hue}, 85%, 75%, ${this.opacity * 0.9})`;
            ctx.fillStyle = `hsla(${this.hue}, 90%, 82%, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 8500)); // Responsive count
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Touch support for mobile (light interaction)
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
            mouse.active = true;
        }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        mouse.active = false;
    });

    function animate() {
        if (!ctx || !canvas) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    createParticles();
    animate();

    // Gentle random drift reset occasionally for organic feel
    setInterval(() => {
        if (particles.length > 0 && Math.random() > 0.7) {
            const randomIndex = Math.floor(Math.random() * particles.length);
            particles[randomIndex].reset();
        }
    }, 8000);
}

// ========================================
// 3D TILT EFFECT (Astonishing Premium Feel)
// ========================================
function init3DTiltEffects() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        let bounds = null;

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            card.style.transition = 'transform 0.08s ease-out';
        });

        card.addEventListener('mousemove', (e) => {
            if (!bounds) bounds = card.getBoundingClientRect();

            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            // Calculate rotation (max ~11 degrees for elegant feel)
            const rotateX = ((mouseY - centerY) / centerY) * -11;
            const rotateY = ((mouseX - centerX) / centerX) * 11;

            card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.65s cubic-bezier(0.23, 1.0, 0.32, 1)';
            card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)';
            bounds = null;
        });
    });
}

// ========================================
// STAGGERED SKILL PILL ANIMATIONS
// ========================================
function initStaggeredSkills() {
    const skillPills = document.querySelectorAll('.skill-pill');
    
    // Initial state
    skillPills.forEach((pill, index) => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(25px)';
        pill.style.transition = 'none';
    });

    // Trigger staggered animation after a short delay
    setTimeout(() => {
        skillPills.forEach((pill, index) => {
            pill.style.transition = `all 0.55s cubic-bezier(0.23, 1.0, 0.32, 1) ${index * 75}ms`;
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
        });
    }, 950);
}