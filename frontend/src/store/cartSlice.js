import { createSlice } from "@reduxjs/toolkit";

/* ── Persist helpers ───────────────────────────────────────────────── */
const STORAGE_KEY = "adorzia_cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [], isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  } catch { /* silent */ }
};

/* ── Initial state ─────────────────────────────────────────────────── */
const persisted = loadCart();

const initialState = {
  items: persisted.items || [],
  isOpen: false,
};

/* ── Slice ─────────────────────────────────────────────────────────── */
const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    /* Add item — if same product+size+color exists, bump quantity */
    addToCart(state, { payload }) {
      const { product, size, color, quantity = 1 } = payload;

      const existing = state.items.find(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          designer: product.designer?.name || product.designer || "Adorzia",
          designerSlug: product.designer?.slug || "",
          price: product.price,
          priceRaw: typeof product.price === "string"
            ? parseInt(product.price.replace(/[^0-9]/g, ""), 10)
            : product.price,
          image: product.gallery?.[0] || product.image || "",
          size,
          color,
          quantity,
          collection: product.collection?.name || "",
        });
      }

      saveCart(state.items);
      state.isOpen = true; // open drawer on add
    },

    /* Remove item */
    removeFromCart(state, { payload }) {
      state.items = state.items.filter((item) => item.id !== payload);
      saveCart(state.items);
    },

    /* Update quantity */
    updateQuantity(state, { payload }) {
      const { itemId, quantity } = payload;
      const item = state.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart(state.items);
      }
    },

    /* Update size */
    updateSize(state, { payload }) {
      const { itemId, size } = payload;
      const item = state.items.find((i) => i.id === itemId);
      if (item) {
        item.size = size;
        saveCart(state.items);
      }
    },

    /* Clear cart */
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },

    /* Toggle drawer */
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },

    /* Open drawer */
    openCart(state) {
      state.isOpen = true;
    },

    /* Close drawer */
    closeCart(state) {
      state.isOpen = false;
    },
  },
});

/* ── Actions ────────────────────────────────────────────────────────── */
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateSize,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

/* ── Selectors ──────────────────────────────────────────────────────── */
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.priceRaw * item.quantity, 0);

export default cartSlice.reducer;
