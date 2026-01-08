import { useEffect } from "react"
import { createPortal } from "react-dom"


export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }


    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }


  return createPortal(
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal">
        <button className="product-modal__close" onClick={onClose}>
          ✕
        </button>


        <div className="product-modal__image-wrapper">
          <img src={product.image || "/placeholder.svg"} alt={product.title} className="product-modal__image" />
        </div>


        <div className="product-modal__content">
          <h2 className="product-modal__title">{product.title}</h2>


          <p className="product-modal__category">Category: {product.category}</p>


          <div className="product-modal__rating">
            ⭐ {product.rating} ({product.ratingCount} reviews)
          </div>


          <div className="product-modal__price">${product.price}</div>


          <div className="product-modal__description">{product.description || "No description available"}</div>
        </div>
      </div>
    </div>,
    document.getElementById("root"),
  )
}
