import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

export const cartApiService = {
  createCart(cart) {
    return axiosInstance.post(API_ENDPOINTS.CARTS.ALL, {
      userId: cart.userId,
      date: new Date().toISOString(),
      products: cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    });
  },

  updateCart(cart) {
    return axiosInstance.put(
      API_ENDPOINTS.CARTS.SINGLE(cart.apiId), // ✅ FIXED
      {
        userId: cart.userId,
        date: new Date().toISOString(),
        products: cart.items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }
    );
  },

  deleteCart(cartId) {
    return axiosInstance.delete(
      API_ENDPOINTS.CARTS.SINGLE(cartId) // ✅ FIXED
    );
  },
};
