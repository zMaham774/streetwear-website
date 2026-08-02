const CART_KEY = "aurel_cart";

/* Storage helpers */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

/* Add an item to the cart */
function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(
    item => item.id === product.id && item.size === (product.size || null)
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      size: product.size || null,
      qty: qty
    });
  }

  saveCart(cart);
  showCartToast(`${product.name} added to cart`);
  openCartDrawer();
}

function removeFromCart(id, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.size === size));
  saveCart(cart);
}

function updateQty(id, size, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(id, size);
    return;
  }

  item.qty = newQty;
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

/* ── Badge update — the little count bubble on the cart icon ── */
function updateCartBadge() {
  const badges = document.querySelectorAll(".badge");
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  });
}

/* Build HTML for a single cart line item */
function buildCartItemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}" data-size="${item.size || ''}">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <p class="text-[#f5f5f0] text-xs font-semibold font-body leading-snug mb-1">
            ${item.name}
          </p>
          ${item.size ? `<p class="text-[#888880] text-[0.65rem] font-body mb-1">Size: ${item.size}</p>` : ''}
          <p class="text-[#c9a84c] text-xs font-body">Rs. ${item.price.toLocaleString()}</p>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-2">
            <button class="cart-qty-btn cart-qty-minus">−</button>
            <span class="text-[#f5f5f0] text-xs font-body w-5 text-center">${item.qty}</span>
            <button class="cart-qty-btn cart-qty-plus">+</button>
          </div>
          <button class="cart-remove-btn">Remove</button>
        </div>
      </div>
    </div>
  `;
}

/* Render the whole drawer contents */
function renderCartDrawer() {
  const cart = getCart();
  const itemsWrap = document.getElementById("cart-items");
  const emptyWrap = document.getElementById("cart-empty");
  const footerWrap = document.getElementById("cart-footer");
  const subtotalEl = document.getElementById("cart-subtotal");

  if (!itemsWrap) return; // drawer markup not on this page yet

  if (cart.length === 0) {
    itemsWrap.innerHTML = "";
    itemsWrap.classList.add("hidden");
    emptyWrap.classList.remove("hidden");
    emptyWrap.classList.add("flex");
    footerWrap.style.display = "none";
    return;
  }

  itemsWrap.classList.remove("hidden");
  emptyWrap.classList.add("hidden");
  emptyWrap.classList.remove("flex");
  footerWrap.style.display = "block";

  itemsWrap.innerHTML = cart.map(buildCartItemHTML).join("");
  subtotalEl.textContent = `Rs. ${getCartSubtotal().toLocaleString()}`;

  /* Wire up qty +/- and remove buttons for the freshly rendered items */
  itemsWrap.querySelectorAll(".cart-item").forEach(el => {
    const id = el.getAttribute("data-id");
    const size = el.getAttribute("data-size") || null;
    const item = cart.find(i => String(i.id) === id && i.size === size);
    if (!item) return;

    el.querySelector(".cart-qty-minus").addEventListener("click", () => {
      updateQty(item.id, item.size, item.qty - 1);
    });
    el.querySelector(".cart-qty-plus").addEventListener("click", () => {
      updateQty(item.id, item.size, item.qty + 1);
    });
    el.querySelector(".cart-remove-btn").addEventListener("click", () => {
      removeFromCart(item.id, item.size);
    });
  });
}

/* Toast notification */
let toastTimer;
function showCartToast(message) {
  const toast = document.getElementById("cart-toast");
  const text = document.getElementById("cart-toast-text");
  if (!toast) return;

  text.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* Drawer open/close */
function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer) return;

  renderCartDrawer();
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    overlay.classList.add("open");
    drawer.classList.add("open");
  });
  document.body.classList.add("cart-open");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer) return;

  overlay.classList.remove("open");
  drawer.classList.remove("open");
  document.body.classList.remove("cart-open");

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 400);
}

/* Wire up global cart triggers once DOM is ready */
document.addEventListener("DOMContentLoaded", () => {

  updateCartBadge();

  /* Cart icon in navbar opens the drawer */
  document.querySelectorAll('[aria-label^="Cart"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  const closeBtn = document.getElementById("cart-close");
  const overlay = document.getElementById("cart-overlay");
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (overlay) overlay.addEventListener("click", closeCartDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCartDrawer();
  });

  /* Checkout placeholder */
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showCartToast("Just a frontend demo here, no real checkout or payment processing");
    });
  }

  /* Global Quick Add / Add to Cart delegation */
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-add-btn");
    if (!btn) return;

    addToCart({
      id: btn.getAttribute("data-id"),
      name: btn.getAttribute("data-name"),
      price: Number(btn.getAttribute("data-price")),
      img: btn.getAttribute("data-img")
    });
  });

});