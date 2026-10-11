import React, { useRef } from 'react';
import { Eye, MessageCircle, Sparkles, Plus } from 'lucide-react';
import { getWhatsAppProductUrl } from '../config/business';

export default function ProductCard({ product, onSelect, isSelected }) {
  const cardRef = useRef(null);

  const handleClick = (e) => {
    // If the click was directly on an action link/button inside the card, don't trigger pop-out
    if (e.target.closest('.card-direct-action')) {
      return;
    }
    if (cardRef.current && onSelect) {
      const rect = cardRef.current.getBoundingClientRect();
      onSelect(product, rect);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <article
      ref={cardRef}
      className={`product-card ${isSelected ? 'product-card-placeholder' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
      aria-haspopup="dialog"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Box */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-thumbnail"
          loading="lazy"
          width="400"
          height="400"
        />

        {/* Traditional Badge */}
        {product.badge && (
          <span className="product-card-badge">{product.badge}</span>
        )}

        {/* Hover / Click Prompt Overlay */}
        <div className="product-hover-overlay" aria-hidden="true">
          <span className="hover-explore-btn">
            <Plus size={16} />
            <span>Click to Expand</span>
          </span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="product-card-body">
        <div className="product-card-header">
          <span className="product-telugu-name">{product.teluguName}</span>
          <h3 className="product-card-title">{product.name}</h3>
        </div>

        <p className="product-card-desc">
          {product.shortDescription}
        </p>

        {/* Card Footer: Pricing/Availability + Quick Action */}
        <div className="product-card-footer">
          <div className="product-card-price-info">
            <span className="price-label">Pricing</span>
            <span className="price-value">{product.approxPrice || product.priceDisplay}</span>
          </div>

          <div className="product-card-action-cue">
            <span className="view-details-cue">
              <span>View Recipe & Info</span>
              <Eye size={16} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
