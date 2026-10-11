import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductPopOut from './ProductPopOut';
import { PRODUCTS } from '../data/products';

export default function ProductGrid() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originRect, setOriginRect] = useState(null);

  const handleSelectProduct = (product, rect) => {
    setOriginRect(rect);
    setSelectedProduct(product);
  };

  const handleClosePopOut = () => {
    setSelectedProduct(null);
    setOriginRect(null);
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
        </div>

        {/* Product Cards Grid */}
        <div className="products-grid" role="region" aria-label="Product list">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
              isSelected={selectedProduct?.id === product.id}
            />
          ))}
        </div>

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
