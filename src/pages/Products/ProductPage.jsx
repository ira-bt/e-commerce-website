import { useState, useMemo, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useProducts } from "../../hooks/useProducts"
import { USER_ROLES } from "../../utils/enums"
import ProductCard from "./ProductCard"
import FiltersPanel from "./FiltersPanel"
import {ROUTES} from "../../utils/routes"

export default function ProductsPage() {
  const { role } = useAuth()
  const navigate = useNavigate()
  const { products, loading, error } = useProducts()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 6

  useEffect(() => {
    if (role === USER_ROLES.ADMIN) {
      navigate(ROUTES.ADMIN, { replace: true })
    }
  }, [role, navigate])

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).sort()
  }, [products])

  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 }
    const prices = products.map((p) => p.price)
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    result = result.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max)

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => b.id - a.id)
        break
      case "relevance":
      default:
        break
    }

    return result
  }, [products, searchQuery, selectedCategory, priceRange, sortBy])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }, [])

  const handlePriceChange = useCallback((value) => {
    setPriceRange(value)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((value) => {
    setSortBy(value)
    setCurrentPage(1)
  }, [])

  if (loading) return <p className="products__loading">Loading products...</p>
  if (error) return <p className="products__error">{error}</p>

  return (
    <div className="products">
      <div className="products__header">
        <h1 className="products__title">Products</h1>
      </div>

      <button
        className="products__filter-toggle"
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
      >
        <span>Filters & Sorting</span>
        <span className="products__filter-icon">{showFilters ? "✕" : "☰"}</span>
      </button>

      <div className="products__container">
        <aside className="products__sidebar">
          <FiltersPanel
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            priceStats={priceStats}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </aside>

        <main className="products__main">
          <div className="products__controls">
            <div className="products__info">
              <p className="products__result-count">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} of{" "}
                {filteredAndSortedProducts.length} products
              </p>
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <div className="products__grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="products__pagination">
                  <button
                    className="products__pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ← Previous
                  </button>

                  <div className="products__page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`products__page-number ${currentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="products__pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="products__no-results">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
