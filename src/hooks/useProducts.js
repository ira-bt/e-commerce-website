import { useEffect, useState } from "react";
import { productService } from "../services/product.service";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const data = await productService.bootstrapProducts();
        if (isMounted) setProducts(data);
      } catch (err) {
        console.log(err);
        if (isMounted) setError("Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
