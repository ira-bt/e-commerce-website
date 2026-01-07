import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

export const cartApiService = {
  async createCart(cart) {
    return axiosInstance.post(API_ENDPOINTS.CARTS.ALL, {
      userId: cart.userId,
      date: new Date().toISOString(),
      products: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  },

  async updateCart(cart) {
    return axiosInstance.put(
      API_ENDPOINTS.CARTS.SINGLE(cart.apiId),
      {
        userId: cart.userId,
        date: new Date().toISOString(),
        products: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }
    );
  },

  async deleteCart(apiCartId) {
    return axiosInstance.delete(
      API_ENDPOINTS.CARTS.SINGLE(apiCartId)
    );
  },
};
