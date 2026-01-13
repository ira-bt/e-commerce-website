//Purpose: Prevent magic strings & enforce DRY

export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
});

export const STORAGE_KEYS = Object.freeze({
  USERS: 'fs_users',
  PRODUCTS: 'fs_products',
  CARTS: 'fs_carts',
  ORDERS: 'fs_orders',
  AUTH: 'fs_auth',
});

// export const ORDER_STATUS = Object.freeze({
//   PENDING: 'pending',
//   COMPLETED: 'completed',
//   CANCELLED: 'cancelled',
// });
