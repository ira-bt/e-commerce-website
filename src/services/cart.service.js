import storageService from "./storage.service";
import { STORAGE_KEYS } from "../utils/enums";
import { cartApiService } from "./cart.api";

export const cartService = {
  getUserCart(userId) {
    return (
      storageService
        .get(STORAGE_KEYS.CARTS)
        ?.find(c => c.userId === userId) ?? null
    );
  },

  saveCart(cart) {
    const carts =
      storageService.get(STORAGE_KEYS.CARTS)?.filter(
        c => c.userId !== cart.userId
      ) ?? [];

    storageService.set(STORAGE_KEYS.CARTS, [...carts, cart]);
  },

  async addToCart(userId, product) {
    let cart = this.getUserCart(userId);

    if (!cart) {
      cart = {
        userId,
        items: [],
        apiId: null,
      };
    }

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

    cart = { ...cart, items };

    // ✅ API FIRST
    if (!cart.apiId) {
      const res = await cartApiService.createCart(cart);
      cart.apiId = res.data.id;
    } else {
      await cartApiService.updateCart(cart);
    }

    this.saveCart(cart);
    return cart;
  },

  async updateQuantity(userId, productId, delta) {
    const cart = this.getUserCart(userId);
    if (!cart) return null;

    const items = cart.items
      .map(i =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + delta }
          : i
      )
      .filter(i => i.quantity > 0);

    const updatedCart = { ...cart, items };

    await cartApiService.updateCart(updatedCart); // ✅ REAL PUT
    this.saveCart(updatedCart);

    return updatedCart;
  },

  async clearCart(userId) {
    const cart = this.getUserCart(userId);
    if (!cart || !cart.apiId) return;

    await cartApiService.deleteCart(cart.apiId); // ✅ REAL DELETE

    storageService.set(
      STORAGE_KEYS.CARTS,
      storageService
        .get(STORAGE_KEYS.CARTS)
        ?.filter(c => c.userId !== userId)
    );
  },
};
