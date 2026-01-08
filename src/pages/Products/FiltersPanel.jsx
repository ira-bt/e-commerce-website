"use client"

import { useState, useEffect } from "react"

export default function FiltersPanel({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  priceStats,
  sortBy,
  onSortChange,
  showFilters,
}) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearchQuery, onSearchChange])
  const handleMinRangeChange = (e) => {
    const newMin = Math.min(Number.parseInt(e.target.value), priceRange.max)
    onPriceChange({
      ...priceRange,
      min: newMin,
    })
    const percent = ((newMin - priceStats.min) / (priceStats.max - priceStats.min)) * 100
    e.target.style.setProperty("--slider-percent", `${percent}%`)
  }

  const handleMaxRangeChange = (e) => {
    const newMax = Math.max(Number.parseInt(e.target.value), priceRange.min)
    onPriceChange({
      ...priceRange,
      max: newMax,
    })
    const percent = ((newMax - priceStats.min) / (priceStats.max - priceStats.min)) * 100
    e.target.style.setProperty("--slider-percent", `${percent}%`)
  }

  return (
    <div className={`products__filters ${showFilters ? "active" : ""}`}>
      {/* Search */}
      <div className="products__filter-group">
        <label className="products__filter-label">Search</label>
        <input
          type="text"
          className="products__search-input"
          placeholder="Search products..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
        />
      </div>

      {/* Sorting */}
      <div className="products__filter-group">
        <label className="products__filter-label">Sort By</label>
        <select className="products__select" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="products__filter-group">
          <label className="products__filter-label">Category</label>
          <select
            className="products__select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="products__filter-group">
        <label className="products__filter-label">Price Range</label>
        <div className="products__price-inputs">
          <input
            type="number"
            className="products__price-input"
            placeholder="Min"
            value={priceRange.min}
            min={priceStats.min}
            max={priceStats.max}
            onChange={(e) =>
              onPriceChange({
                ...priceRange,
                min: Math.max(priceStats.min, Math.min(Number.parseInt(e.target.value) || 0, priceRange.max)),
              })
            }
          />
          <span className="products__price-separator">-</span>
          <input
            type="number"
            className="products__price-input"
            placeholder="Max"
            value={priceRange.max}
            min={priceStats.min}
            max={priceStats.max}
            onChange={(e) =>
              onPriceChange({
                ...priceRange,
                max: Math.min(
                  priceStats.max,
                  Math.max(Number.parseInt(e.target.value) || priceStats.max, priceRange.min),
                ),
              })
            }
          />
        </div>
        <div className="products__price-range">
          <input
            type="range"
            className="products__range-slider"
            min={priceStats.min}
            max={priceStats.max}
            value={priceRange.min}
            onChange={handleMinRangeChange}
          />
          <input
            type="range"
            className="products__range-slider"
            min={priceStats.min}
            max={priceStats.max}
            value={priceRange.max}
            onChange={handleMaxRangeChange}
          />
        </div>
      </div>
    </div>
  )
}
