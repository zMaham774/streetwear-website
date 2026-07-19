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

/* Custom Cursor */
const dot = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");
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

/*  Account icon desktop only  */
if (window.innerWidth >= 768) {
    document.getElementById("acc-btn").style.display = "flex";
}

/*─ Navbar scroll  */
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

/*  Full screen menu */
const menuImages = {
    home: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&q=80",
    men: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&q=80",
    women: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80",
    kids: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&q=80",
    brands: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80",
    featured: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    sale: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80",
    shop: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    about: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&q=80",
    contact: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80",
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

/* SHOP HERO ANIMATIONS */

gsap.set(["[data-sh-crumb]", "[data-sh-heading]", "[data-sh-sub]"], { opacity: 0, y: 20 });

const shopHeroTL = gsap.timeline({ delay: 0.5 });
shopHeroTL
    .to("[data-sh-crumb]", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
    .to("[data-sh-heading]", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.2")
    .to("[data-sh-sub]", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

gsap.from("#nav", { y: -20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

/* PROMO SLIDER */

const promoSlides = document.querySelectorAll(".promo-slide");
const promoDots = document.querySelectorAll(".promo-dot");
const promoProgress = document.getElementById("promo-progress");
const promoWrapper = document.querySelector("[data-promo-wrapper]");

let promoIndex = 0;
let promoTimer = null;
let promoPaused = false;
const PROMO_INTERVAL = 5000;

function goToPromoSlide(index) {
    promoSlides[promoIndex].classList.remove("active");
    promoDots[promoIndex].classList.remove("active");

    promoIndex = (index + promoSlides.length) % promoSlides.length;

    promoSlides[promoIndex].classList.add("active");
    promoDots[promoIndex].classList.add("active");

    restartPromoProgress();
}

function nextPromoSlide() {
    goToPromoSlide(promoIndex + 1);
}

function prevPromoSlide() {
    goToPromoSlide(promoIndex - 1);
}

function startPromoTimer() {
    clearInterval(promoTimer);
    promoTimer = setInterval(() => {
        if (!promoPaused) nextPromoSlide();
    }, PROMO_INTERVAL);
}

function restartPromoProgress() {
    promoProgress.style.transition = "none";
    promoProgress.style.width = "0%";
    promoProgress.offsetWidth; // force reflow
    promoProgress.style.transition = `width ${PROMO_INTERVAL}ms linear`;
    promoProgress.style.width = "100%";
}

/* Dot clicks */
promoDots.forEach((dot, i) => {
    dot.addEventListener("click", () => goToPromoSlide(i));
});

/* Arrow clicks */
document.getElementById("promo-next").addEventListener("click", nextPromoSlide);
document.getElementById("promo-prev").addEventListener("click", prevPromoSlide);

/* Pause on hover */
promoWrapper.addEventListener("mouseenter", () => {
    promoPaused = true;
    promoProgress.style.transition = "none";
});
promoWrapper.addEventListener("mouseleave", () => {
    promoPaused = false;
    restartPromoProgress();
});

/* Init */
startPromoTimer();
restartPromoProgress();

/* Fade in slider on scroll */
gsap.from("[data-promo-wrapper]", {
    scrollTrigger: {
        trigger: "#promo-slider",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: "power3.out"
});