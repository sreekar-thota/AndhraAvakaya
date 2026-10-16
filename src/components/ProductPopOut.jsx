import React, { useEffect, useState, useRef } from 'react';
import { X, MessageCircle, Flame, CheckCircle2, UtensilsCrossed, Package, ArrowRight, Ban, AlertCircle, ShoppingBag, Check } from 'lucide-react';
import { getWhatsAppProductUrl } from '../config/business';
import { formatRupee } from '../data/products';
import { useStock } from '../context/StockContext';
import { useCart } from '../context/CartContext';

export default function ProductPopOut({ product, originRect, initialWeight, onClose }) {
  const { getProductStockInfo, getProductImage } = useStock();
  const { addToCart, openCart } = useCart();
  const stockInfo = getProductStockInfo(product.id);
  const inStock = stockInfo.inStock;
  const productImage = getProductImage ? getProductImage(product.id, product.image) : product.image;

  const [selectedWeight, setSelectedWeight] = useState(
    initialWeight || product.defaultWeight || (product.category === 'non-veg' ? '500 g' : '1 kg')
  );
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Trigger animation on mount
  useEffect(() => {
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Force animation next frame
    const timer = requestAnimationFrame(() => {
      setIsAnimatingIn(true);
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
    });

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleTriggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  const handleTriggerClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsAnimatingIn(false);
    // Wait for the exit animation duration before unmounting
    setTimeout(() => {
      onClose();
    }, 380);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleTriggerClose();
    }
  };

  const currentPrice = product.prices[selectedWeight];
  const formattedPrice = formatRupee(currentPrice);

  // WhatsApp enquiry link with URL-encoded product name, size, and price
  const whatsappUrl = getWhatsAppProductUrl(product.name, selectedWeight, formattedPrice);

  // Compute CSS styles to animate from originRect to center modal
  const getStyleTransform = () => {
    if (!originRect) return {};

    const targetWidth = Math.min(window.innerWidth * 0.94, 780);
    const targetHeight = Math.min(window.innerHeight * 0.9, 750);
    const targetLeft = (window.innerWidth - targetWidth) / 2;
    const targetTop = (window.innerHeight - targetHeight) / 2;

    const scaleX = originRect.width / targetWidth;
    const scaleY = originRect.height / targetHeight;
    const translateX = originRect.left - targetLeft;
    const translateY = originRect.top - targetTop;

    if (!isAnimatingIn || isClosing) {
      return {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        opacity: isClosing ? 0.4 : 0.85,
        borderRadius: '16px',
      };
    }

    return {
      transform: 'translate(0px, 0px) scale(1, 1)',
      opacity: 1,
      borderRadius: '24px',
    };
  };

  return (
    <div
      className={`popout-overlay ${isAnimatingIn && !isClosing ? 'overlay-active' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popout-product-title"
    >
      <div
        ref={modalRef}
        className={`popout-card ${isAnimatingIn && !isClosing ? 'popout-card-expanded' : ''} ${isClosing ? 'popout-card-closing' : ''} ${!inStock ? 'popout-card-unavailable' : ''}`}
        style={getStyleTransform()}
      >
        {/* Floating Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="popout-close-btn"
          onClick={handleTriggerClose}
          aria-label="Close product details dialog"
        >
          <X size={22} />
        </button>

        <div className="popout-card-inner">
          {/* Top Visual Showcase */}
          <div className="popout-image-header">
            <img
              src={productImage}
              alt={product.name}
              className={`popout-hero-image ${!inStock ? 'thumbnail-unavailable' : ''}`}
            />
            <div className="popout-image-gradient" aria-hidden="true" />
            
            <div className="popout-badges-wrapper">
              {inStock ? (
                <span className="stock-badge badge-in-stock">
                  <CheckCircle2 size={12} className="badge-icon" />
                  <span>In Stock</span>
                </span>
              ) : (
                <span className="stock-badge badge-out-of-stock">
                  <Ban size={12} className="badge-icon" />
                  <span>Out of Stock</span>
                </span>
              )}

              {product.badge && (
                <span className="popout-badge">{product.badge}</span>
              )}
            </div>
          </div>

          {/* Main Info Body */}
          <div className="popout-body">
            {/* Title & Telugu name */}
            <div className="popout-title-row">
              <div>
                <span className="popout-telugu-name">{product.teluguName}</span>
                <h2 id="popout-product-title" className="popout-title">
                  {product.name}
                </h2>
              </div>

              {/* Spice Level Indicator */}
              {product.spiceLevel && (
                <div className="popout-spice-tag">
                  <Flame size={16} className="spice-icon" />
                  <span>{product.spiceLevel}</span>
                </div>
              )}
            </div>

            {/* Out-of-Stock Optional Note Banner */}
            {!inStock && stockInfo.note && (
              <div className="product-stock-note-pill popout-stock-note">
                <AlertCircle size={15} className="note-icon" />
                <span>Notice: {stockInfo.note}</span>
              </div>
            )}

            {/* In-depth Heritage Recipe Description */}
            <p className="popout-description">
              {product.fullDescription || product.shortDescription}
            </p>

            {/* Serving Suggestion */}
            {product.servingSuggestion && (
              <div className="popout-serving-box">
                <UtensilsCrossed size={18} className="serving-icon" />
                <div className="serving-text-wrap">
                  <span className="serving-label">Traditional Serving Suggestion:</span>
                  <p className="serving-desc">{product.servingSuggestion}</p>
                </div>
              </div>
            )}

            {/* Ingredients Pills */}
            {product.keyIngredients && product.keyIngredients.length > 0 && (
              <div className="popout-ingredients-section">
                <span className="ingredients-heading">Traditional Ingredients:</span>
                <div className="ingredients-list">
                  {product.keyIngredients.map((item, index) => (
                    <span key={index} className="ingredient-pill">
                      <CheckCircle2 size={13} className="text-chilli" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Quantities & Pricing Selector */}
            <div className="popout-meta-row">
              <div className="popout-meta-item">
                <span className="meta-label">
                  <Package size={15} />
                  Select Package Size
                  {!inStock && <span className="unavailable-hint-tag"> (Unavailable)</span>}
                </span>
                <div className="popout-weight-buttons" role="group" aria-label="Select package size">
                  {product.availableWeights?.map((wt) => {
                    const isActive = selectedWeight === wt;
                    return (
                      <button
                        key={wt}
                        type="button"
                        disabled={!inStock}
                        className={`popout-weight-btn ${isActive ? 'is-active' : ''} ${!inStock ? 'btn-disabled' : ''}`}
                        onClick={() => inStock && setSelectedWeight(wt)}
                        aria-pressed={isActive}
                      >
                        {wt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="popout-meta-item">
                <span className="meta-label">Reference Price ({selectedWeight})</span>
                <span className="popout-price-value price-highlight-large">{formattedPrice}</span>
              </div>
            </div>

            {/* Primary Action Button: Add to Cart & WhatsApp Enquiry */}
            <div className="popout-actions-bar">
              {inStock ? (
                <>
                  <div className="popout-buttons-grid">
                    <button
                      type="button"
                      className={`btn btn-primary popout-cart-btn ${isAddedFeedback ? 'is-added' : ''}`}
                      onClick={() => {
                        const added = addToCart({ ...product, image: productImage }, selectedWeight, 1);
                        if (added) {
                          setIsAddedFeedback(true);
                          setTimeout(() => setIsAddedFeedback(false), 1600);
                        }
                      }}
                      id={`popout-add-to-cart-${product.id}`}
                    >
                      {isAddedFeedback ? (
                        <>
                          <Check size={20} />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={20} />
                          <span>Add to Cart ({selectedWeight})</span>
                        </>
                      )}
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp popout-whatsapp-btn"
                      id={`popout-whatsapp-${product.id}`}
                    >
                      <MessageCircle size={20} className="whatsapp-btn-icon" />
                      <span className="whatsapp-btn-text">WhatsApp Enquiry</span>
                    </a>
                  </div>
                  <span className="popout-whatsapp-hint">
                    Choose pack size ({selectedWeight} - {formattedPrice}), add to cart for complete order checkout, or enquire directly.
                  </span>
                </>
              ) : (
                <div className="popout-unavailable-banner">
                  <div className="unavailable-notice-header">
                    <Ban size={20} className="text-chilli" />
                    <span className="unavailable-notice-title">This Pickle is Currently Out of Stock</span>
                  </div>
                  <p className="unavailable-notice-desc">
                    {stockInfo.note
                      ? `Status: ${stockInfo.note}. Purchase enquiries are temporarily paused for this product.`
                      : 'This pickle variety is freshly prepared in small batches and is currently sold out. Check back soon for fresh batches!'}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
