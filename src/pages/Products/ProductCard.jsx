import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { cartService } from "../../services/cart.service"
import { ROUTES } from "../../utils/routes"

export default function ProductCard({ product }) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }
    await cartService.addToCart(user.username, product)
    navigate(ROUTES.CART)
  }
  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <img src={product.image || "/placeholder.svg"} alt={product.title} className="product-card__image" />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.title}</h3>

        <p className="product-card__category">{product.category}</p>

        <div className="product-card__rating">
          ⭐ {product.rating}
          <span>({product.ratingCount})</span>
        </div>

        <div className="product-card__price">${product.price}</div>
      </div>

      <div className="product-card__footer">
        <button className="secondary">View</button>
        <button className="primary" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
