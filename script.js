document.addEventListener('DOMContentLoaded', () => {

    // 1. Loader & Hero trigger
    const loader = document.querySelector('.loader');
    const towers = document.querySelectorAll('.css-tower');
    const heroWrap = document.querySelector('.hero');

    setTimeout(() => {
        // Fade out loader
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';

        // Trigger hero build
        setTimeout(() => {
            towers.forEach(t => t.classList.add('loaded'));
            heroWrap.classList.add('loaded-ui');
            document.querySelector('.center-bridge').classList.add('loaded');
        }, 300);

    }, 1800);

    // Menu Toggle Logic
    const menuBtn = document.querySelector('.menu-btn');
    const sideMenu = document.querySelector('.side-menu');
    const menuBackdrop = document.querySelector('.menu-backdrop');
    const menuLinks = document.querySelectorAll('.side-item');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        sideMenu.classList.toggle('active');
        if (menuBackdrop) menuBackdrop.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (sideMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu function
    const closeMenu = () => {
        menuBtn.classList.remove('open');
        sideMenu.classList.remove('active');
        if (menuBackdrop) menuBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close menu when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeMenu);
    }

    // 2. Dynamic background floating blocks for Hero
    const bgContainer = document.querySelector('.bg-blocks');
    const colors = ['#2d3452', '#c92f3c', '#e0e0e0'];

    for (let i = 0; i < 8; i++) {
        let block = document.createElement('div');
        block.style.position = 'absolute';
        block.style.width = Math.random() * 60 + 20 + 'px';
        block.style.height = block.style.width;
        block.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        block.style.opacity = Math.random() * 0.05 + 0.02;
        block.style.left = Math.random() * 100 + 'vw';
        block.style.top = Math.random() * 100 + 'vh';
        block.style.animation = `floatShape ${Math.random() * 10 + 10}s linear infinite alternate`;
        bgContainer.appendChild(block);
    }

    // 3. Number Counting & Scroll Trigger Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate Number Counters
                if (entry.target.classList.contains('stat-box')) {
                    const numberElement = entry.target.querySelector('.stat-number');
                    if (numberElement && !numberElement.classList.contains('counted')) {
                        numberElement.classList.add('counted');
                        const target = +numberElement.getAttribute('data-target');
                        const duration = 2000;
                        const frameRate = 30;
                        const totalFrames = Math.round((duration / 1000) * frameRate);
                        let frame = 0;
                        const counter = setInterval(() => {
                            frame++;
                            const progress = frame / totalFrames;
                            // ease out quad
                            const current = target * (1 - (1 - progress) * (1 - progress));
                            numberElement.innerText = Math.round(current);
                            if (frame === totalFrames) {
                                clearInterval(counter);
                                numberElement.innerText = target;
                            }
                        }, 1000 / frameRate);
                    }
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-trigger, .fade-scale').forEach(el => observer.observe(el));

    // Subtly parallax the towers on scroll and manage navbar
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        const fixedNav = document.querySelector('.fixed-nav');
        if (scrolled > 50) {
            fixedNav.classList.add('scrolled');
        } else {
            fixedNav.classList.remove('scrolled');
        }

        document.querySelectorAll('.css-tower').forEach(tower => {
            tower.style.transform = `translateY(${scrolled * 0.2}px)`;
        });

        const bridgeText = document.querySelector('.center-bridge');
        if (bridgeText) {
            bridgeText.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // 4. GSAP Horizontal Scroll
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const track = document.querySelector('.scroll-track');
        const sections = gsap.utils.toArray('.track-panel');

        if (track && sections.length > 0) {
            let mm = gsap.matchMedia();

            mm.add("(min-width: 901px)", () => {
                gsap.to(sections, {
                    xPercent: -100 * (sections.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".horizontal-scroll-section",
                        pin: true,
                        scrub: 1,
                        snap: {
                            snapTo: 1 / (sections.length - 1),
                            duration: { min: 0.2, max: 0.5 },
                            delay: 0.1,
                            ease: "power1.inOut"
                        },
                        end: () => "+=" + track.offsetWidth
                    }
                });
            });
        }
    }

    // 5. Language Toggle Logic
    const langToggles = document.querySelectorAll('.lang-toggle');
    const tlTexts = document.querySelectorAll('.tl-text');

    langToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Remove active from all
            langToggles.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked
            e.target.classList.add('active');

            const selectedLang = e.target.getAttribute('data-lang'); // 'en' or 'fr'

            // Smoothly update all text elements
            tlTexts.forEach(el => {
                // simple fade effect during swap
                el.style.opacity = 0;
                setTimeout(() => {
                    if (selectedLang === 'fr' && el.hasAttribute('data-fr')) {
                        el.innerHTML = el.getAttribute('data-fr');
                    } else if (selectedLang === 'en' && el.hasAttribute('data-en')) {
                        el.innerHTML = el.getAttribute('data-en');
                    }
                    el.style.opacity = 1;
                    el.style.transition = 'opacity 0.3s ease';
                }, 150);
            });
        });
    });
});

// Global keyframe for dynamic bg
const style = document.createElement('style');
style.innerHTML = `
@keyframes floatShape {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(90deg); }
}
`;
document.head.appendChild(style);
