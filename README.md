# AUREL - Luxury Streetwear E-Commerce Website

A premium **10-page, fully responsive streetwear e-commerce front-end** built with **HTML5, Tailwind CSS, and Vanilla JavaScript**.

Designed as a portfolio project to demonstrate modern frontend development, responsive UI/UX, advanced animations, browser state management, and performance-conscious interactions without relying on frontend frameworks.

### Live Demo
https://streetwear-website-gamma.vercel.app/

### Source Code
https://github.com/zMaham774/streetwear-website

---

## Features

- Fully responsive design
- 10 pages
- Modern editorial UI inspired by luxury fashion brands
- Hero sliders and immersive landing sections
- GSAP + ScrollTrigger animations
- Lenis smooth scrolling
- Three.js interactive 3D experiences
- Product filtering, searching and sorting
- Persistent shopping cart using localStorage
- Mobile-friendly interaction fallbacks
- Custom cursor and micro-interactions
- Semantic HTML and accessibility-focused structure

---

## Why This Project
 
Most beginner front-end projects stop at a single landing page. AUREL
is a full multi-page storefront, ten distinct pages, each with its own
purpose, its own layout logic, and its own signature interaction,
built to prove out real front-end fundamentals: responsive design,
animation timing, state persistence, and performance-aware code,
all without hiding behind a framework's defaults.
 
---

## Pages & What Each One Demonstrates
 
| Page | Focus | Highlight |
|------|-------|-----------|
| **Home** | Brand-first landing | Hero slider, marquee, asymmetric product grids |
| **About** | Storytelling | Autoplay video hero, animated stat counters, scroll-driven timeline |
| **Men's** | Signature interaction | Cursor-tracked "spotlight" hero, horizontal scroll-jacked gallery, 3D tilt cards |
| **Women's** | Signature interaction | Scroll-driven blur → color image reveal, masonry product grid |
| **Kids** | Signature interaction | Playful bounce-in typography, softened card treatments |
| **Shop All** | E-commerce core | Live filter + sort + search, dynamically rendered product grid |
| **Brands** | Directory UX | Searchable/filterable brand grid, featured-brand spotlight |
| **Sale** | 3D on the web | Three.js-powered interactive hero element |
| **Featured** | Editorial curation | Three.js 3D product model with cursor-driven rotation |
| **Contact** | Functional UI | Working form with validation states, FAQ accordion, map embed |
 
---
 
## Engineering Highlights
 
**Cross-page shopping cart with zero backend**
A single `cart.js`, shared across all ten static HTML pages, persists
cart state via `localStorage`. Adding an item on the Shop page and
navigating to Home shows the same cart, no server, no framework state
management, just a clear understanding of browser storage and event
delegation.
 
**Every interactive effect has a real mobile fallback**
Cursor-tracked effects (spotlight hero, 3D tilt cards) don't just
"turn off" on touch devices they're replaced with intentional,
tested alternatives (static brightness treatments, tap states,
native swipe/scroll-snap galleries) so mobile never feels like an
afterthought.
 
**3D on a static site**
Two pages integrate Three.js for interactive 3D product visualization,
loaded via CDN with no bundler including scene cleanup and
render-loop pausing when off-screen to keep performance in check.
 
**Animation system built on GSAP + ScrollTrigger + Lenis**
Scroll-linked reveals, pinned horizontal galleries, staggered entrances,
and a custom smooth-scroll cursor all hand-tuned rather than dropped
in from a template.
 
---

## Tech Stack
 
```
HTML5                  Semantic structure across 10 pages
Tailwind CSS           Utility-first styling (CDN, no build step)
Vanilla JavaScript     All interactivity, state, and DOM logic
GSAP + ScrollTrigger   Animation and scroll-driven effects
Lenis                  Smooth scroll
Three.js               3D product visualization
localStorage           Cross-page cart persistence
```
 
---

# Run Locally

Clone the repository

```bash
git clone https://github.com/zMaham774/streetwear-website.git
```

Navigate into the project

```bash
cd streetwear-website
```

Open with **VS Code Live Server** or any static web server.

---

## Libraries & Resources

- Tailwind CSS
- GSAP
- ScrollTrigger
- Lenis
- Three.js
- Lucide Icons

---

## What I Learned

Through this project I strengthened my understanding of:

- Responsive web design
- Semantic HTML
- Component-like architecture using reusable HTML/CSS/JS
- Browser storage with localStorage
- DOM manipulation
- Advanced animations with GSAP
- Interactive 3D graphics using Three.js
- Building scalable multi-page frontend applications

---

## What I'd Do Differently With More Time
 
Being upfront about scope this is a front-end-only project:
- No real backend or checkout/payment flow (by design, the goal was
  front-end depth, not full-stack scope)
- Product data is static per page rather than pulled from a shared
  source of truth
- A framework (React/Vue) would simplify state management and component
  reuse across the 10 pages if this were rebuilt for production
---

## Author

**Maham Zafar**

Computer Science Student • Frontend Developer

- GitHub: https://github.com/zMaham774
- LinkedIn: https://linkedin.com/in/maham-zafar-10b8983a1

---
