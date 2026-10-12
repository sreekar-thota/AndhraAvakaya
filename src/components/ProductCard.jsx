import React, { useState, useRef } from 'react';
import { Eye, MessageCircle, Plus, CheckCircle2, Ban, AlertCircle } from 'lucide-react';
import { getWhatsAppProductUrl } from '../config/business';
import { formatRupee } from '../data/products';
import { useStock } from '../context/StockContext';

export default function ProductCard({ product, onSelect, isSelected }) {
  const cardRef = useRef(null);
  const { getProductStockInfo, isLoading } = useStock();
  const stockInfo = getProductStockInfo(product.id);
  const inStock = stockInfo.inStock;

  const [selectedWeight, setSelectedWeight] = useState(
    product.defaultWeight || (product.category === 'non-veg' ? '500 g' : '1 kg')
  );

  const currentPrice = product.prices[selectedWeight];
  const formattedPrice = formatRupee(currentPrice);
  const whatsappUrl = getWhatsAppProductUrl(product.name, selectedWeight, formattedPrice);

  const handleCardClick = (e) => {
    // If the click was on controls inside the card, don't trigger pop-out
    if (e.target.closest('.card-weight-btn') || e.target.closest('.card-whatsapp-btn') || e.target.closest('.btn-unavailable-card')) {
      return;
    }
    if (cardRef.current && onSelect) {
      const rect = cardRef.current.getBoundingClientRect();
      onSelect(product, rect, selectedWeight, stockInfo);
    }
  };

  const handleWeightSelect = (e, weight) => {
    e.stopPropagation();
    if (!inStock) return; // Prevent changing size when out of stock
    setSelectedWeight(weight);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!e.target.closest('.card-weight-btn') && !e.target.closest('.card-whatsapp-btn') && !e.target.closest('.btn-unavailable-card')) {
        e.preventDefault();
        handleCardClick(e);
      }
    }
  };

  return (
    <article
      ref={cardRef}
      className={`product-card ${isSelected ? 'product-card-placeholder' : ''} ${!inStock ? 'is-out-of-stock' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name} (${inStock ? 'In Stock' : 'Out of Stock'})`}
      aria-haspopup="dialog"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Box */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className={`product-thumbnail ${!inStock ? 'thumbnail-unavailable' : ''}`}
          loading="lazy"
          width="400"
          height="400"
        />

        {/* Dynamic Stock Indicator Badge */}
        <div className="product-card-badges-container">
          {inStock ? (
            <span className="stock-badge badge-in-stock" title="Available to order">
              <CheckCircle2 size={12} className="badge-icon" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="stock-badge badge-out-of-stock" title="Temporarily unavailable">
              <Ban size={12} className="badge-icon" />
              <span>Out of Stock</span>
            </span>
          )}

          {/* Traditional Badge */}
          {product.badge && (
            <span className="product-card-badge">{product.badge}</span>
          )}
        </div>

        {/* Hover / Click Prompt Overlay */}
        <div className="product-hover-overlay" aria-hidden="true">
          <span className="hover-explore-btn">
            <Plus size={16} />
            <span>Click to View Details</span>
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

        {/* Out-of-Stock Optional Note Banner */}
        {!inStock && stockInfo.note && (
          <div className="product-stock-note-pill">
            <AlertCircle size={13} className="note-icon" />
            <span>{stockInfo.note}</span>
          </div>
        )}

        {/* Quantity / Weight Selector (250 g, 500 g, 1 kg) */}
        <div className="card-weight-selector-wrap" onClick={(e) => e.stopPropagation()}>
          <div className="weight-selector-header">
            <span className="weight-selector-label">Package Size:</span>
            {!inStock && <span className="unavailable-hint-tag">Unavailable</span>}
          </div>
          <div
            className={`card-weight-buttons ${!inStock ? 'weight-buttons-disabled' : ''}`}
            role="group"
            aria-label={`Select quantity for ${product.name}`}
          >
            {product.availableWeights.map((weight) => {
              const isActive = selectedWeight === weight;
              return (
                <button
                  key={weight}
                  type="button"
                  disabled={!inStock}
                  className={`card-weight-btn ${isActive ? 'is-active' : ''} ${!inStock ? 'btn-disabled' : ''}`}
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

        {/* Order / Enquiry Action Row */}
        <div className="card-whatsapp-action-row" onClick={(e) => e.stopPropagation()}>
          {inStock ? (
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
          ) : (
            <button
              type="button"
              disabled
              className="btn-unavailable-card"
              id={`unavailable-btn-${product.id}`}
              aria-label={`${product.name} is currently out of stock`}
              title="This item is currently out of stock"
            >
              <Ban size={16} />
              <span>Currently Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
