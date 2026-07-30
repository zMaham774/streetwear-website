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