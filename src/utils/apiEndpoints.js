// src/utils/apiEndpoints.js
// Purpose: Centralized API endpoint definitions

export const API_ENDPOINTS = Object.freeze({
  AUTH: {
    LOGIN: "/auth/login",
  },

  PRODUCTS: {
    ALL: "/products",
    SINGLE: (id) => `/products/${id}`,
  },

  USERS: {
    ALL: "/users",
    SINGLE: (id) => `/users/${id}`,
  },

   CARTS: {
    ALL: "/carts",
    SINGLE: (cartId) => `/carts/${cartId}`, // ✅ CORRECT
  },
});
