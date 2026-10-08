/* ==========================================================================
   Anshul Gupta — Portfolio
   Loader timing · navigation · mobile menu · scroll reveal · About marquee
   ========================================================================== */

const LOADER_DURATION = 2000; // ms — requested ~2 second loading screen

/* --------------------------------------------------------------------------
   Content data
   -------------------------------------------------------------------------- */
const PROJECTS = [
    {
        name: 'Google Review Management Platform',
        label: 'Featured · Product',
        year: '2025',
        featured: true,
        description:
            'A dashboard concept for collecting, monitoring and responding to Google reviews across multiple business locations, with sentiment insight and a unified reply workflow.',
        tech: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
        links: [
            { label: 'View Project', href: 'https://github.com/', style: 'primary' },
            { label: 'GitHub', href: 'https://github.com/', style: 'ghost' },
        ],
    },
    {
        name: 'Developer Portfolio',
        label: 'Website',
        year: '2025',
        description:
            'A responsive, accessibility-minded portfolio built with semantic HTML, a custom glass design system and animation that stays out of the way.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        links: [
            { label: 'View Project', href: 'https://github.com/', style: 'primary' },
            { label: 'GitHub', href: 'https://github.com/', style: 'ghost' },
        ],
    },
    {
        name: 'Cybersecurity / Compliance SaaS Concept',
        label: 'SaaS Concept',
        year: '2026',
        description:
            'A product exploration for helping small teams track security posture and compliance evidence without a dedicated compliance officer.',
        tech: ['Next.js', 'PostgreSQL', 'APIs'],
        links: [
            { label: 'View Project', href: 'https://github.com/', style: 'primary' },
            { label: 'GitHub', href: 'https://github.com/', style: 'ghost' },
        ],
    },
    {
        name: 'Automation Experiments',
        label: 'Experimental',
        year: '2026',
        description:
            'Workflow automations that connect forms, email and third-party APIs into repeatable pipelines, removing manual copy-paste from routine tasks.',
        tech: ['n8n', 'Node.js', 'REST APIs'],
        links: [{ label: 'View Project', href: 'https://github.com/', style: 'primary' }],
    },
];

const TIMELINE = [
    {
        year: '2024',
        title: 'Started building technical projects',
        text: 'Moved from tutorials to real builds — first static sites, first bugs, first lessons in structure and patience.',
    },
    {
        year: '2025',
        title: 'Expanded programming and web development skills',
        text: 'Deepened JavaScript, component-based UI and backend fundamentals with Node.js, APIs and relational databases.',
    },
    {
        year: '2026',
        title: 'Working on SaaS and modern web applications',
        text: 'Building full product flows, integrations and automation pipelines — focused on shipping useful software.',
    },
];

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const qs = (selector, scope) => (scope || document).querySelector(selector);
const qsa = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   1. Build dynamic content (projects + timeline)
   -------------------------------------------------------------------------- */
function buildProjects() {
    const grid = qs('#projectsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    PROJECTS.forEach((project) => {
        const card = document.createElement('article');
        card.className = 'project-card glass glass--tall reveal' + (project.featured ? ' project-card--featured' : '');

        const sheen = document.createElement('div');
        sheen.className = 'glass__sheen';
        sheen.setAttribute('aria-hidden', 'true');
        card.appendChild(sheen);

        const top = document.createElement('div');
        top.className = 'project-card__top';
        const headingWrap = document.createElement('div');
        const label = document.createElement('p');
        label.className = 'project-card__label';
        label.textContent = project.label;
        const title = document.createElement('h3');
        title.className = 'project-card__title';
        title.textContent = project.name;
        headingWrap.append(label, title);
        const year = document.createElement('span');
        year.className = 'project-card__year';
        year.textContent = project.year;
        top.append(headingWrap, year);
        card.appendChild(top);

        const desc = document.createElement('p');
        desc.className = 'project-card__desc';
        desc.textContent = project.description;
        card.appendChild(desc);

        const tech = document.createElement('div');
        tech.className = 'project-card__tech';
        project.tech.forEach((item) => {
            const span = document.createElement('span');
            span.textContent = item;
            tech.appendChild(span);
        });
        card.appendChild(tech);

        const actions = document.createElement('div');
        actions.className = 'project-card__actions';
        project.links.forEach((link) => {
            const a = document.createElement('a');
            a.className = 'btn ' + (link.style === 'primary' ? 'btn--primary btn--sm' : 'btn--ghost btn--sm');
            a.href = link.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = link.label;
            a.setAttribute('aria-label', link.label + ' — ' + project.name);
            actions.appendChild(a);
        });
        card.appendChild(actions);

        grid.appendChild(card);
    });
}

function buildTimeline() {
    const list = qs('#timeline');
    if (!list) return;

    list.innerHTML = '';

    TIMELINE.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'timeline__item reveal';

        const card = document.createElement('article');
        card.className = 'timeline__card glass';

        const year = document.createElement('p');
        year.className = 'timeline__year';
        year.textContent = item.year;

        const title = document.createElement('h3');
        title.className = 'timeline__title';
        title.textContent = item.title;

        const text = document.createElement('p');
        text.className = 'timeline__text';
        text.textContent = item.text;

        card.append(year, title, text);
        li.appendChild(card);
        list.appendChild(li);
    });
}

/* --------------------------------------------------------------------------
   2. Loading screen — exact ~2s dwell, then fade into the portfolio
   -------------------------------------------------------------------------- */
function runLoader() {
    const screen = qs('#loaderScreen');
    const bar = qs('#loaderBar');
    const percentLabel = qs('#loaderPercent');

    document.body.classList.add('is-loading');

    if (!screen) {
        document.body.classList.remove('is-loading');
        document.body.classList.add('js-ready');
        return;
    }

    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / LOADER_DURATION, 1);
        const percent = Math.round(progress * 100);

        if (bar) bar.style.width = percent + '%';
        if (percentLabel) percentLabel.textContent = String(percent);

        if (progress < 1) {
            requestAnimationFrame(step);
            return;
        }

        finishLoading(screen);
    }

    requestAnimationFrame(step);
    window.setTimeout(() => finishLoading(screen), LOADER_DURATION + 260);
}

function finishLoading(screen) {
    if (screen.classList.contains('is-done')) return;

    screen.classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('js-ready');
    document.body.setAttribute('data-loaded', 'true');
    revealInView();

    window.setTimeout(() => {
        screen.setAttribute('aria-hidden', 'true');
        if (screen.parentNode) screen.parentNode.removeChild(screen);
    }, 900);
}

/* --------------------------------------------------------------------------
   3. Mobile menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const toggle = qs('#navToggle');
    const menu = qs('#mobileMenu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        toggle.classList.toggle('is-open', open);
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

    qsa('.mobile-menu__link', menu).forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && menu.classList.contains('is-open')) setOpen(false);
    });
}

/* --------------------------------------------------------------------------
   4. Scroll reveal + active navigation + stuck state
   -------------------------------------------------------------------------- */
function revealInView() {
    qsa('.reveal:not(.is-visible)').forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) item.classList.add('is-visible');
    });
}

function initReveal() {
    const items = qsa('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach((item, index) => {
        const inHero = item.closest('#home');
        item.style.transitionDelay = inHero ? '0ms' : Math.min(index % 4, 3) * 70 + 'ms';
        observer.observe(item);
    });

    // Above-the-fold content must never wait on an observer callback.
    revealInView();
}

function initNavState() {
    const shell = qs('#navShell');
    const sections = qsa('main section[id]');
    const navLinks = qsa('.nav__link');
    const mobileLinks = qsa('.mobile-menu__link');

    const setActive = (id) => {
        navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === '#' + id));
        mobileLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === '#' + id));
    };

    const onScroll = () => {
        if (shell) shell.classList.toggle('is-stuck', window.scrollY > 24);

        const offset = window.scrollY + window.innerHeight * 0.32;
        let current = sections.length ? sections[0].id : '';

        sections.forEach((section) => {
            if (section.offsetTop <= offset) current = section.id;
        });

        if (current) setActive(current);
    };

    let ticking = false;
    window.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
        },
        { passive: true }
    );

    onScroll();
}

/* --------------------------------------------------------------------------
   5. Animated statistics counters
   -------------------------------------------------------------------------- */
function initCounters() {
    const numbers = qsa('.stats__num');
    if (!numbers.length) return;

    const render = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = String(target) + suffix;
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        numbers.forEach(render);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10) || 0;
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1400;
                const startTime = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = String(Math.round(target * eased)) + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
                observer.unobserve(el);
            });
        },
        { threshold: 0.4 }
    );

    numbers.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. About section — automatic, seamless horizontal scrolling
   -------------------------------------------------------------------------- */
function initAboutMarquee() {
    const track = qs('#aboutTrack');
    const marquee = qs('#aboutMarquee');
    if (!track) return;

    const original = qs('.marquee__group', track);
    if (!original || prefersReducedMotion) return;

    // Duplicate the group so the loop can wrap without a visible jump.
    const clone = original.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);

    const SPEED = 42; // px per second
    const DIRECTION = -1; // scroll to the left
    let offset = 0;
    let groupWidth = 0;
    let paused = false;
    let lastTime = null;

    const measure = () => {
        groupWidth = original.getBoundingClientRect().width;
    };

    measure();
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    if (marquee) {
        marquee.addEventListener('mouseenter', () => { paused = true; });
        marquee.addEventListener('mouseleave', () => { paused = false; });
        marquee.addEventListener('focusin', () => { paused = true; });
        marquee.addEventListener('focusout', () => { paused = false; });
    }

    const step = (now) => {
        if (lastTime === null) lastTime = now;
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        if (!paused && groupWidth > 0) {
            offset += SPEED * DIRECTION * delta;
            if (offset <= -groupWidth) offset += groupWidth;
            if (offset > 0) offset -= groupWidth;
        }

        track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
        requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   7. Circular light that follows the cursor
   -------------------------------------------------------------------------- */
function initCursorLight() {
    const light = qs('#cursorLight');
    if (!light) return;

    // Only pointer devices with a real cursor get the light effect.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer || prefersReducedMotion) {
        light.style.display = 'none';
        return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let active = false;

    window.addEventListener(
        'pointermove',
        (event) => {
            if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

            targetX = event.clientX;
            targetY = event.clientY;

            if (!active) {
                active = true;
                currentX = targetX;
                currentY = targetY;
                light.classList.add('is-active');
            }
        },
        { passive: true }
    );

    document.addEventListener('pointerleave', () => {
        active = false;
        light.classList.remove('is-active');
    });

    window.addEventListener('blur', () => {
        active = false;
        light.classList.remove('is-active');
    });

    const render = () => {
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;
        light.style.transform = 'translate3d(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px, 0)';
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
function init() {
    buildProjects();
    buildTimeline();
    initMobileMenu();
    initReveal();
    initNavState();
    initCounters();
    initAboutMarquee();
    initCursorLight();
    runLoader();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
