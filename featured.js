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