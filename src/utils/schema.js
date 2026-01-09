import { USER_ROLES} from "./enums"
import crypto from "crypto"

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
})

//Creates a frontend-owned user record.
export const createUserSchema = (user, existingUsers = []) => {
  const maxId =
    existingUsers.length > 0 ? Math.max(...existingUsers.map((u) => (typeof u.id === "number" ? u.id : 0))) : 0

  return {
    id: user.id ?? maxId + 1,
    email: user.email,
    username: user.username,
    password: user.password,
    role: user.role ?? USER_ROLES.USER,
    createdAt: new Date().toISOString(),
  }
}

//Creates a single cart record per user.
export const createCartSchema = ({ userId, items }) => ({
  id: crypto.randomUUID(),
  userId,
  items,
  updatedAt: new Date().toISOString(),
})

// //Creates an order snapshot.
// export const createOrderSchema = ({ userId, items, total }) => ({
//   id: crypto.randomUUID(),
//   userId,
//   items,
//   total,
//   status: ORDER_STATUS.PENDING,
//   createdAt: new Date().toISOString(),
// })
