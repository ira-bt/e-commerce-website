// Purpose: Product CRUD + API → LocalStorage bootstrap
// Single source of truth: LocalStorage

import axiosInstance from "../api/axiosInstance"
import storageService from "./storage.service"
import { STORAGE_KEYS } from "../utils/enums"
import { normalizeProduct } from "../utils/schema"
import { API_ENDPOINTS } from "../utils/apiEndpoints"

export const productService = {
  /**
   * Bootstrap products:
   * - If products exist in LocalStorage → return them
   * - Else → fetch from API → normalize → store → return
   */
  async bootstrapProducts() {
    const existingProducts = storageService.get(STORAGE_KEYS.PRODUCTS)

    if (Array.isArray(existingProducts) && existingProducts.length > 0) {
      return existingProducts
    }

    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.ALL)
    const normalizedProducts = response.data.map(normalizeProduct)

    storageService.set(STORAGE_KEYS.PRODUCTS, normalizedProducts)
    return normalizedProducts
  },

  /**
   * Read all products (always from LocalStorage)
   */
  getAll() {
    return storageService.get(STORAGE_KEYS.PRODUCTS) ?? []
  },

  /**
   * Read single product by ID
   */
  getById(id) {
    return this.getAll().find((product) => product.id === id)
  },

  /**
   * Create product (admin use) - Hit API then sync localStorage
   */
  async create(product) {
    try {
      try {
        await axiosInstance.post(API_ENDPOINTS.PRODUCTS.ALL, product)
      } catch (apiError) {
        console.log("API create failed (expected for FakeStore):", apiError.message)
      }

      // Always sync to localStorage
      const products = this.getAll()
      const updatedProducts = [...products, product]
      storageService.set(STORAGE_KEYS.PRODUCTS, updatedProducts)
      return product
    } catch (err) {
      console.error("Create product error:", err)
      throw err
    }
  },

  /**
   * Update product (admin use) - Hit API then sync localStorage
   */
  async update(updatedProduct) {
    try {
      try {
        await axiosInstance.put(API_ENDPOINTS.PRODUCTS.SINGLE(updatedProduct.id), updatedProduct)
      } catch (apiError) {
        console.log("API update failed (expected for FakeStore):", apiError.message)
      }

      // Always sync to localStorage
      const products = this.getAll()
      const updatedProducts = products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      storageService.set(STORAGE_KEYS.PRODUCTS, updatedProducts)
      return updatedProduct
    } catch (err) {
      console.error("Update product error:", err)
      throw err
    }
  },

  /**
   * Delete product by ID (admin use) - Hit API then sync localStorage
   */
  async delete(id) {
    try {
      try {
        await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.SINGLE(id))
      } catch (apiError) {
        console.log("API delete failed (expected for FakeStore):", apiError.message)
      }

      // Always sync to localStorage
      const products = this.getAll()
      const updatedProducts = products.filter((product) => product.id !== id)
      storageService.set(STORAGE_KEYS.PRODUCTS, updatedProducts)
    } catch (err) {
      console.error("Delete product error:", err)
      throw err
    }
  },
}
