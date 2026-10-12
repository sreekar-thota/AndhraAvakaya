import React, { useState, useRef } from 'react';
import { Eye, MessageCircle, Plus } from 'lucide-react';
import { getWhatsAppProductUrl } from '../config/business';
import { formatRupee } from '../data/products';

export default function ProductCard({ product, onSelect, isSelected }) {
  const cardRef = useRef(null);
  const [selectedWeight, setSelectedWeight] = useState(
    product.defaultWeight || (product.category === 'non-veg' ? '500 g' : '1 kg')
  );

  const currentPrice = product.prices[selectedWeight];
  const formattedPrice = formatRupee(currentPrice);
  const whatsappUrl = getWhatsAppProductUrl(product.name, selectedWeight, formattedPrice);

  const handleCardClick = (e) => {
    // If the click was on controls inside the card, don't trigger pop-out
    if (e.target.closest('.card-weight-btn') || e.target.closest('.card-whatsapp-btn')) {
      return;
    }
    if (cardRef.current && onSelect) {
      const rect = cardRef.current.getBoundingClientRect();
      onSelect(product, rect, selectedWeight);
    }
  };

  const handleWeightSelect = (e, weight) => {
    e.stopPropagation();
    setSelectedWeight(weight);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!e.target.closest('.card-weight-btn') && !e.target.closest('.card-whatsapp-btn')) {
        e.preventDefault();
        handleCardClick(e);
      }
    }
  };

  return (
    <article
      ref={cardRef}
      className={`product-card ${isSelected ? 'product-card-placeholder' : ''}`}
      onClick={handleCardClick}
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

        {/* Quantity / Weight Selector (250g, 500g, 1kg) */}
        <div className="card-weight-selector-wrap" onClick={(e) => e.stopPropagation()}>
          <span className="weight-selector-label">Package Size:</span>
          <div className="card-weight-buttons" role="group" aria-label={`Select quantity for ${product.name}`}>
            {product.availableWeights.map((weight) => {
              const isActive = selectedWeight === weight;
              return (
                <button
                  key={weight}
                  type="button"
                  className={`card-weight-btn ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => handleWeightSelect(e, weight)}
                  aria-pressed={isActive}
                >
                  {weight}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Footer: Pricing/Availability + Quick Action */}
        <div className="product-card-footer">
          <div className="product-card-price-info">
            <span className="price-label">Price ({selectedWeight})</span>
            <span className="price-value price-highlight">{formattedPrice}</span>
          </div>

          <div className="product-card-action-cue">
            <span className="view-details-cue">
              <span>View Recipe & Info</span>
              <Eye size={16} />
            </span>
          </div>
        </div>

        {/* Click for More Info WhatsApp Button */}
        <div className="card-whatsapp-action-row" onClick={(e) => e.stopPropagation()}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-card card-whatsapp-btn"
            id={`whatsapp-btn-${product.id}`}
            aria-label={`Enquire about ${product.name} ${selectedWeight} on WhatsApp`}
          >
            <MessageCircle size={16} />
            <span>Click for More Info</span>
          </a>
        </div>
      </div>
    </article>
  );
}
