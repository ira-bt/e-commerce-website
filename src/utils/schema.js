import { USER_ROLES, ORDER_STATUS } from './enums';

//Takes a FakeStore API product and converts it into app’s product format.
export const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  description: product.description,
  category: product.category,
  image: product.image,
  rating: product.rating?.rate ?? 0,
  ratingCount: product.rating?.count ?? 0,
  createdAt: new Date().toISOString(),
});

//Creates a frontend-owned user record.
export const createUserSchema = (user) => ({
  id: user.id ?? crypto.randomUUID(),
  email: user.email,
  username: user.username,
  role: user.role ?? USER_ROLES.USER,
  createdAt: new Date().toISOString(),
});


//Creates a single cart record per user.
export const createCartSchema = ({ userId, items }) => ({
  id: crypto.randomUUID(),
  userId,
  items,
  updatedAt: new Date().toISOString(),
});

//Creates an order snapshot.
export const createOrderSchema = ({ userId, items, total }) => ({
  id: crypto.randomUUID(),
  userId,
  items,
  total,
  status: ORDER_STATUS.PENDING,
  createdAt: new Date().toISOString(),
});
