// Purpose: Product CRUD + API → LocalStorage bootstrap
// Single source of truth: LocalStorage

import axiosInstance from '../api/axiosInstance'
import storageService from './storage.service';
import { STORAGE_KEYS } from '../utils/enums';
import { normalizeProduct } from '../utils/schema';

export const productService = {
  /**
   * Bootstrap products:
   * - If products exist in LocalStorage → return them
   * - Else → fetch from API → normalize → store → return
   */
  async bootstrapProducts() {
    const existingProducts = storageService.get(STORAGE_KEYS.PRODUCTS);

    if (Array.isArray(existingProducts) && existingProducts.length > 0) {
      return existingProducts;
    }

    const response = await axiosInstance.get('/products');
    const normalizedProducts = response.data.map(normalizeProduct);

    storageService.set(STORAGE_KEYS.PRODUCTS, normalizedProducts);
    return normalizedProducts;
  },

  /**
   * Read all products (always from LocalStorage)
   */
  getAll() {
    return storageService.get(STORAGE_KEYS.PRODUCTS) ?? [];
  },

  /**
   * Read single product by ID
   */
  getById(id) {
    return this.getAll().find((product) => product.id === id);
  },

  /**
   * Create product (admin use)
   */
  create(product) {
    const products = this.getAll();
    const updatedProducts = [...products, product];

    storageService.set(STORAGE_KEYS.PRODUCTS, updatedProducts);
    return product;
  },

  /**
   * Update product (admin use)
   */
  update(updatedProduct) {
    const products = this.getAll();

    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );

    storageService.set(STORAGE_KEYS.PRODUCTS, updatedProducts);
    return updatedProduct;
  },

  /**
   * Delete product by ID (admin use)
   */
  delete(id) {
    const products = this.getAll();
    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    storageService.set(STORAGE_KEYS.PRODUCTS, updatedProducts);
  },
};
