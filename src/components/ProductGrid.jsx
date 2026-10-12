import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductPopOut from './ProductPopOut';
import { PRODUCTS } from '../data/products';

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('veg');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originRect, setOriginRect] = useState(null);

  // Filter products based on selected category ('veg' or 'non-veg')
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleSelectProduct = (product, rect) => {
    setOriginRect(rect);
    setSelectedProduct(product);
  };

  const handleClosePopOut = () => {
    setSelectedProduct(null);
    setOriginRect(null);
  };

  const handleCategoryChange = (category) => {
    if (activeCategory !== category) {
      handleClosePopOut();
      setActiveCategory(category);
    }
  };

  return (
    <section id="products" className="products-section section-padding" aria-label="Our Pickles Collection">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="traditional-badge">
            <Sparkles size={14} />
            <span>Our Handcrafted Varieties</span>
          </div>
          <h2 className="section-title">
            Discover Our Pickles
          </h2>
          <div className="traditional-divider" aria-hidden="true" />
          <p className="section-subtitle">
            Traditional Andhra flavours, made to be enjoyed with every meal.
          </p>

          {/* Category Toggle Tabs */}
          <div 
            className="category-toggle-container"
            role="tablist"
            aria-label="Pickle categories"
          >
            <button
              type="button"
              role="tab"
              id="category-tab-veg"
              aria-selected={activeCategory === 'veg'}
              aria-controls="products-grid-list"
              className={`category-toggle-btn ${activeCategory === 'veg' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('veg')}
            >
              <span className="category-emoji" aria-hidden="true">🥬</span>
              <span className="category-name">Veg Pickles</span>
            </button>

            <button
              type="button"
              role="tab"
              id="category-tab-non-veg"
              aria-selected={activeCategory === 'non-veg'}
              aria-controls="products-grid-list"
              className={`category-toggle-btn ${activeCategory === 'non-veg' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('non-veg')}
            >
              <span className="category-emoji" aria-hidden="true">🍗</span>
              <span className="category-name">Non Veg Pickles</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div 
            id="products-grid-list"
            className="products-grid" 
            role="tabpanel" 
            aria-labelledby={`category-tab-${activeCategory}`}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
                isSelected={selectedProduct?.id === product.id}
              />
            ))}
          </div>
        ) : (
          <div className="products-empty-state" role="status">
            <p className="empty-state-title">No pickles available in this category yet.</p>
            <p className="empty-state-desc">
              We are handcrafting new batches soon. Enquire with us directly on WhatsApp for special requests!
            </p>
          </div>
        )}

        {/* Feature Hint Banner */}
        <div className="products-hint-banner">
          <p>
            ✨ Tap or click on any jar to inspect its authentic ingredients, preparation story, and enquire instantly via WhatsApp.
          </p>
        </div>

      </div>

      {/* Pop-Out Animation Overlay */}
      {selectedProduct && originRect && (
        <ProductPopOut
          product={selectedProduct}
          originRect={originRect}
          onClose={handleClosePopOut}
        />
      )}
    </section>
  );
}
