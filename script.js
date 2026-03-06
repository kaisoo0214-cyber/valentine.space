// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // 只阻止纯片段标识符（如#hero），允许包含文件路径的链接（如index.html#projects）正常跳转
        if (href.match(/^#[a-zA-Z-]+$/)) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active navigation highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
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

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(99, 102, 241, 0.1)';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and items
const animatedElements = document.querySelectorAll(
    '.experience-card, .project-card, .portfolio-item, .skill-category, .stat-card, .timeline-content'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Typing effect for hero role (optional)
const heroRole = document.querySelector('.hero-role');
const roles = ['前端开发工程师', 'UI/UX 设计师', '全栈开发者'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        heroRole.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        heroRole.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => {
            isDeleting = true;
        }, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, typingSpeed);
}

// Uncomment to enable typing effect
// setTimeout(typeEffect, 1000);

// Mobile menu toggle (if needed in future)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Add hover effect to skill bars
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
    const parent = bar.closest('.skill-item');
    parent.addEventListener('mouseenter', () => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});

// Add click animation to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Project card click handler - navigate to project detail page
console.log('Setting up project card click handlers...');
document.querySelectorAll('.project-card').forEach((card, index) => {
    console.log(`Setting up card ${index}:`, card);
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
        console.log(`Card ${index} clicked!`, this);
        const href = this.getAttribute('data-href');
        console.log('Project card clicked, href:', href);
        if (href) {
            console.log(`Navigating to: ${href}`);
            window.location.href = href;
        } else {
            console.error('No data-href attribute found on card!');
        }
    });
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    if (hero) {
        hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});

// Console welcome message
console.log('%c👋 欢迎来到我的简历网站！', 'font-size: 20px; font-weight: bold; color: #EC4899;');
console.log('%c感谢您的关注，期待与您的交流！', 'font-size: 14px; color: #64748B;');
