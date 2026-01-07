// cart.service.js
import storageService from "./storage.service";
import { STORAGE_KEYS } from "../utils/enums";
import { cartApiService } from "./cart.api";

export const cartService = {
  getAllCarts() {
    return storageService.get(STORAGE_KEYS.CARTS) ?? [];
  },

  getUserCart(userId) {
    return this.getAllCarts().find(c => c.userId === userId) ?? null;
  },

  saveCart(cart) {
    const carts = this.getAllCarts().filter(c => c.userId !== cart.userId);
    storageService.set(STORAGE_KEYS.CARTS, [...carts, cart]);
  },

  /* =========================
     ADD TO CART (FIXED, SAFE)
  ========================= */
  async addToCart(userId, product) {
    const existingCart = this.getUserCart(userId);

    const cart = existingCart ?? {
      id: crypto.randomUUID(),
      apiId: null,
      userId,
      items: [],
    };

    const items = cart.items.some(i => i.productId === product.id)
      ? cart.items.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      : [
          ...cart.items,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ];

    const newCart = { ...cart, items };

    this.saveCart(newCart);

    // API sync (non-blocking UI)
    if (!newCart.apiId) {
      const res = await cartApiService.createCart(newCart);
      newCart.apiId = res.data.id;
      this.saveCart(newCart);
    } else {
      cartApiService.updateCart(newCart).catch(() => {});
    }

    return newCart;
  },

  /* =========================
     UPDATE QUANTITY (YOU WERE RIGHT)
  ========================= */
  async updateQuantity(userId, productId, delta) {
    const cart = this.getUserCart(userId);
    if (!cart) return null;

    const newCart = {
      ...cart,
      items: cart.items
        .map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0),
    };

    this.saveCart(newCart);

    if (newCart.apiId) {
      cartApiService.updateCart(newCart).catch(() => {});
    }

    return newCart;
  },
  async clearCart(userId) {
  const cart = this.getUserCart(userId);
  if (!cart) return null;

  // Remove from local storage
  storageService.set(
    STORAGE_KEYS.CARTS,
    this.getAllCarts().filter(c => c.userId !== userId)
  );

  // Delete from API if exists
  if (cart.apiId) {
    await cartApiService.deleteCart(cart.apiId).catch(() => {});
  }

  return null; // always return null to indicate empty cart
},

};

