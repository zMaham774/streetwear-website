gsap.registerPlugin(ScrollTrigger);

/* Lenis */
const lenis = new Lenis({
  duration: 1.3,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);

/* Custom Cursor */
const dot  = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top  = my + "px";
});

(function loop() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(loop);
})();

document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => ring.classList.add("hov"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hov"));
});

/*  Account icon desktop only */
if (window.innerWidth >= 768) {
  document.getElementById("acc-btn").style.display = "flex";
}

/* Navbar scroll */
let lastScroll = 0;
const nav  = document.getElementById("nav");
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
  home:     { t: '"Define Your Street"',    s: "AUREL — 2025 Collection" },
  men:      { t: '"Built for the Streets"', s: "Men's Collection" },
  women:    { t: '"Fierce. Fluid. Free."',  s: "Women's Collection" },
  kids:     { t: '"Little Legends"',        s: "Kids' Collection" },
  brands:   { t: '"Only the Icons"',        s: "Brand Directory" },
  featured: { t: '"This Week\'s Drop"',     s: "Featured Arrivals" },
  sale:     { t: '"Last Chance Prices"',    s: "Sale — Up to 50% Off" },
  shop:     { t: '"The Full Archive"',      s: "Shop All Products" },
  about:    { t: '"Born on the Streets"',   s: "Our Story" },
  contact:  { t: '"Let\'s Talk"',           s: "Get in Touch" },
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
        fsrImg.src         = menuImages[p];
        fsrTxt.textContent = menuLabels[p].t;
        fsrSub.textContent = menuLabels[p].s;
        gsap.to(fsrImg, { opacity: 1, duration: 0.45 });
      }
    });
  });
});

function openMenu() {
  const menu  = document.getElementById("fs-menu");
  const items = document.querySelectorAll("#fs-links li");
  lenis.stop();
  gsap.timeline()
    .set(menu, { display: "flex" })
    .fromTo(menu,   { opacity: 0 },        { opacity: 1, duration: 0.35, ease: "power2.inOut" })
    .fromTo("#fsl", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, "-=0.2")
    .fromTo("#fsr", { opacity: 0 },          { opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.35")
    .fromTo(items,  { y: 45, opacity: 0 },   { y: 0, opacity: 1, duration: 0.45, stagger: 0.055, ease: "power3.out" }, "-=0.3")
    .fromTo(["#fs-close","#fs-bot"], { opacity: 0 }, { opacity: 1, duration: 0.35 }, "-=0.2");
}

function closeMenu() {
  const menu  = document.getElementById("fs-menu");
  const items = document.querySelectorAll("#fs-links li");
  gsap.timeline()
    .to(items, { y: -25, opacity: 0, duration: 0.25, stagger: 0.04, ease: "power3.in" })
    .to(menu,  { opacity: 0, duration: 0.35, ease: "power2.inOut",
      onComplete: () => { menu.style.display = "none"; lenis.start(); }
    }, "-=0.1");
}

document.getElementById("ham").addEventListener("click", openMenu);
document.getElementById("fs-close").addEventListener("click", closeMenu);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

/* ABOUT HERO ANIMATIONS */

/* Page load entrance */
const heroTL = gsap.timeline({ delay: 0.6 });

heroTL
  .to("[data-ah-label]", {
    opacity: 1, y: 0,
    duration: 0.7, ease: "power3.out"
  })
  .fromTo("#ah-h1",
    { y: "110%" },
    { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" },
    "-=0.3"
  )
  .fromTo("#ah-h2",
    { y: "110%" },
    { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" },
    "-=0.65"
  )
  .to("[data-ah-sub]", {
    opacity: 1, y: 0,
    duration: 0.7, ease: "power3.out"
  }, "-=0.4")
  .to("[data-ah-scroll]", {
    opacity: 1,
    duration: 0.5, ease: "power2.out"
  }, "-=0.2");

/* Scroll line animation */
gsap.to("#ah-scroll-line", {
  scaleY: 0,
  transformOrigin: "bottom",
  duration: 1,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true
});

/* Parallax - video moves slower than scroll */
gsap.to("#about-video", {
  scrollTrigger: {
    trigger: "#about-hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  y: "20%",
  ease: "none"
});


/* Navbar entrance */
gsap.from("#nav", {
  y: -20, opacity: 0,
  duration: 0.8, delay: 0.3,
  ease: "power3.out"
});