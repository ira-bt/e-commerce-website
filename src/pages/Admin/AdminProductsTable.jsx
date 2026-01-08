"use client"

import { useState, useEffect } from "react"
import { productService } from "../../services/product.service"

export default function AdminProductsTable() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const loadedProducts = await productService.bootstrapProducts()
        setProducts(loadedProducts)
      } catch (err) {
        setError("Failed to load products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
    })
    setEditingId(null)
    setShowForm(false)
    setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const existingProduct = products.find((p) => p.id === editingId)
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        id: editingId || Math.max(...products.map((p) => p.id), 0) + 1,
        createdAt: existingProduct?.createdAt || new Date().toISOString(),
      }

      if (editingId) {
        const updatedProduct = {
          ...productData,
          rating: existingProduct?.rating || 0,
          ratingCount: existingProduct?.ratingCount || 0,
        }
        await productService.update(updatedProduct)
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updatedProduct : p)))
        setSuccess("Product updated successfully!")
        setFormData({
          title: "",
          price: "",
          description: "",
          category: "",
          image: "",
        })
        setEditingId(null)
        setShowForm(false)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const newProduct = {
          ...productData,
          rating: 0,
          ratingCount: 0,
        }
        await productService.create(newProduct)
        setProducts((prev) => [...prev, newProduct])
        setSuccess("Product created successfully!")
        setFormData({
          title: "",
          price: "",
          description: "",
          category: "",
          image: "",
        })
        setEditingId(null)
        setShowForm(false)
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      setError("Failed to save product. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    })
    setEditingId(product.id)
    setShowForm(true)
    setSuccess(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    try {
      setLoading(true)
      await productService.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setSuccess("Product deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError("Failed to delete product. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-table">
      <div className="admin-table__header">
        <h2>Products Management</h2>
        <button className="admin-table__btn admin-table__btn--primary" onClick={() => setShowForm(true)}>
          + Add Product
        </button>
      </div>

      {error && <div className="snackbar snackbar--error">{error}</div>}
      {success && <div className="snackbar snackbar--success">{success}</div>}

      {showForm && (
        <form className="admin-table__form" onSubmit={handleSubmit}>
          <div className="admin-table__form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="admin-table__input"
              placeholder="Product title"
            />
          </div>

          <div className="admin-table__form-group">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              required
              className="admin-table__input"
              placeholder="0.00"
            />
          </div>

          <div className="admin-table__form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="admin-table__input"
              placeholder="e.g., electronics"
            />
          </div>

          <div className="admin-table__form-group">
            <label>Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              className="admin-table__input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="admin-table__form-group admin-table__form-group--full">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="admin-table__input"
              rows="4"
              placeholder="Product description"
            />
          </div>

          <div className="admin-table__form-actions">
            <button type="submit" disabled={loading} className="admin-table__btn admin-table__btn--primary">
              {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
            <button type="button" onClick={resetForm} className="admin-table__btn admin-table__btn--secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-table__container">
        {loading && products.length === 0 ? (
          <div className="admin-table__loading">Loading products...</div>
        ) : (
          <table className="admin-table__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th className="admin-table__actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="admin-table__cell-title">{product.title}</td>
                    <td>{product.category}</td>
                    <td className="admin-table__cell-price">${product.price.toFixed(2)}</td>
                    <td className="admin-table__actions-cell">
                      <button
                        onClick={() => handleEdit(product)}
                        className="admin-table__action-btn admin-table__action-btn--edit"
                        title="Edit product"
                        disabled={loading}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="admin-table__action-btn admin-table__action-btn--delete"
                        title="Delete product"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-table__empty">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
