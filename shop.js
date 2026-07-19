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


/* Product Data */
const productData = [
    { id: 1, name: "Oversized Hoodie — Black", category: "men", price: 8500, oldPrice: null, tag: "New", img: "images/F1.jfif" },
    { id: 2, name: "Cargo Jacket — Olive", category: "men", price: 14000, oldPrice: null, tag: "Limited", img: "images/F2.jfif" },
    { id: 3, name: "Street Runner — White/Gold", category: "men", price: 18500, oldPrice: null, tag: "Bestseller", img: "images/brands.jfif" },
    { id: 4, name: "Tapered Track Pants — Grey", category: "men", price: 5500, oldPrice: 7500, tag: "Sale", img: "images/P4.jfif" },
    { id: 5, name: "Silk Slip Dress — Ivory", category: "women", price: 12000, oldPrice: null, tag: "New", img: "images/P5.jfif" },
    { id: 6, name: "Cropped Bomber — Black", category: "women", price: 15500, oldPrice: null, tag: "Limited", img: "images/P6.jfif" },
    { id: 7, name: "Wide Leg Trousers — Cream", category: "women", price: 6500, oldPrice: 9000, tag: "Sale", img: "images/P7.jfif" },
    { id: 8, name: "Kids Graphic Tee — Navy", category: "kids", price: 3200, oldPrice: null, tag: "New", img: "images/P8.jfif" },
    { id: 9, name: "Kids Cargo Shorts — Beige", category: "kids", price: 2800, oldPrice: null, tag: null, img: "images/P9.jfif" },
    { id: 10, name: "Chain Necklace Set — Silver", category: "accessories", price: 4500, oldPrice: null, tag: "Bestseller", img: "images/P10.jfif" },
    { id: 11, name: "Bucket Hat — Black", category: "accessories", price: 3200, oldPrice: null, tag: null, img: "images/P11.jfif" },
    { id: 12, name: "Utility Vest — Charcoal", category: "men", price: 9000, oldPrice: null, tag: "Limited", img: "images/P12.jfif" },
    { id: 13, name: "Premium Hoodie Set — Grey", category: "men", price: 16500, oldPrice: null, tag: "New", img: "images/P13.jfif" },
    { id: 14, name: "Satin Skirt — Emerald", category: "women", price: 7800, oldPrice: null, tag: null, img: "images/P14.jfif" },
    { id: 15, name: "Kids Puffer Jacket — Red", category: "kids", price: 6200, oldPrice: 8000, tag: "Sale", img: "images/P15.jfif" },
    { id: 16, name: "Leather Belt — Brown", category: "accessories", price: 2500, oldPrice: null, tag: null, img: "images/P16.jfif" },
    { id: 17, name: "Denim Jacket — Washed Blue", category: "men", price: 11000, oldPrice: null, tag: null, img: "images/P17.jfif" },
    { id: 18, name: "Knit Sweater — Cream", category: "women", price: 8900, oldPrice: null, tag: "New", img: "images/P18.jfif" },
    { id: 19, name: "Kids Sneakers — White", category: "kids", price: 5500, oldPrice: null, tag: "Bestseller", img: "images/P19.jfif" },
    { id: 20, name: "Crossbody Bag — Black", category: "accessories", price: 6800, oldPrice: null, tag: "Limited", img: "images/P20.jfif" },
    { id: 21, name: "Windbreaker — Navy", category: "men", price: 10500, oldPrice: 13000, tag: "Sale", img: "images/P21.jfif" },
    { id: 22, name: "Pleated Trousers — Black", category: "women", price: 9200, oldPrice: null, tag: null, img: "images/P22.jfif" },
    { id: 23, name: "Kids Hoodie Set — Grey", category: "kids", price: 4800, oldPrice: null, tag: "New", img: "images/P23.jfif" },
    { id: 24, name: "Beanie — Charcoal", category: "accessories", price: 1800, oldPrice: null, tag: null, img: "images/P24.jfif" },
];

const TAG_COLORS = {
    "New": "bg-[#c9a84c] text-[#0a0a0a]",
    "Limited": "bg-[#0a0a0a] text-[#c9a84c] border border-[#c9a84c]",
    "Bestseller": "bg-[#1a1a1a] text-[#f5f5f0] border border-white/10",
    "Sale": "bg-red-900/80 text-[#f5f5f0]",
};

const grid = document.getElementById("product-grid");

let currentFilter = "all";
let currentSort = "newest";
let visibleCount = 12;

/* Build a single product card */
function buildCard(p) {
    const tagHTML = p.tag
        ? `<span class="absolute top-3 left-3 z-10 ${TAG_COLORS[p.tag]}
             text-[0.48rem] font-bold tracking-[0.15em] uppercase px-2 py-1">
         ${p.tag}
       </span>`
        : "";

    const priceHTML = p.oldPrice
        ? `<span class="text-[#f5f5f0] text-xs font-semibold font-body">Rs. ${p.price.toLocaleString()}</span>
       <span class="text-[#888880] text-[0.65rem] line-through font-body">Rs. ${p.oldPrice.toLocaleString()}</span>`
        : `<span class="text-[#f5f5f0] text-xs font-semibold font-body">Rs. ${p.price.toLocaleString()}</span>`;

    return `
    <div class="shop-card group relative" data-category="${p.category}" data-id="${p.id}">
      <div class="relative overflow-hidden bg-[#111111] aspect-[3/4] mb-3 shop-card-img">
        ${tagHTML}
        <img src="${p.img}" alt="${p.name}"
             class="w-full h-full object-cover object-top
                    transition-transform duration-700 ease-out
                    group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity duration-400 flex items-end justify-center pb-4">
          <button class="bg-[#f5f5f0] text-[#0a0a0a] text-[0.55rem] font-bold
                         tracking-[0.15em] uppercase px-4 py-2
                         translate-y-3 group-hover:translate-y-0
                         transition-transform duration-350
                         hover:bg-[#c9a84c]">
            Quick Add
          </button>
        </div>
        <button class="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center
                       bg-[#0a0a0a]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100
                       transition-opacity duration-300 hover:bg-[#c9a84c] text-[#f5f5f0]
                       hover:text-[#0a0a0a]">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="px-0.5">
        <p class="text-[#888880] text-[0.55rem] tracking-[0.15em] uppercase font-body mb-1 capitalize">
          ${p.category}
        </p>
        <h3 class="text-[#f5f5f0] text-xs font-semibold font-body mb-1.5 leading-snug
                   group-hover:text-[#c9a84c] transition-colors duration-300">
          ${p.name}
        </h3>
        <div class="flex items-center gap-2">
          ${priceHTML}
        </div>
      </div>
    </div>
  `;
}

/* Get filtered + sorted product list */
function getFilteredProducts() {
    let list = currentFilter === "all"
        ? [...productData]
        : productData.filter(p => p.category === currentFilter);

    switch (currentSort) {
        case "price-low": list.sort((a, b) => a.price - b.price); break;
        case "price-high": list.sort((a, b) => b.price - a.price); break;
        case "popular": list.sort((a, b) => (b.tag === "Bestseller") - (a.tag === "Bestseller")); break;
        default: list.sort((a, b) => b.id - a.id); // newest = highest id first
    }

    return list;
}

/* Render grid */
function renderGrid(animate = true) {
    const list = getFilteredProducts();
    const visible = list.slice(0, visibleCount);

    grid.innerHTML = visible.map(buildCard).join("");

    document.getElementById("results-count").textContent =
        `Showing 1–${visible.length} of ${list.length}`;

    // Show/hide load more button
    const loadMoreWrap = document.querySelector("[data-load-more-wrap]");
    loadMoreWrap.style.display = visibleCount >= list.length ? "none" : "flex";

    if (animate) {
        gsap.from(".shop-card", {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out"
        });
    }
}

/* Filter pill clicks */
document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
        document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentFilter = pill.getAttribute("data-filter");
        visibleCount = 12;
        renderGrid();
    });
});

/* Sort dropdown */
document.getElementById("sort-select").addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderGrid();
});

/* Grid/List view toggle */
const viewGridBtn = document.getElementById("view-grid");
const viewListBtn = document.getElementById("view-list");

viewGridBtn.addEventListener("click", () => {
    grid.classList.remove("list-view");
    viewGridBtn.classList.add("active");
    viewListBtn.classList.remove("active");
});

viewListBtn.addEventListener("click", () => {
    grid.classList.add("list-view");
    viewListBtn.classList.add("active");
    viewGridBtn.classList.remove("active");
});

/* Load more */
document.getElementById("load-more-btn").addEventListener("click", () => {
    visibleCount += 8;
    renderGrid(false);

    // Only animate the newly added cards
    const cards = document.querySelectorAll(".shop-card");
    const newCards = Array.from(cards).slice(-8);
    gsap.from(newCards, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out"
    });
});

/* Initial render */
renderGrid(true);

/* Filter bar entrance */
gsap.from("[data-filter-bar]", {
    scrollTrigger: {
        trigger: "#shop-products",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 20,
    duration: 0.7,
    ease: "power3.out"
});

/* NEWSLETTER ANIMATIONS & FORM HANDLER */

/* Scroll animations */

gsap.from("[data-nl-header]", {
    scrollTrigger: {
        trigger: "#newsletter",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true
    },
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out"
});

gsap.from("[data-nl-heading]", {
    scrollTrigger: {
        trigger: "#newsletter",
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
    },
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out"
});

gsap.from("[data-nl-sub]", {
    scrollTrigger: {
        trigger: "#newsletter",
        start: "top 75%",
        toggleActions: "play none none none",
        once: true
    },
    y: 20,
    opacity: 0,
    duration: 0.7,
    delay: 0.1,
    ease: "power3.out"
});

gsap.from("[data-nl-form]", {
    scrollTrigger: {
        trigger: "#newsletter",
        start: "top 72%",
        toggleActions: "play none none none",
        once: true
    },
    y: 25,
    opacity: 0,
    duration: 0.7,
    delay: 0.15,
    ease: "power3.out"
});

gsap.from("[data-nl-perks]", {
    scrollTrigger: {
        trigger: "[data-nl-perks]",
        start: "top 90%",
        toggleActions: "play none none none",
        once: true
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out"
});

/* Input focus glow line via JS */
const nlEmail = document.getElementById("nl-email");
const nlLine = document.getElementById("nl-input-line");

if (nlEmail && nlLine) {
    nlEmail.addEventListener("focus", () => {
        nlLine.style.width = "100%";
    });
    nlEmail.addEventListener("blur", () => {
        nlLine.style.width = "0%";
    });
}

/*  Form submission handler */
const nlForm = document.getElementById("nl-form");
const nlSuccess = document.getElementById("nl-success");
const nlBtn = document.getElementById("nl-btn");
const nlBtnText = document.getElementById("nl-btn-text");
const nlBtnIcon = document.getElementById("nl-btn-icon");

if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Loading state
        nlBtnText.textContent = "Joining...";
        nlBtnIcon.style.display = "none";
        nlBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {

            // Hide form
            gsap.to(nlForm, {
                opacity: 0,
                y: -10,
                duration: 0.4,
                onComplete: () => {
                    nlForm.style.display = "none";

                    // Show success
                    nlSuccess.classList.remove("hidden");
                    nlSuccess.classList.add("flex");

                    gsap.from(nlSuccess, {
                        opacity: 0,
                        y: 15,
                        duration: 0.5,
                        ease: "power3.out"
                    });
                }
            });

        }, 1200);
    });
}

/* FOOTER ANIMATIONS */

/* Footer columns stagger in */
gsap.from("[data-footer-col]", {
    scrollTrigger: {
        trigger: "#footer",
        start: "top 90%",
        toggleActions: "play none none none",
        once: true
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out"
});

/* Bottom bar fades in */
gsap.from("[data-footer-bottom]", {
    scrollTrigger: {
        trigger: "[data-footer-bottom]",
        start: "top 98%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
});