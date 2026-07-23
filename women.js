gsap.registerPlugin(ScrollTrigger);

/* Lenis */
const lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);

/* Page Loader */
document.fonts.ready.then(() => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            ScrollTrigger.refresh();
        }, 500);
    }
});

/* Detect touch device (used for cursor + any future hover-only effects) */
const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* Custom Cursor - desktop only */
const dot = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");

if (!isTouchDevice) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener("mousemove", e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
    });

    (function loop() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("mouseenter", () => ring.classList.add("hov"));
        el.addEventListener("mouseleave", () => ring.classList.remove("hov"));
    });
} else {
    dot.style.display = "none";
    ring.style.display = "none";
}

/* Account icon desktop only */
if (window.innerWidth >= 768) {
    document.getElementById("acc-btn").style.display = "flex";
}

/* Navbar scroll */
let lastScroll = 0;
const nav = document.getElementById("nav");
const anno = document.getElementById("anno-bar");
const ANNO_H = 34;

window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (current > 40) {
        nav.classList.add("scrolled");
        anno.style.transform = `translateY(-${ANNO_H}px)`;
        nav.style.top = "0px";
    } else {
        nav.classList.remove("scrolled");
        anno.style.transform = "translateY(0)";
        nav.style.top = `${ANNO_H}px`;
    }

    if (current > 120) {
        nav.style.transform = current > lastScroll
            ? "translateY(-100%)"
            : "translateY(0)";
    } else {
        nav.style.transform = "translateY(0)";
    }

    lastScroll = current;
});

/* Full screen menu */
const menuImages = {
    home: "images/home.jpg",
    men: "images/men.jpg",
    women: "images/women.jpg",
    kids: "images/kids.jfif",
    brands: "images/brands.jfif",
    featured: "images/featured.jfif",
    sale: "images/sale.jfif",
    shop: "images/shop.jpg",
    about: "images/about.jfif",
    contact: "images/contact.jfif",
};

const menuLabels = {
    home: { t: '"Define Your Street"', s: "AUREL — 2025 Collection" },
    men: { t: '"Built for the Streets"', s: "Men's Collection" },
    women: { t: '"Fierce. Fluid. Free."', s: "Women's Collection" },
    kids: { t: '"Little Legends"', s: "Kids' Collection" },
    brands: { t: '"Only the Icons"', s: "Brand Directory" },
    featured: { t: '"This Week\'s Drop"', s: "Featured Arrivals" },
    sale: { t: '"Last Chance Prices"', s: "Sale — Up to 50% Off" },
    shop: { t: '"The Full Archive"', s: "Shop All Products" },
    about: { t: '"Born on the Streets"', s: "Our Story" },
    contact: { t: '"Let\'s Talk"', s: "Get in Touch" },
};

const fsrImg = document.getElementById("fsr-img");
const fsrTxt = document.getElementById("fsr-txt");
const fsrSub = document.getElementById("fsr-sub");

document.querySelectorAll("#fs-links a").forEach(link => {
    link.addEventListener("mouseenter", () => {
        const p = link.getAttribute("data-p");
        if (!menuImages[p]) return;
        gsap.to(fsrImg, {
            opacity: 0, duration: 0.25,
            onComplete: () => {
                fsrImg.src = menuImages[p];
                fsrTxt.textContent = menuLabels[p].t;
                fsrSub.textContent = menuLabels[p].s;
                gsap.to(fsrImg, { opacity: 1, duration: 0.45 });
            }
        });
    });
});

function openMenu() {
    const menu = document.getElementById("fs-menu");
    const items = document.querySelectorAll("#fs-links li");
    lenis.stop();
    gsap.timeline()
        .set(menu, { display: "flex" })
        .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.inOut" })
        .fromTo("#fsl", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, "-=0.2")
        .fromTo("#fsr", { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.35")
        .fromTo(items, { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.055, ease: "power3.out" }, "-=0.3")
        .fromTo(["#fs-close", "#fs-bot"], { opacity: 0 }, { opacity: 1, duration: 0.35 }, "-=0.2");
}

function closeMenu() {
    const menu = document.getElementById("fs-menu");
    const items = document.querySelectorAll("#fs-links li");
    gsap.timeline()
        .to(items, { y: -25, opacity: 0, duration: 0.25, stagger: 0.04, ease: "power3.in" })
        .to(menu, {
            opacity: 0, duration: 0.35, ease: "power2.inOut",
            onComplete: () => { menu.style.display = "none"; lenis.start(); }
        }, "-=0.1");
}

document.getElementById("ham").addEventListener("click", openMenu);
document.getElementById("fs-close").addEventListener("click", closeMenu);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

/* REVEAL ON SCROLL - WOMEN'S HERO */

gsap.to("#wh-img", {
    scrollTrigger: {
        trigger: "#women-hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
    },
    // Animate the CSS filter and transform together
    filter: "blur(0px) grayscale(0) brightness(1)",
    scale: 1,
    ease: "none"
});

gsap.to("#wh-overlay", {
    scrollTrigger: {
        trigger: "#women-hero",
        start: "top top",
        end: "60% bottom",
        scrub: 0.6,
    },
    opacity: 0,
    ease: "none"
});

/* Hero content entrance on page load (separate from scroll reveal) */
gsap.set(["[data-wh-label]", "[data-wh-title]", "[data-wh-sub]",
    "[data-wh-scroll]"], { opacity: 0 });

const womenHeroTL = gsap.timeline({ delay: 0.5 });

womenHeroTL
    .to("[data-wh-label]", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
    .fromTo("[data-wh-title]",
        { y: "100%" },
        { y: "0%", opacity: 1, duration: 1, ease: "power4.out" },
        "-=0.2"
    )
    .to("[data-wh-sub]", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")
    .to("[data-wh-scroll]", { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");

/* Scroll line pulse */
gsap.to("#wh-scroll-line", {
    scaleY: 0,
    transformOrigin: "bottom",
    duration: 1,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
});

/* Fade out scroll indicator once user starts scrolling into the reveal */
gsap.to("[data-wh-scroll]", {
    scrollTrigger: {
        trigger: "#women-hero",
        start: "top top",
        end: "15% top",
        scrub: true
    },
    opacity: 0,
    ease: "none"
});

/* Navbar entrance */
gsap.from("#nav", { y: -20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

/* CATEGORY NAVIGATION - smooth scroll + active state tracking */

const catNavBtns = document.querySelectorAll(".cat-nav-btn");

/* Click - smooth scroll to target chapter using Lenis */
catNavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        lenis.scrollTo(targetEl, {
            offset: -80,
            duration: 1.2
        });
    });
});

/* Scroll spy - highlight active chapter as user scrolls */
const chapters = ["chapter-dresses", "chapter-tops", "chapter-bottoms",
    "chapter-outerwear", "chapter-lookbook"];

chapters.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveCatNav(id),
        onEnterBack: () => setActiveCatNav(id),
    });
});

function setActiveCatNav(activeId) {
    catNavBtns.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-target") === activeId);
    });
}

/* Category nav entrance */
gsap.from("#category-nav", {
    scrollTrigger: {
        trigger: "#category-nav",
        start: "top 95%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: -10,
    duration: 0.6,
    ease: "power2.out"
});

/* CHAPTER 01 - DRESSES ANIMATIONS */

/* Header */
gsap.set("[data-dr-header]", { opacity: 0, y: 30 });
gsap.to("[data-dr-header]", {
    scrollTrigger: {
        trigger: "#chapter-dresses",
        start: "top 78%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
});

/* Cards fade + rise in with stagger */
gsap.set("[data-dr-card]", { opacity: 0, y: 40 });
gsap.to("[data-dr-card]", {
    scrollTrigger: {
        trigger: "#chapter-dresses",
        start: "top 65%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: "power3.out"
});

/* CTA */
gsap.set("[data-dr-cta]", { opacity: 0, y: 20 });
gsap.to("[data-dr-cta]", {
    scrollTrigger: {
        trigger: "[data-dr-cta]",
        start: "top 90%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out"
});

/* CHAPTER 02 - TOPS ANIMATIONS */

/* Header */
gsap.set("[data-wtop-header]", { opacity: 0, y: 30 });
gsap.to("[data-wtop-header]", {
    scrollTrigger: {
        trigger: "#chapter-tops",
        start: "top 78%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
});

/* Each row - image and text slide in from opposite directions, direction alternates automatically based on row index */
const womenTopsRows = document.querySelectorAll("[data-wtop-row]");

womenTopsRows.forEach((row, i) => {
    const img = row.querySelector("[data-wtop-img]");
    const text = row.querySelector("[data-wtop-text]");
    const isEven = i % 2 === 0;

    gsap.set(img, { opacity: 0, x: isEven ? -60 : 60 });
    gsap.set(text, { opacity: 0, x: isEven ? 60 : -60 });

    gsap.to(img, {
        scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
        },
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out"
    });

    gsap.to(text, {
        scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
        },
        opacity: 1,
        x: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out"
    });
});

/* CTA */
gsap.set("[data-wtop-cta]", { opacity: 0, y: 20 });
gsap.to("[data-wtop-cta]", {
    scrollTrigger: {
        trigger: "[data-wtop-cta]",
        start: "top 90%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out"
});

/* CHAPTER 03 - BOTTOMS ANIMATIONS */

/* Header */
gsap.set("[data-wbot-header]", { opacity: 0, y: 30 });
gsap.to("[data-wbot-header]", {
    scrollTrigger: {
        trigger: "#chapter-bottoms",
        start: "top 78%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
});

/* Circle cards pop in with a subtle scale + stagger */
gsap.set("[data-wbot-card]", { opacity: 0, scale: 0.85, y: 20 });
gsap.to("[data-wbot-card]", {
    scrollTrigger: {
        trigger: "#chapter-bottoms",
        start: "top 70%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "back.out(1.4)"
});

/* CTA */
gsap.set("[data-wbot-cta]", { opacity: 0, y: 20 });
gsap.to("[data-wbot-cta]", {
    scrollTrigger: {
        trigger: "[data-wbot-cta]",
        start: "top 90%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out"
});

/* CHAPTER 04 - OUTERWEAR ANIMATIONS */

/* Header */
gsap.set("[data-wow-header]", { opacity: 0, y: 30 });
gsap.to("[data-wow-header]", {
    scrollTrigger: {
        trigger: "#chapter-outerwear",
        start: "top 78%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
});

/* Each row - image and text slide in from opposite directions */
const womenOuterwearRows = document.querySelectorAll("[data-wow-row]");

womenOuterwearRows.forEach((row, i) => {
    const img = row.querySelector("[data-wow-img]");
    const text = row.querySelector("[data-wow-text]");
    const isEven = i % 2 === 0;

    gsap.set(img, { opacity: 0, x: isEven ? -60 : 60 });
    gsap.set(text, { opacity: 0, x: isEven ? 60 : -60 });

    gsap.to(img, {
        scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
        },
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out"
    });

    gsap.to(text, {
        scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
        },
        opacity: 1,
        x: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out"
    });
});

/* CTA */
gsap.set("[data-wow-cta]", { opacity: 0, y: 20 });
gsap.to("[data-wow-cta]", {
    scrollTrigger: {
        trigger: "[data-wow-cta]",
        start: "top 90%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out"
});