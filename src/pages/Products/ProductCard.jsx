export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__image"
        />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.title}</h3>

        <p className="product-card__category">{product.category}</p>

        <div className="product-card__rating">
          ⭐ {product.rating}
          <span>({product.ratingCount})</span>
        </div>

        <div className="product-card__price">
          ₹{product.price}
        </div>
      </div>

      <div className="product-card__footer">
        <button className="secondary">View</button>
        <button className="primary">Add to Cart</button>
      </div>
    </div>
  );
}
