// src/utils/routes.js
// Purpose: Centralized route definitions (no magic strings)

export const ROUTES = Object.freeze({
  // Public
  LOGIN: "/login",
  UNAUTHORIZED: "/unauthorized",

  // User (authenticated)
  HOME: "/",            // Products page
  CHECKOUT: "/checkout",

  // Admin
  ADMIN: "/admin",

  //Register
  REGISTER: "/register",

  //cart
  CART:"/cart",

  //profile
  PROFILE: "/profile",

});
