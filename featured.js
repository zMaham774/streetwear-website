import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

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

/* HERO - TEXT CONTENT ANIMATIONS */

gsap.set(["[data-fh-label]", "[data-fh-sub]", "[data-fh-btn]"], { opacity: 0, y: 20 });
gsap.set("[data-fh-title]", { y: "100%", opacity: 0 });

const featuredHeroTL = gsap.timeline({ delay: 0.4 });

featuredHeroTL
    .to("[data-fh-label]", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
    .to("[data-fh-title]", { y: "0%", opacity: 1, duration: 1, ease: "power4.out" }, "-=0.2")
    .to("[data-fh-sub]", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
    .to("[data-fh-btn]", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");

gsap.from("#nav", { y: -20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

/* 3D SNEAKER - THREE.JS (desktop) or static PNG (mobile/touch) */

if (!isTouchDevice) {

    /* DESKTOP: Three.js scene */

    const visualEl = document.getElementById("sneaker-visual");
    const canvas = document.getElementById("sneaker-canvas");

    const scene = new THREE.Scene();

    function getSize() {
        return {
            w: visualEl.clientWidth,
            h: visualEl.clientHeight
        };
    }

    let { w: vw, h: vh } = getSize();

    const camera = new THREE.PerspectiveCamera(35, vw / vh, 0.1, 100);
    camera.position.set(0, 0.1, 4.2);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(vw, vh);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    /* A little extra brand-consistent gold rim light on top of the environment lighting */
    const goldRim = new THREE.PointLight(0xc9a84c, 4, 20);
    goldRim.position.set(-3, 2, 3);
    scene.add(goldRim);

    const fillLight = new THREE.PointLight(0xffffff, 1.2, 20);
    fillLight.position.set(3, -1, 2);
    scene.add(fillLight);

    /* Group holds the loaded model */
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let sneakerModel = null;

    /* DRACOLoader is registered defensively */
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
        "models/sneaker.glb",
        (gltf) => {
            sneakerModel = gltf.scene;

            /* Auto-center and auto-scale the model */
            const box = new THREE.Box3().setFromObject(sneakerModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            sneakerModel.position.x -= center.x;
            sneakerModel.position.y -= center.y;
            sneakerModel.position.z -= center.z;

            const maxDimension = Math.max(size.x, size.y, size.z);
            const targetSize = 3.0;
            const scale = targetSize / maxDimension;
            sneakerModel.scale.setScalar(scale);

            /* Slight default rotation */
            sneakerModel.rotation.y = Math.PI * 0.15;

            modelGroup.add(sneakerModel);

            /* GSAP intro - rises from below and fades in once it's loaded */
            modelGroup.position.y = -1.2;
            gsap.to(modelGroup.position, {
                y: 0,
                duration: 1.3,
                delay: 0.2,
                ease: "power4.out"
            });

            sneakerModel.traverse(node => {
                if (node.isMesh && node.material) {
                    node.material.transparent = true;
                    node.material.opacity = 0;
                }
            });
            gsap.to({}, {
                duration: 1.1,
                delay: 0.25,
                onUpdate: function () {
                    const p = this.progress();
                    sneakerModel.traverse(node => {
                        if (node.isMesh && node.material) node.material.opacity = p;
                    });
                },
                onComplete: () => {
                    sneakerModel.traverse(node => {
                        if (node.isMesh && node.material) node.material.transparent = false;
                    });
                }
            });
        },
        undefined,
        (error) => {
            /* If the model fails to load for any reason, fall back to the static image */
            console.error("Sneaker model failed to load:", error);
            canvas.classList.add("hidden");
            const fallbackImg = document.querySelector("[data-fh-fallback-img]");
            if (fallbackImg) fallbackImg.classList.remove("md:hidden");
        }
    );

    /* Resize */
    window.addEventListener("resize", () => {
        const { w, h } = getSize();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    /* Mouse-move parallax tilt */
    let targetRotY = 0, targetRotX = 0;
    const MAX_TILT_Y = 180 * (Math.PI / 180);
    const MAX_TILT_X = 12 * (Math.PI / 180);

    visualEl.addEventListener("mousemove", (e) => {
        const rect = visualEl.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotY = nx * MAX_TILT_Y;
        targetRotX = ny * MAX_TILT_X;
    });

    visualEl.addEventListener("mouseleave", () => {
        targetRotY = 0;
        targetRotX = 0;
    });

    /* Animation loop, paused when off-screen or tab hidden */
    let animId = null;
    let heroInView = true;

    function animate() {
        modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.09;
        modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.09;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
    }

    function startLoop() {
        if (animId === null && heroInView && !document.hidden) animate();
    }

    function stopLoop() {
        if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    animate();

    document.addEventListener("visibilitychange", () => {
        document.hidden ? stopLoop() : startLoop();
    });

    const heroObserver = new IntersectionObserver(
        (entries) => {
            heroInView = entries[0].isIntersecting;
            heroInView ? startLoop() : stopLoop();
        },
        { threshold: 0 }
    );
    heroObserver.observe(visualEl);

} else {

    /* MOBILE/TOUCH: static PNG fallback with a subtle float */

    gsap.to(".sneaker-fallback-img", {
        y: "-=14",
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });

}

/* THIS WEEK'S DROP entrance */

gsap.from("[data-wd-content]", {
    scrollTrigger: {
        trigger: "#weekly-drop",
        start: "top 70%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: "power3.out"
});

/* EDITOR'S PICKS entrance */

gsap.from("[data-ep-header]", {
    scrollTrigger: {
        trigger: "#editors-picks",
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 25,
    duration: 0.7,
    ease: "power3.out"
});

gsap.from("[data-ep-card]", {
    scrollTrigger: {
        trigger: "#editors-picks",
        start: "top 65%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: "power3.out"
});

/* TRENDING NOW */

const trendingProductData = [
    { id: 1, name: "Studio Bomber — Charcoal", category: "men", price: 12000, viewing: 34, img: "images/ed1.png" },
    { id: 2, name: "Wide-Leg Trousers — Ivory", category: "women", price: 9800, viewing: 27, img: "images/P7.jfif" },
    { id: 3, name: "Volt Cap — Reflective", category: "accessories", price: 3200, viewing: 41, img: "images/ed3.png" },
    { id: 4, name: "Kids Track Set — Grey", category: "kids", price: 5500, viewing: 12, img: "images/ed4.png" },
    { id: 5, name: "Cropped Bomber — Black", category: "women", price: 15500, viewing: 19, img: "images/P6.jfif" },
    { id: 6, name: "Street Runner — White/Gold", category: "men", price: 18500, viewing: 52, img: "images/brands.jfif" },
    { id: 7, name: "Silk Slip Dress — Ivory", category: "women", price: 12000, viewing: 23, img: "images/P5.jfif" },
    { id: 8, name: "Tapered Track Pants — Grey", category: "men", price: 5500, viewing: 15, img: "images/P4.jfif" },
    { id: 9, name: "Kids Graphic Tee — Navy", category: "kids", price: 3200, viewing: 9, img: "images/P8.jfif" },
    { id: 10, name: "Chain Necklace Set — Silver", category: "accessories", price: 4500, viewing: 31, img: "images/P10.jfif" },
    { id: 11, name: "Denim Jacket — Washed Blue", category: "men", price: 11000, viewing: 22, img: "images/P17.jfif" },
    { id: 12, name: "Knit Sweater — Cream", category: "women", price: 8900, viewing: 17, img: "images/P18.jfif" },
    { id: 13, name: "Kids Sneakers — White", category: "kids", price: 5500, viewing: 28, img: "images/P19.jfif" },
    { id: 14, name: "Leather Belt — Brown", category: "accessories", price: 2500, viewing: 14, img: "images/P16.jfif" },
    { id: 15, name: "Windbreaker — Navy", category: "men", price: 10500, viewing: 20, img: "images/P21.jfif" },
    { id: 16, name: "Satin Skirt — Emerald", category: "women", price: 7800, viewing: 25, img: "images/P14.jfif" },
    { id: 17, name: "Kids Hoodie Set — Grey", category: "kids", price: 4800, viewing: 11, img: "images/P23.jfif" },
    { id: 18, name: "Beanie — Charcoal", category: "accessories", price: 1800, viewing: 38, img: "images/P24.jfif" },
    { id: 19, name: "Utility Vest — Charcoal", category: "men", price: 9000, viewing: 16, img: "images/P12.jfif" },
    { id: 20, name: "Pleated Trousers — Black", category: "women", price: 9200, viewing: 21, img: "images/P22.jfif" },
];

const trendingGridEl = document.getElementById("product-grid");
let trendingFilter = "all";
let trendingSort = "viewing-high";
let trendingVisibleCount = 12;

function buildTrendingCard(p) {
    return `
    <div class="shop-card group relative" data-category="${p.category}" data-id="${p.id}">
      <div class="relative overflow-hidden bg-[#111111] aspect-[3/4] mb-3 shop-card-img">
        <span class="absolute top-3 left-3 z-10 bg-[#0a0a0a]/70 backdrop-blur-sm
                     text-[#f5f5f0] text-[0.5rem] font-bold tracking-[0.1em]
                     uppercase px-2 py-1 flex items-center gap-1">
          🔥 ${p.viewing} viewing
        </span>
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
        <span class="text-[#f5f5f0] text-xs font-semibold font-body">Rs. ${p.price.toLocaleString()}</span>
      </div>
    </div>
  `;
}

function getFilteredTrending() {
    let list = trendingFilter === "all"
        ? [...trendingProductData]
        : trendingProductData.filter(p => p.category === trendingFilter);

    switch (trendingSort) {
        case "price-low": list.sort((a, b) => a.price - b.price); break;
        case "price-high": list.sort((a, b) => b.price - a.price); break;
        case "newest": list.sort((a, b) => b.id - a.id); break;
        default: list.sort((a, b) => b.viewing - a.viewing); // viewing-high
    }

    return list;
}

function renderTrendingGrid(animate = true) {
    const list = getFilteredTrending();
    const visible = list.slice(0, trendingVisibleCount);

    trendingGridEl.innerHTML = visible.map(buildTrendingCard).join("");

    document.getElementById("results-count").textContent =
        `Showing 1–${visible.length} of ${list.length}`;

    const loadMoreWrap = document.querySelector("#trending [data-load-more-wrap]");
    loadMoreWrap.style.display = trendingVisibleCount >= list.length ? "none" : "flex";

    if (animate) {
        gsap.from("#trending #product-grid .shop-card", {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out"
        });
    }
}

document.querySelectorAll("#trending-category-pills .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
        document.querySelectorAll("#trending-category-pills .filter-pill")
            .forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        trendingFilter = pill.getAttribute("data-category");
        trendingVisibleCount = 12;
        renderTrendingGrid();
    });
});

document.getElementById("sort-select").addEventListener("change", (e) => {
    trendingSort = e.target.value;
    trendingVisibleCount = 12;
    renderTrendingGrid();
});

const trendingViewGridBtn = document.getElementById("view-grid");
const trendingViewListBtn = document.getElementById("view-list");

trendingViewGridBtn.addEventListener("click", () => {
    trendingGridEl.classList.remove("list-view");
    trendingViewGridBtn.classList.add("active");
    trendingViewListBtn.classList.remove("active");
});

trendingViewListBtn.addEventListener("click", () => {
    trendingGridEl.classList.add("list-view");
    trendingViewListBtn.classList.add("active");
    trendingViewGridBtn.classList.remove("active");
});

document.getElementById("load-more-btn").addEventListener("click", () => {
    trendingVisibleCount += 8;
    renderTrendingGrid(false);

    const cards = document.querySelectorAll("#trending #product-grid .shop-card");
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
renderTrendingGrid(false);

gsap.from("[data-tr-header], [data-tr-filter-bar]", {
    scrollTrigger: {
        trigger: "#trending",
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 25,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out"
});

gsap.from("#trending #product-grid .shop-card", {
    scrollTrigger: {
        trigger: "#trending",
        start: "top 60%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.05,
    ease: "power3.out"
});

/* AS SEEN IN entrance */

gsap.from("[data-asi-label]", {
    scrollTrigger: {
        trigger: "#as-seen-in",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 15,
    duration: 0.6,
    ease: "power3.out"
});