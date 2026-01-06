import storageService from "./storage.service";
import { STORAGE_KEYS } from "../utils/enums";

export const cartService = {
  getAllCarts() {
    return storageService.get(STORAGE_KEYS.CARTS) ?? [];
  },

  getUserCart(userId) {
    const carts = this.getAllCarts();
    return carts.find(c => c.userId === userId) ?? null;
  },

  saveCart(cart) {
    const carts = this.getAllCarts();
    const updated = carts.filter(c => c.userId !== cart.userId);
    storageService.set(STORAGE_KEYS.CARTS, [...updated, cart]);
  },

  addToCart(userId, product) {
    let cart = this.getUserCart(userId);

    if (!cart) {
      cart = {
        id: crypto.randomUUID(),
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
    }

    const existingItem = cart.items.find(
      item => item.productId === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    cart.updatedAt = new Date().toISOString();
    this.saveCart(cart);
  },
};
