import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (loading) return <p className="products__loading">Loading products...</p>;
  if (error) return <p className="products__error">{error}</p>;

  return (
    <div className="products">
      <div className="products__header">
        <h1 className="products__title">Products</h1>
      </div>

      <div className="products__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
