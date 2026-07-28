gsap.registerPlugin(ScrollTrigger);

/* Lenis */
const lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);


/* Detect touch device */
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

/* HERO ANIMATIONS */

gsap.set(["[data-bh-crumb]", "[data-bh-heading]", "[data-bh-sub]"], { opacity: 0, y: 20 });

const brandsHeroTL = gsap.timeline({ delay: 0.5 });
brandsHeroTL
    .to("[data-bh-crumb]", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
    .to("[data-bh-heading]", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.2")
    .to("[data-bh-sub]", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

gsap.from("#nav", { y: -20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

/* BRAND SPOTLIGHT ANIMATIONS */

gsap.set(["[data-bs-label]", "[data-bs-title]", "[data-bs-quote]", "[data-bs-btn]"],
    { opacity: 0, y: 30 });

gsap.timeline({
    scrollTrigger: {
        trigger: "#brand-spotlight",
        start: "top 75%",
        toggleActions: "play none none none",
        once: true
    }
})
    .to("[data-bs-label]", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
    .to("[data-bs-title]", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.3")
    .to("[data-bs-quote]", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
    .to("[data-bs-btn]", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

/* ALL BRANDS - DATA, RENDER, FILTER, SEARCH */

/* Brand Data */
const brandData = [
    { id: 1, name: "SUPREME", tag: "Streetwear", cat: "streetwear", since: "1994", img: "images/supreme.jfif" },
    { id: 2, name: "OFF—WHITE", tag: "Luxury Street", cat: "luxury", since: "2012", img: "images/off-white.jfif" },
    { id: 3, name: "ESSENTIALS", tag: "Fear of God", cat: "luxury", since: "2013", img: "images/essentials.jfif" },
    { id: 4, name: "KITH", tag: "Lifestyle", cat: "streetwear", since: "2011", img: "images/kith.jfif" },
    { id: 5, name: "PALACE", tag: "Skate & Street", cat: "skate", since: "2009", img: "images/palace.jfif" },
    { id: 6, name: "STÜSSY", tag: "Classic Street", cat: "streetwear", since: "1980", img: "images/stussy.jfif" },
    { id: 7, name: "A-COLD-WALL", tag: "Avant-Garde", cat: "avant-garde", since: "2015", img: "images/cold-wall.jfif" },
    { id: 8, name: "REPRESENT", tag: "Premium UK", cat: "luxury", since: "2013", img: "images/represent.jfif" },
    { id: 9, name: "THRASHER", tag: "Skate Culture", cat: "skate", since: "1981", img: "images/thrasher.jfif" },
    { id: 10, name: "RICK OWENS", tag: "Avant-Garde", cat: "avant-garde", since: "1994", img: "images/rickowens.jfif" },
    { id: 11, name: "CARSICKO", tag: "Modern UK", cat: "streetwear", since: "2020", img: "images/carisko.jfif" },
    { id: 12, name: "AMIRI", tag: "Luxury", cat: "luxury", since: "2014", img: "images/amiri.jfif" },
];

let brandCurrentFilter = "all";
let brandSearchTerm = "";

const brandsGrid = document.getElementById("brands-grid");
const brandResultsCount = document.getElementById("brand-results-count");
const brandNoResults = document.getElementById("brand-no-results");

/* Build a single brand cell */
function buildBrandCell(brand) {
    return `
    <a href="shop.html?brand=${brand.name.toLowerCase().replace(/[^a-z]/g, '')}"
       class="brand-cell group flex flex-col items-center justify-center
              py-16 px-6 min-h-[260px] relative overflow-hidden hover:bg-[#111111]
              transition-colors duration-400">
      <img src="${brand.img}" alt="${brand.name}"
           class="absolute inset-0 w-full h-full object-cover
                  opacity-40 group-hover:opacity-55 group-hover:scale-105
                  transition-all duration-500" />
      <div class="absolute inset-0 bg-gradient-to-t
                  from-black/70 via-black/40 to-black/55"></div>
      <div class="brand-cell-glow"></div>
      <span class="font-heading text-3xl tracking-[0.12em] text-[#888880]
                   group-hover:text-[#f5f5f0] transition-colors duration-300 relative z-10">
        ${brand.name}
      </span>
      <span class="text-[#c9a84c]/0 group-hover:text-[#c9a84c]/60 text-[0.5rem]
                   tracking-[0.25em] uppercase font-body mt-2
                   transition-colors duration-300 relative z-10">
        ${brand.tag} · Est. ${brand.since}
      </span>
    </a>
  `;
}

/* Filter + search combined */
function getFilteredBrands() {
    return brandData.filter(b => {
        const matchesCat = brandCurrentFilter === "all" || b.cat === brandCurrentFilter;
        const matchesSearch = b.name.toLowerCase().includes(brandSearchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });
}

/* Render grid */
function renderBrandsGrid(animate = true) {
    const list = getFilteredBrands();

    if (list.length === 0) {
        brandsGrid.innerHTML = "";
        brandsGrid.classList.add("hidden");
        brandNoResults.classList.remove("hidden");
    } else {
        brandsGrid.classList.remove("hidden");
        brandNoResults.classList.add("hidden");
        brandsGrid.innerHTML = list.map(buildBrandCell).join("");
    }

    brandResultsCount.textContent = `Showing ${list.length} of ${brandData.length} brands`;

    if (animate) {
        gsap.from(".brand-cell", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.04,
            ease: "power3.out"
        });
    }
}

/* Filter pill clicks */
document.querySelectorAll("#brand-category-pills .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
        document.querySelectorAll("#brand-category-pills .filter-pill")
            .forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        brandCurrentFilter = pill.getAttribute("data-cat");
        renderBrandsGrid();
    });
});

/* Search input */
const brandSearchInput = document.getElementById("brand-search");
let brandSearchDebounce;

brandSearchInput.addEventListener("input", (e) => {
    clearTimeout(brandSearchDebounce);
    brandSearchDebounce = setTimeout(() => {
        brandSearchTerm = e.target.value.trim();
        renderBrandsGrid();
    }, 200);
});

/* Initial render */
renderBrandsGrid(false);

/* Scroll entrance for header/filterbar */
gsap.set("[data-ab-header]", { opacity: 0, y: 30 });
gsap.to("[data-ab-header]", {
    scrollTrigger: {
        trigger: "#all-brands",
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
});

gsap.set("[data-ab-filterbar]", { opacity: 0, y: 20 });
gsap.to("[data-ab-filterbar]", {
    scrollTrigger: {
        trigger: "#all-brands",
        start: "top 72%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power3.out"
});

gsap.from(".brand-cell", {
    scrollTrigger: {
        trigger: "#brands-grid",
        start: "top 78%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.05,
    ease: "power3.out"
});