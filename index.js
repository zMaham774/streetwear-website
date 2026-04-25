
gsap.registerPlugin(ScrollTrigger);

/* LENIS - Smooth Scroll */

const lenis = new Lenis({
  duration: 1.3,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

// Connect Lenis to GSAP ticker
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);


/* CUSTOM CURSOR */

const dot = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");

let mx = 0, my = 0;   // mouse position
let rx = 0, ry = 0;   // ring position 

// Dot follows mouse exactly
window.addEventListener("mousemove", e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});

// Ring follows with lerp-creates smooth lag effect
(function ringLoop() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(ringLoop);
})();

// Ring grows when hovering interactive elements
document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => ring.classList.add("hov"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hov"));
});

// Hide cursor when leaving window
document.addEventListener("mouseleave", () => {
  dot.style.opacity = "0";
  ring.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
  dot.style.opacity = "1";
  ring.style.opacity = "1";
});

/* ACCOUNT ICON-Show on desktop only */

if (window.innerWidth >= 768) {
  document.getElementById("acc-btn").style.display = "flex";
}

/* ── Navbar scroll behavior ── */
let lastScroll = 0;
const nav = document.getElementById("nav");
const anno = document.getElementById("anno-bar");
const ANNO_H = 34;

window.addEventListener("scroll", () => {
  const current = window.scrollY;

  /* Hide announcement bar + stick navbar to top after 40px */
  if (current > 40) {
    nav.classList.add("scrolled");
    anno.style.transform = `translateY(-${ANNO_H}px)`;
    nav.style.top = "0px";
  } else {
    nav.classList.remove("scrolled");
    anno.style.transform = "translateY(0)";
    nav.style.top = `${ANNO_H}px`;
  }

  /* Hide on scroll DOWN — show on scroll UP
     Only trigger after 120px to avoid firing on tiny scrolls */
  if (current > 120) {
    if (current > lastScroll) {
      /* Scrolling DOWN */
      nav.style.transform = "translateY(-100%)";
    } else {
      /* Scrolling UP */
      nav.style.transform = "translateY(0)";
    }
  } else {
    nav.style.transform = "translateY(0)";
  }

  lastScroll = current;
});

/* FULL SCREEN MENU — Preview images & labels */

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

// Change preview image on link hover
document.querySelectorAll("#fs-links a").forEach(link => {
  link.addEventListener("mouseenter", () => {
    const page = link.getAttribute("data-p");
    if (!menuImages[page]) return;

    // Fade out → swap image → fade in
    gsap.to(fsrImg, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        fsrImg.src = menuImages[page];
        fsrTxt.textContent = menuLabels[page].t;
        fsrSub.textContent = menuLabels[page].s;
        gsap.to(fsrImg, { opacity: 1, duration: 0.45 });
      }
    });
  });
});

/* FULL SCREEN MENU */

function openMenu() {
  const menu = document.getElementById("fs-menu");
  const items = document.querySelectorAll("#fs-links li");

  lenis.stop(); // pause smooth scroll while menu is open

  gsap.timeline()
    .set(menu, { display: "flex" })
    .fromTo(menu,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.inOut" }
    )
    .fromTo("#fsl",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      "-=0.2"
    )
    .fromTo("#fsr",
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out" },
      "-=0.35"
    )
    .fromTo(items,
      { y: 45, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.055, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo(["#fs-close", "#fs-bot"],
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      "-=0.2"
    );
}

function closeMenu() {
  const menu = document.getElementById("fs-menu");
  const items = document.querySelectorAll("#fs-links li");

  gsap.timeline()
    .to(items, {
      y: -25, opacity: 0,
      duration: 0.25,
      stagger: 0.04,
      ease: "power3.in"
    })
    .to(menu, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        menu.style.display = "none";
        lenis.start(); // resume smooth scroll
      }
    }, "-=0.1");
}

document.getElementById("ham").addEventListener("click", openMenu);
document.getElementById("fs-close").addEventListener("click", closeMenu);

// Close with ESC key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMenu();
});

/* PAGE LOAD ANIMATIONS */

gsap.from("#anno-bar", {
  y: -20,
  opacity: 0,
  duration: 0.7,
  ease: "power3.out"
});

gsap.from("#nav", {
  y: -20,
  opacity: 0,
  duration: 0.8,
  delay: 0.2,
  ease: "power3.out"
});

/* HERO SECTION ANIMATIONS */

const heroTL = gsap.timeline({ delay: 0.4 });

// 1. Image zooms in subtly
heroTL.from("#hero-img", {
  scale: 1.08,
  duration: 2.2,
  ease: "power2.out"
})

  // 2. Overlay fades in
  .from("#hero-overlay", {
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  }, "<")   // "<" means start at same time as previous

  // 3. Label slides up
  .from("#hero-label", {
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out"
  }, "-=1.4")

  // 4. Each heading line reveals upward — staggered
  .from(["#hero-h1-1", "#hero-h1-2", "#hero-h1-3"], {
    y: "110%",
    duration: 0.9,
    stagger: 0.12,
    ease: "power4.out"
  }, "-=0.5")

  // 5. Subtext fades up
  .from("#hero-sub", {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out"
  }, "-=0.4")

  // 6. Buttons fade up
  .from("#hero-btns", {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.4")

  // 7. Bottom bar fades in
  .from("#hero-bottom", {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.3");


/* Parallax - image moves slower than scroll */
gsap.to("#hero-img", {
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,          // ties animation to scroll position
  },
  y: "25%",              // image shifts down 25% as user scroll
  ease: "none"
});


/* Hero content fades as user scroll away */
gsap.to("#hero-content", {
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "40% top",
    scrub: true,
  },
  y: -60,
  opacity: 0,
  ease: "none"
});

/* MARQUEE SECTION ANIMATION */

// Marquee section fades in when scrolled into view
gsap.from("#marquee-section", {
  scrollTrigger: {
    trigger: "#marquee-section",
    start: "top 90%",
    toggleActions: "play none none none",
    once: true
  },
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power3.out"
});

/* FEATURED COLLECTION ANIMATIONS */

/* Section header slides up */
gsap.from("[data-featured-header]", {
  scrollTrigger: {
    trigger: "#featured",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 50,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out"
});

/* Cards stagger in one by one */
gsap.from("[data-featured-card]", {
  scrollTrigger: {
    trigger: "#featured",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 70,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  ease: "power3.out"
});

/* BRANDS STRIP ANIMATIONS */

/* Header fades in */
gsap.from("[data-brands-header]", {
  scrollTrigger: {
    trigger: "#brands-strip",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

/* Brand grid rows reveal with stagger */
gsap.from("[data-brands-grid]", {
  scrollTrigger: {
    trigger: "#brands-strip",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 40,
  opacity: 0,
  duration: 0.7,
  stagger: 0.15,
  ease: "power3.out"
});

/* SPLIT SECTION ANIMATIONS */

/* Both panels slide in from opposite sides */
gsap.from("[data-split-panel]:nth-child(1)", {
  scrollTrigger: {
    trigger: "#split-section",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  x: -80,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

gsap.from("[data-split-panel]:nth-child(2)", {
  scrollTrigger: {
    trigger: "#split-section",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  x: 80,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

/* NEW ARRIVALS ANIMATIONS */

/* Header slides up */
gsap.from("[data-arrivals-header]", {
  scrollTrigger: {
    trigger: "#new-arrivals",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

/* Cards stagger in */
gsap.from("[data-arrivals-card]", {
  scrollTrigger: {
    trigger: "#new-arrivals",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 50,
  opacity: 0,
  duration: 0.7,
  stagger: 0.1,
  ease: "power3.out"
});

/* CTA button fades in last */
gsap.from("[data-arrivals-cta]", {
  scrollTrigger: {
    trigger: "[data-arrivals-cta]",
    start: "top 90%",
    toggleActions: "play none none none"
  },
  y: 20,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
});

/* BRAND STORY ANIMATIONS */

/* Parallax - image scrolls slower than page */
gsap.to("#story-img", {
  scrollTrigger: {
    trigger: "#brand-story",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
  y: "20%",
  ease: "none"
});

/* Label + quote mark */
gsap.from("[data-story-label]", {
  scrollTrigger: {
    trigger: "#brand-story",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  x: -30,
  opacity: 0,
  duration: 0.7,
  ease: "power3.out"
});

gsap.from("[data-story-quote]", {
  scrollTrigger: {
    trigger: "#brand-story",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  opacity: 0,
  duration: 0.8,
  ease: "power2.out"
});

/* Heading reveals line by line */
gsap.from("[data-story-heading]", {
  scrollTrigger: {
    trigger: "#brand-story",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

/* Body paragraphs */
gsap.from("[data-story-body]", {
  scrollTrigger: {
    trigger: "#brand-story",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

/* Stats count up when visible */
gsap.from("[data-story-stats]", {
  scrollTrigger: {
    trigger: "[data-story-stats]",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  y: 20,
  opacity: 0,
  duration: 0.7,
  ease: "power3.out"
});

/* CTA and right panel */
gsap.from("[data-story-cta]", {
  scrollTrigger: {
    trigger: "[data-story-cta]",
    start: "top 90%",
    toggleActions: "play none none none",
    once: true
  },
  x: -20,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out"
});

gsap.from("[data-story-right]", {
  scrollTrigger: {
    trigger: "#brand-story",
    start: "top 85%",
    toggleActions: "play none none none",
    once: true
  },
  x: 40,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

/* INSTAGRAM GRID ANIMATIONS */

/* Header fades in */
gsap.from("[data-insta-header]", {
  scrollTrigger: {
    trigger: "#insta-grid",
    start: "top 85%",
    toggleActions: "play none none none"
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

/* Photos stagger in */
gsap.from("[data-insta-item]", {
  scrollTrigger: {
    trigger: "#insta-grid",
    start: "top 75%",
    toggleActions: "play none none none"
  },
  scale: 0.92,
  opacity: 0,
  duration: 0.6,
  stagger: 0.08,
  ease: "power3.out"
});

/* Hashtag fades in last */
gsap.from("[data-insta-tag]", {
  scrollTrigger: {
    trigger: "[data-insta-tag]",
    start: "top 95%",
    toggleActions: "play none none none"
  },
  opacity: 0,
  duration: 0.6,
  ease: "power2.out"
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