import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

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
const cdBarEl = document.getElementById("countdown-bar");
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

    let navHidden = false;
    if (current > 120) {
        navHidden = current > lastScroll;
        nav.style.transform = navHidden ? "translateY(-100%)" : "translateY(0)";
    } else {
        nav.style.transform = "translateY(0)";
    }

    if (cdBarEl) {
        cdBarEl.style.top = navHidden ? "0px" : "68px";
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

/* SALE HERO - CONTENT ANIMATIONS */

gsap.set(["[data-sh-label]", "[data-sh-sub]", "[data-sh-btn]"], { opacity: 0 });
gsap.set("[data-sh-title]", { y: "100%", opacity: 0 });

const saleHeroTL = gsap.timeline({ delay: 0.4 });

saleHeroTL
    .to("[data-sh-label]", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
    .to("[data-sh-title]", { y: "0%", opacity: 1, duration: 1, ease: "power4.out" }, "-=0.1")
    .to("[data-sh-sub]", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")
    .to("[data-sh-btn]", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2");

gsap.from("#nav", { y: -20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

/*  3D HERO */

if (!isTouchDevice) {

    /* DESKTOP: Three.js scene */

    const canvas = document.getElementById("sale-canvas");
    const heroSection = document.getElementById("sale-hero");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false      // bloom softens edges anyway
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* Post-processing */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    /* Bloom's internal blur buffer is rendered at half resolution  */
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
        0.9,   // strength
        0.45,  // radius
        0.28   // threshold 
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    /* Lighting */
    const ambientLight = new THREE.AmbientLight(0x2a2a2a, 1.1);
    scene.add(ambientLight);

    const goldSpot = new THREE.SpotLight(0xc9a84c, 12, 40, Math.PI / 6, 0.45, 1.4);
    goldSpot.position.set(4, 6, 8);
    goldSpot.target.position.set(0, 0, 0);
    scene.add(goldSpot);
    scene.add(goldSpot.target);

    const rimLight = new THREE.PointLight(0xf5f5f0, 1.6, 30);
    rimLight.position.set(-6, -3, 6);
    scene.add(rimLight);

    /* Materials */

    /* Glossy dark/gold material for the extruded "50%" */
    const textMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x14110a,
        metalness: 0.9,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.38,
        transparent: true,
        opacity: 0,
    });

    /* Subtler dark metallic material for the small floating accent shapes */
    const shapeMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.7,
        roughness: 0.35,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.08,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
    });

    /* Group holds all floating shapes - tilts as one on mouse move */
    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    const shapes = [];

    /* Shape 1 - Torus */
    const torusGeo = new THREE.TorusGeometry(1.6, 0.38, 24, 64);
    const torus = new THREE.Mesh(torusGeo, shapeMaterial);
    torus.position.set(-6.2, 2, -3.5);
    shapeGroup.add(torus);
    shapes.push({ mesh: torus, speed: 0.3, floatSpeed: 0.6, floatRange: 0.4 });

    /* Wireframe overlay on torus for extra dimension */
    const torusWire = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.4, 12, 48), wireMaterial);
    torusWire.position.copy(torus.position);
    shapeGroup.add(torusWire);
    shapes.push({ mesh: torusWire, speed: 0.3, floatSpeed: 0.6, floatRange: 0.4, syncWith: torus });

    /* Shape 2 - Icosahedron */
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const ico = new THREE.Mesh(icoGeo, shapeMaterial);
    ico.position.set(6.5, -2, -3);
    shapeGroup.add(ico);
    shapes.push({ mesh: ico, speed: 0.45, floatSpeed: 0.8, floatRange: 0.5 });

    /* Shape 3 - Octahedron (smaller accent, foreground) */
    const octaGeo = new THREE.OctahedronGeometry(0.9, 0);
    const octa = new THREE.Mesh(octaGeo, shapeMaterial);
    octa.position.set(1.5, 4.4, -1.5);
    shapeGroup.add(octa);
    shapes.push({ mesh: octa, speed: 0.55, floatSpeed: 1, floatRange: 0.3 });

    /* Shape 4 - Cross (built from an extruded plus-shaped outline) */
    function makeCrossShape(arm = 0.9, width = 0.35) {
        const s = new THREE.Shape();
        const a = width / 2, l = arm;
        s.moveTo(-a, -l); s.lineTo(a, -l); s.lineTo(a, -a); s.lineTo(l, -a);
        s.lineTo(l, a); s.lineTo(a, a); s.lineTo(a, l); s.lineTo(-a, l);
        s.lineTo(-a, a); s.lineTo(-l, a); s.lineTo(-l, -a); s.lineTo(-a, -a);
        s.closePath();
        return s;
    }
    const crossGeo = new THREE.ExtrudeGeometry(makeCrossShape(), {
        depth: 0.35, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3
    });
    crossGeo.center();
    const cross = new THREE.Mesh(crossGeo, shapeMaterial);
    cross.position.set(-6.8, -3.2, -2);
    shapeGroup.add(cross);
    shapes.push({ mesh: cross, speed: 0.4, floatSpeed: 0.7, floatRange: 0.35 });

    /* Shape 5 - Sphere */
    const sphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const sphere = new THREE.Mesh(sphereGeo, shapeMaterial);
    sphere.position.set(7, 3, -3);
    shapeGroup.add(sphere);
    shapes.push({ mesh: sphere, speed: 0.5, floatSpeed: 0.9, floatRange: 0.3 });

    /* The 3D extruded "50%" */
    let textMesh = null;

    new FontLoader().load(
        "https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json",
        (font) => {
            const textGeo = new TextGeometry("50%", {
                font,
                size: 3.2,
                height: 0.9,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.035,
                bevelSegments: 5,
            });
            textGeo.center();

            textMesh = new THREE.Mesh(textGeo, textMaterial);
            textMesh.position.set(0, -6, 0); // starts below, rises in on load
            shapeGroup.add(textMesh);

            /* GSAP intro - "50%" rises from below while it fades in */
            gsap.to(textMesh.position, {
                y: 0,
                duration: 1.4,
                delay: 0.1,
                ease: "power4.out"
            });
            gsap.to(textMaterial, {
                opacity: 1,
                duration: 1.1,
                delay: 0.15,
                ease: "power2.out"
            });
        }
    );

    /* Handle resize */
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        if (composer.setPixelRatio) {
            composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }
    });

    /* Mouse-move parallax tilt - subtle 2-3° tilt toward cursor */
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    const MAX_TILT_Y = 3 * (Math.PI / 180); // ~3°
    const MAX_TILT_X = 2 * (Math.PI / 180); // ~2°

    heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotY = mouseX * MAX_TILT_Y;
        targetRotX = mouseY * MAX_TILT_X;
    });

    heroSection.addEventListener("mouseleave", () => {
        targetRotX = 0;
        targetRotY = 0;
    });

    /* Animation loop */
    const clock = new THREE.Clock();
    let animId = null;
    let heroInView = true;

    function animate() {
        const elapsed = clock.getElapsedTime();

        /* Smooth group tilt toward cursor */
        shapeGroup.rotation.y += (targetRotY - shapeGroup.rotation.y) * 0.05;
        shapeGroup.rotation.x += (targetRotX - shapeGroup.rotation.x) * 0.05;

        /* Each shape self-rotates + gently floats */
        shapes.forEach(s => {
            s.mesh.rotation.x += 0.002 * s.speed;
            s.mesh.rotation.y += 0.003 * s.speed;

            if (!s.syncWith) {
                s.mesh.position.y += Math.sin(elapsed * s.floatSpeed) * 0.002;
            } else {
                // wireframe overlay mirrors its paired solid shape's rotation
                s.mesh.rotation.copy(s.syncWith.rotation);
            }
        });

        /* "50%" gently self-rotates + floats too, once it exists */
        if (textMesh) {
            textMesh.rotation.y = Math.sin(elapsed * 0.3) * 0.05;
            textMesh.position.y += Math.sin(elapsed * 0.5) * 0.0015;
        }

        composer.render();
        animId = requestAnimationFrame(animate);
    }

    function startLoop() {
        if (animId === null && heroInView && !document.hidden) {
            animate();
        }
    }

    function stopLoop() {
        if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    animate();

    /* Pause render loop when tab is hidden */
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopLoop();
        } else {
            startLoop();
        }
    });

    /* Pause render loop once the hero scrolls out of view */
    const heroObserver = new IntersectionObserver(
        (entries) => {
            heroInView = entries[0].isIntersecting;
            if (heroInView) {
                startLoop();
            } else {
                stopLoop();
            }
        },
        { threshold: 0 }
    );
    heroObserver.observe(heroSection);

} else {

    /* MOBILE/TOUCH FALLBACK */

    gsap.to(".sale-badge-2d", {
        y: "-=20",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.4
    });

    gsap.to(".sale-badge-2d", {
        rotation: 8,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5
    });

}

/* COUNTDOWN TIMER BAR */

const cdBar = document.querySelector("[data-cd-bar]");

if (cdBar) {
    const cdEls = {
        label: document.getElementById("countdown-label"),
        days: document.getElementById("cd-days"),
        hours: document.getElementById("cd-hours"),
        mins: document.getElementById("cd-mins"),
        secs: document.getElementById("cd-secs"),
    };

    /* Fixed target */
    const SALE_END = new Date("2026-08-05T23:59:59").getTime();

    const pad = n => String(Math.max(n, 0)).padStart(2, "0");
    let countdownInterval = null;

    function tickCountdown() {
        const diff = SALE_END - Date.now();

        if (diff <= 0) {
            cdEls.days.textContent = "00";
            cdEls.hours.textContent = "00";
            cdEls.mins.textContent = "00";
            cdEls.secs.textContent = "00";
            if (cdEls.label) cdEls.label.textContent = "Sale Has Ended";
            if (countdownInterval) clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        cdEls.days.textContent = pad(days);
        cdEls.hours.textContent = pad(hours);
        cdEls.mins.textContent = pad(mins);
        cdEls.secs.textContent = pad(secs);
    }

    tickCountdown();
    countdownInterval = setInterval(tickCountdown, 1000);

    /* Subtle entrance to match the rest of the page animated feel */
    gsap.from(cdBar, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.9,
        ease: "power3.out"
    });
}

/* SALE CATEGORIES STRIP */

let saleDiscountFilter = "all";

const saleCategoryPills = document.querySelectorAll("#sale-category-pills .filter-pill");

saleCategoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
        saleCategoryPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        saleDiscountFilter = pill.getAttribute("data-discount");
        saleVisibleCount = 12;
        renderSaleGrid();
    });
});

/* SALE PRODUCTS GRID */

const saleProductData = [
    { id: 1, name: "Oversized Hoodie — Black", category: "men", price: 5950, oldPrice: 8500, discount: 30, clearance: false, img: "images/F1.jfif" },
    { id: 2, name: "Cargo Jacket — Olive", category: "men", price: 9800, oldPrice: 14000, discount: 30, clearance: false, img: "images/F2.jfif" },
    { id: 3, name: "Street Runner — White/Gold", category: "men", price: 9250, oldPrice: 18500, discount: 50, clearance: false, img: "images/brands.jfif" },
    { id: 4, name: "Tapered Track Pants — Grey", category: "men", price: 2750, oldPrice: 5500, discount: 50, clearance: true, img: "images/P4.jfif" },
    { id: 5, name: "Silk Slip Dress — Ivory", category: "women", price: 8400, oldPrice: 12000, discount: 30, clearance: false, img: "images/P5.jfif" },
    { id: 6, name: "Cropped Bomber — Black", category: "women", price: 7750, oldPrice: 15500, discount: 50, clearance: false, img: "images/P6.jfif" },
    { id: 7, name: "Wide Leg Trousers — Cream", category: "women", price: 1950, oldPrice: 6500, discount: 70, clearance: true, img: "images/P7.jfif" },
    { id: 8, name: "Kids Graphic Tee — Navy", category: "kids", price: 2240, oldPrice: 3200, discount: 30, clearance: false, img: "images/P8.jfif" },
    { id: 9, name: "Kids Cargo Shorts — Beige", category: "kids", price: 1960, oldPrice: 2800, discount: 30, clearance: false, img: "images/P9.jfif" },
    { id: 10, name: "Chain Necklace Set — Silver", category: "accessories", price: 2250, oldPrice: 4500, discount: 50, clearance: false, img: "images/P10.jfif" },
    { id: 11, name: "Bucket Hat — Black", category: "accessories", price: 960, oldPrice: 3200, discount: 70, clearance: true, img: "images/P11.jfif" },
    { id: 12, name: "Utility Vest — Charcoal", category: "men", price: 6300, oldPrice: 9000, discount: 30, clearance: false, img: "images/P12.jfif" },
    { id: 13, name: "Premium Hoodie Set — Grey", category: "men", price: 8250, oldPrice: 16500, discount: 50, clearance: false, img: "images/P13.jfif" },
    { id: 14, name: "Satin Skirt — Emerald", category: "women", price: 5460, oldPrice: 7800, discount: 30, clearance: false, img: "images/P14.jfif" },
    { id: 15, name: "Kids Puffer Jacket — Red", category: "kids", price: 1860, oldPrice: 6200, discount: 70, clearance: true, img: "images/P15.jfif" },
    { id: 16, name: "Leather Belt — Brown", category: "accessories", price: 1750, oldPrice: 2500, discount: 30, clearance: false, img: "images/P16.jfif" },
    { id: 17, name: "Denim Jacket — Washed Blue", category: "men", price: 5500, oldPrice: 11000, discount: 50, clearance: false, img: "images/P17.jfif" },
    { id: 18, name: "Knit Sweater — Cream", category: "women", price: 6230, oldPrice: 8900, discount: 30, clearance: false, img: "images/P18.jfif" },
    { id: 19, name: "Kids Sneakers — White", category: "kids", price: 2750, oldPrice: 5500, discount: 50, clearance: false, img: "images/P19.jfif" },
    { id: 20, name: "Crossbody Bag — Black", category: "accessories", price: 2040, oldPrice: 6800, discount: 70, clearance: true, img: "images/P20.jfif" },
    { id: 21, name: "Windbreaker — Navy", category: "men", price: 5250, oldPrice: 10500, discount: 50, clearance: false, img: "images/P21.jfif" },
    { id: 22, name: "Pleated Trousers — Black", category: "women", price: 6440, oldPrice: 9200, discount: 30, clearance: false, img: "images/P22.jfif" },
    { id: 23, name: "Kids Hoodie Set — Grey", category: "kids", price: 2400, oldPrice: 4800, discount: 50, clearance: false, img: "images/P23.jfif" },
    { id: 24, name: "Beanie — Charcoal", category: "accessories", price: 900, oldPrice: 1800, discount: 50, clearance: false, img: "images/P24.jfif" },
];

const saleGridEl = document.getElementById("product-grid");
let saleSort = "newest";
let saleVisibleCount = 12;

/* Build a single sale product card — same shop-card markup/classes as Shop All */
function buildSaleCard(p) {
    const badgeHTML = p.clearance
        ? `<span class="absolute top-3 left-3 z-10 bg-red-900/80 text-[#f5f5f0]
         text-[0.48rem] font-bold tracking-[0.15em] uppercase px-2 py-1">
         Clearance
       </span>`
        : `<span class="absolute top-3 left-3 z-10 bg-[#c9a84c] text-[#0a0a0a]
         text-[0.48rem] font-bold tracking-[0.15em] uppercase px-2 py-1">
         -${p.discount}%
       </span>`;

    return `
    <div class="shop-card group relative" data-category="${p.category}" data-id="${p.id}">
      <div class="relative overflow-hidden bg-[#111111] aspect-[3/4] mb-3 shop-card-img">
        ${badgeHTML}
        <img src="${p.img}" alt="${p.name}"
             class="w-full h-full object-cover object-top
                    transition-transform duration-700 ease-out
                    group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity duration-400 flex items-end justify-center pb-4">
          <button class="quick-add-btn bg-[#f5f5f0] text-[#0a0a0a] text-[0.55rem] font-bold
                         tracking-[0.15em] uppercase px-4 py-2
                         translate-y-3 group-hover:translate-y-0
                         transition-transform duration-350
                         hover:bg-[#c9a84c]"
                  data-id="sale-${p.id}" data-name="${p.name}"
                  data-price="${p.price}" data-img="${p.img}">
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
          <span class="text-[#f5f5f0] text-xs font-semibold font-body">Rs. ${p.price.toLocaleString()}</span>
          <span class="text-[#888880] text-[0.65rem] line-through font-body">Rs. ${p.oldPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
}

/* Filter (by section 03's discount tier) + sort */
function getFilteredSaleProducts() {
    let list = [...saleProductData];

    if (saleDiscountFilter === "clearance") {
        list = list.filter(p => p.clearance);
    } else if (saleDiscountFilter !== "all") {
        const tier = parseInt(saleDiscountFilter, 10);
        list = list.filter(p => p.discount <= tier);
    }

    switch (saleSort) {
        case "price-low": list.sort((a, b) => a.price - b.price); break;
        case "price-high": list.sort((a, b) => b.price - a.price); break;
        case "discount-high": list.sort((a, b) => b.discount - a.discount); break;
        default: list.sort((a, b) => b.id - a.id); // newest = highest id first
    }

    return list;
}

/* Render grid */
function renderSaleGrid(animate = true) {
    const list = getFilteredSaleProducts();
    const visible = list.slice(0, saleVisibleCount);

    const noResultsEl = document.getElementById("sale-no-results");

    if (visible.length === 0) {
        saleGridEl.innerHTML = "";
        noResultsEl.classList.remove("hidden");
    } else {
        noResultsEl.classList.add("hidden");
        saleGridEl.innerHTML = visible.map(buildSaleCard).join("");
    }

    document.getElementById("results-count").textContent =
        `Showing 1–${visible.length} of ${list.length}`;

    const loadMoreWrap = document.querySelector("[data-load-more-wrap]");
    loadMoreWrap.style.display = saleVisibleCount >= list.length ? "none" : "flex";

    if (animate) {
        gsap.from("#product-grid .shop-card", {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out"
        });
    }
}

/* Sort dropdown */
document.getElementById("sort-select").addEventListener("change", (e) => {
    saleSort = e.target.value;
    saleVisibleCount = 12;
    renderSaleGrid();
});

/* Grid/List view toggle */
const saleViewGridBtn = document.getElementById("view-grid");
const saleViewListBtn = document.getElementById("view-list");

saleViewGridBtn.addEventListener("click", () => {
    saleGridEl.classList.remove("list-view");
    saleViewGridBtn.classList.add("active");
    saleViewListBtn.classList.remove("active");
});

saleViewListBtn.addEventListener("click", () => {
    saleGridEl.classList.add("list-view");
    saleViewListBtn.classList.add("active");
    saleViewGridBtn.classList.remove("active");
});

/* Load more */
document.getElementById("load-more-btn").addEventListener("click", () => {
    saleVisibleCount += 8;
    renderSaleGrid(false);

    // Only animate the newly added cards
    const cards = document.querySelectorAll("#product-grid .shop-card");
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
renderSaleGrid(false);

gsap.from("#product-grid .shop-card", {
    scrollTrigger: {
        trigger: "#sale-products",
        start: "top 80%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.05,
    ease: "power3.out"
});

/* CTA entrance */

gsap.from("[data-cta-content]", {
    scrollTrigger: {
        trigger: "#sale-cta",
        start: "top 75%",
        toggleActions: "play none none none",
        once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
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