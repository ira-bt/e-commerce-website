// Purpose: Product CRUD + API → LocalStorage bootstrap

import { storageService } from './storage.service';
import { STORAGE_KEYS } from '@/utils/enums';
import { normalizeProduct } from '@/utils/schemas';
import axiosInstance from '@/api/axiosInstance';

export const productService = {

  //If products exist in LocalStorage → use them, Else → fetch from API → normalize → store → use
  async bootstrapProducts() {
    const existing = storageService.get(STORAGE_KEYS.PRODUCTS);
    if (existing?.length) return existing;

    const response = await axiosInstance.get('/products');
    const normalized = response.data.map(normalizeProduct);

    storageService.set(STORAGE_KEYS.PRODUCTS, normalized);
    return normalized;
  },

  getAll() {
    return storageService.get(STORAGE_KEYS.PRODUCTS) ?? [];
  },

  getById(id) {
    return this.getAll().find((p) => p.id === id);
  },

  create(product) {
    const products = this.getAll();
    products.push(product);
    storageService.set(STORAGE_KEYS.PRODUCTS, products);
  },

  update(updatedProduct) {
    const products = this.getAll().map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    storageService.set(STORAGE_KEYS.PRODUCTS, products);
  },

  delete(id) {
    const products = this.getAll().filter((p) => p.id !== id);
    storageService.set(STORAGE_KEYS.PRODUCTS, products);
  },
};
