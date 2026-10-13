import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStock } from '../../context/StockContext';
import { getWhatsAppOrderUrl, BUSINESS_CONFIG } from '../../config/business';
import { formatRupee } from '../../data/products';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    checkoutStep,
    setCheckoutStep,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    total,
    totalItemsCount,
    customerDetails,
    updateCustomerDetails,
    getUnavailableCartItems,
    refreshStock
  } = useCart();

  const { isProductInStock } = useStock();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [popupBlocked, setPopupBlocked] = useState(false);

  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Form field change handler
  const handleFieldChange = (field, value) => {
    updateCustomerDetails({ [field]: value });
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate Step 2: Customer Details
  const validateCustomerForm = () => {
    const errors = {};
    const name = (customerDetails.name || '').trim();
    const phone = (customerDetails.phone || '').trim().replace(/[\s-]/g, '');
    const address = (customerDetails.address || '').trim();
    const town = (customerDetails.town || '').trim();
    const pincode = (customerDetails.pincode || '').trim();

    if (!name || name.length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters)';
    }

    // Phone validation: Indian 10-digit number or international with country code
    const phoneClean = phone.replace(/^\+91/, '').replace(/^0/, '');
    if (!phoneClean) {
      errors.phone = 'Phone number is required for WhatsApp confirmation';
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!address || address.length < 5) {
      errors.address = 'Please enter complete delivery address (House/Flat, Street)';
    }

    if (!town || town.length < 2) {
      errors.town = 'Please enter your village, town, or city';
    }

    // Indian PIN code: 6 digits
    if (!pincode) {
      errors.pincode = 'PIN code is required to calculate courier delivery charges';
    } else if (!/^\d{6}$/.test(pincode)) {
      errors.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Revalidate stock and proceed from Cart to Details
  const handleProceedToDetails = async () => {
    if (cartItems.length === 0) return;

    // Refresh stock in background
    try {
      if (refreshStock) {
        await refreshStock();
      }
    } catch (err) {
      console.warn('Stock refresh error:', err);
    }

    const unavailable = getUnavailableCartItems();
    if (unavailable.length > 0) {
      return; // Stock warning is shown in UI
    }

    setCheckoutStep('details');
  };

  // Proceed from Details to Summary
  const handleProceedToSummary = () => {
    if (validateCustomerForm()) {
      setCheckoutStep('summary');
    }
  };

  // Final Action: Generate WhatsApp checkout and open Click-to-Chat URL
  const handlePlaceOrderWhatsApp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setPopupBlocked(false);

    try {
      // Re-verify stock before opening WhatsApp
      if (refreshStock) {
        await refreshStock();
      }

      const unavailable = getUnavailableCartItems();
      if (unavailable.length > 0) {
        alert(
          `Some items in your cart (${unavailable.map((i) => i.name).join(', ')}) are currently out of stock. Please remove them before placing order.`
        );
        setIsSubmitting(false);
        setCheckoutStep('cart');
        return;
      }

      const url = getWhatsAppOrderUrl({
        customer: customerDetails,
        items: cartItems,
        subtotal,
        total
      });

      setWhatsAppUrl(url);

      // Open WhatsApp click-to-chat
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Pop-up might have been blocked by browser
        setPopupBlocked(true);
      }

      setCheckoutStep('sent');
    } catch (err) {
      console.error('Error opening WhatsApp:', err);
      alert('Could not open WhatsApp automatically. Please click the link to open WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  const unavailableItems = getUnavailableCartItems();
  const hasUnavailableItems = unavailableItems.length > 0;

  return (
    <div className="cart-drawer-overlay" onClick={closeCart} aria-modal="true" role="dialog">
      <div
        ref={drawerRef}
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart and WhatsApp Checkout"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <ShoppingBag size={22} className="cart-header-icon" />
            <h2 className="cart-header-title">Your Shopping Cart</h2>
            {totalItemsCount > 0 && (
              <span className="cart-header-count">({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
            )}
          </div>
          <button
            type="button"
            className="cart-drawer-close-btn"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Stepper (shown when cart has items or on later steps) */}
        {cartItems.length > 0 && (
          <div className="cart-stepper" aria-label="Checkout Progress">
            <button
              type="button"
              className={`cart-step-item ${checkoutStep === 'cart' ? 'is-active' : 'is-completed'}`}
              onClick={() => setCheckoutStep('cart')}
            >
              <span className="step-num">1</span>
              <span className="step-label">Cart</span>
            </button>
            <div className={`step-connector ${checkoutStep !== 'cart' ? 'is-active' : ''}`} />
            <button
              type="button"
              className={`cart-step-item ${checkoutStep === 'details' ? 'is-active' : checkoutStep === 'summary' || checkoutStep === 'sent' ? 'is-completed' : ''}`}
              onClick={() => {
                if (cartItems.length > 0 && !hasUnavailableItems) {
                  setCheckoutStep('details');
                }
              }}
              disabled={hasUnavailableItems}
            >
              <span className="step-num">2</span>
              <span className="step-label">Details</span>
            </button>
            <div className={`step-connector ${checkoutStep === 'summary' || checkoutStep === 'sent' ? 'is-active' : ''}`} />
            <button
              type="button"
              className={`cart-step-item ${checkoutStep === 'summary' || checkoutStep === 'sent' ? 'is-active' : ''}`}
              onClick={() => {
                if (validateCustomerForm()) {
                  setCheckoutStep('summary');
                }
              }}
              disabled={hasUnavailableItems || !customerDetails.name}
            >
              <span className="step-num">3</span>
              <span className="step-label">WhatsApp</span>
            </button>
          </div>
        )}

        {/* Drawer Body - dynamic based on step */}
        <div className="cart-drawer-body">
          {/* ========================================================= */}
          {/* STEP 1: CART ITEMS LIST */}
          {/* ========================================================= */}
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="empty-icon-wrap">
                    <ShoppingBag size={54} className="empty-icon" />
                  </div>
                  <h3 className="empty-title">Your cart is empty</h3>
                  <p className="empty-desc">
                    Explore our traditional homemade Andhra pickles made with fresh Guntur chillies and pure cold-pressed sesame oil.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary empty-shop-btn"
                    onClick={() => {
                      closeCart();
                      const el = document.getElementById('products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>Browse Pickles</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="cart-items-wrapper">
                  {/* Out-of-stock warning notice if any item is unavailable */}
                  {hasUnavailableItems && (
                    <div className="cart-stock-warning" role="alert">
                      <AlertCircle size={20} className="warning-icon" />
                      <div>
                        <strong>Some items are currently out of stock</strong>
                        <p>
                          Please remove unavailable items before proceeding. Stock updates in real time.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="cart-items-list">
                    {cartItems.map((item) => {
                      const isItemInStock = isProductInStock(item.id);
                      return (
                        <div
                          key={`${item.id}-${item.weight}`}
                          className={`cart-item-card ${!isItemInStock ? 'item-out-of-stock' : ''}`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-image"
                            width="72"
                            height="72"
                          />
                          <div className="cart-item-details">
                            <div className="cart-item-title-row">
                              <div>
                                <h4 className="cart-item-name">{item.name}</h4>
                                {item.teluguName && (
                                  <span className="cart-item-telugu">{item.teluguName}</span>
                                )}
                              </div>
                              <button
                                type="button"
                                className="cart-item-remove-btn"
                                onClick={() => removeFromCart(item.id, item.weight)}
                                aria-label={`Remove ${item.name} (${item.weight}) from cart`}
                                title="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="cart-item-meta-row">
                              <span className="cart-item-weight-badge">{item.weight}</span>
                              <span className="cart-item-unit-price">{formatRupee(item.price)} each</span>
                            </div>

                            {!isItemInStock && (
                              <span className="item-stock-alert">
                                Temporarily Out of Stock
                              </span>
                            )}

                            <div className="cart-item-bottom-row">
                              {/* Quantity Controls */}
                              <div className="cart-quantity-selector" role="group" aria-label="Quantity">
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="qty-value" aria-live="polite">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Line Total */}
                              <div className="cart-item-line-total">
                                <span className="line-total-label">Total:</span>
                                <span className="line-total-value">
                                  {formatRupee(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* STEP 2: CUSTOMER DETAILS FORM */}
          {/* ========================================================= */}
          {checkoutStep === 'details' && (
            <div className="cart-form-container">
              <div className="form-step-intro">
                <MapPin size={20} className="step-intro-icon" />
                <div>
                  <h3 className="form-intro-title">Delivery & Contact Details</h3>
                  <p className="form-intro-desc">
                    Enter your complete delivery address for courier dispatch and delivery charge estimation.
                  </p>
                </div>
              </div>

              <form
                className="customer-details-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProceedToSummary();
                }}
                noValidate
              >
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="customer-name" className="form-label">
                    <User size={15} />
                    <span>Full Name <span className="required-star">*</span></span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    className={`form-input ${formErrors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g., Rajesh Sharma"
                    value={customerDetails.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    autoComplete="name"
                    required
                  />
                  {formErrors.name && (
                    <span className="field-error-msg">{formErrors.name}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="customer-phone" className="form-label">
                    <Phone size={15} />
                    <span>WhatsApp / Mobile Number <span className="required-star">*</span></span>
                  </label>
                  <div className="input-prefix-wrap">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="customer-phone"
                      type="tel"
                      className={`form-input input-with-prefix ${formErrors.phone ? 'is-invalid' : ''}`}
                      placeholder="9876543210"
                      value={customerDetails.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      maxLength={14}
                      autoComplete="tel"
                      required
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="field-error-msg">{formErrors.phone}</span>
                  )}
                  <span className="field-hint">We communicate orders & trackings via WhatsApp.</span>
                </div>

                {/* Complete Address */}
                <div className="form-group">
                  <label htmlFor="customer-address" className="form-label">
                    <MapPin size={15} />
                    <span>Complete Street / House Address <span className="required-star">*</span></span>
                  </label>
                  <textarea
                    id="customer-address"
                    rows={3}
                    className={`form-textarea ${formErrors.address ? 'is-invalid' : ''}`}
                    placeholder="House / Flat No., Apartment Name, Street, Landmark"
                    value={customerDetails.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    autoComplete="street-address"
                    required
                  />
                  {formErrors.address && (
                    <span className="field-error-msg">{formErrors.address}</span>
                  )}
                </div>

                {/* Two Column Row: Town and PIN code */}
                <div className="form-row-two-col">
                  {/* Village / Town */}
                  <div className="form-group">
                    <label htmlFor="customer-town" className="form-label">
                      <span>Village / Town / City <span className="required-star">*</span></span>
                    </label>
                    <input
                      id="customer-town"
                      type="text"
                      className={`form-input ${formErrors.town ? 'is-invalid' : ''}`}
                      placeholder="e.g., Vijayawada"
                      value={customerDetails.town}
                      onChange={(e) => handleFieldChange('town', e.target.value)}
                      autoComplete="address-level2"
                      required
                    />
                    {formErrors.town && (
                      <span className="field-error-msg">{formErrors.town}</span>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div className="form-group">
                    <label htmlFor="customer-pincode" className="form-label">
                      <span>PIN Code <span className="required-star">*</span></span>
                    </label>
                    <input
                      id="customer-pincode"
                      type="text"
                      className={`form-input ${formErrors.pincode ? 'is-invalid' : ''}`}
                      placeholder="520001"
                      maxLength={6}
                      value={customerDetails.pincode}
                      onChange={(e) => handleFieldChange('pincode', e.target.value.replace(/\D/g, ''))}
                      autoComplete="postal-code"
                      required
                    />
                    {formErrors.pincode && (
                      <span className="field-error-msg">{formErrors.pincode}</span>
                    )}
                  </div>
                </div>

                {/* Optional Order Notes */}
                <div className="form-group">
                  <label htmlFor="customer-notes" className="form-label">
                    <FileText size={15} />
                    <span>Special Notes or Instructions (Optional)</span>
                  </label>
                  <textarea
                    id="customer-notes"
                    rows={2}
                    className="form-textarea"
                    placeholder="e.g., Extra spicy batch if available, please handle with care for courier"
                    value={customerDetails.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                  />
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: ORDER SUMMARY & WHATSAPP CHECKOUT */}
          {/* ========================================================= */}
          {checkoutStep === 'summary' && (
            <div className="cart-summary-container">
              <div className="summary-section-box">
                <div className="summary-box-header">
                  <h4 className="summary-box-title">
                    <User size={16} />
                    <span>Customer & Delivery Details</span>
                  </h4>
                  <button
                    type="button"
                    className="edit-details-link"
                    onClick={() => setCheckoutStep('details')}
                  >
                    Edit
                  </button>
                </div>
                <div className="summary-customer-grid">
                  <div>
                    <span className="summary-label">Name:</span>
                    <span className="summary-value">{customerDetails.name}</span>
                  </div>
                  <div>
                    <span className="summary-label">WhatsApp:</span>
                    <span className="summary-value">+91 {customerDetails.phone}</span>
                  </div>
                  <div className="grid-full-width">
                    <span className="summary-label">Address:</span>
                    <span className="summary-value">{customerDetails.address}</span>
                  </div>
                  <div>
                    <span className="summary-label">Town/City:</span>
                    <span className="summary-value">{customerDetails.town}</span>
                  </div>
                  <div>
                    <span className="summary-label">PIN Code:</span>
                    <span className="summary-value">{customerDetails.pincode}</span>
                  </div>
                  {customerDetails.notes && (
                    <div className="grid-full-width">
                      <span className="summary-label">Notes:</span>
                      <span className="summary-value notes-text">{customerDetails.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="summary-section-box">
                <div className="summary-box-header">
                  <h4 className="summary-box-title">
                    <ShoppingBag size={16} />
                    <span>Selected Items ({totalItemsCount})</span>
                  </h4>
                  <button
                    type="button"
                    className="edit-details-link"
                    onClick={() => setCheckoutStep('cart')}
                  >
                    Edit Items
                  </button>
                </div>

                <div className="summary-items-list">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${item.weight}`} className="summary-item-row">
                      <div className="summary-item-info">
                        <span className="summary-item-num">{idx + 1}.</span>
                        <div>
                          <strong className="summary-item-name">{item.name}</strong>
                          <span className="summary-item-weight">({item.weight})</span>
                        </div>
                      </div>
                      <div className="summary-item-calc">
                        <span className="summary-item-qty">{item.quantity} × {formatRupee(item.price)}</span>
                        <strong className="summary-item-total">{formatRupee(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown Box */}
              <div className="summary-section-box">
                <div className="summary-box-header">
                  <h4 className="summary-box-title">
                    <FileText size={16} />
                    <span>Price Breakdown</span>
                  </h4>
                </div>
                <div className="summary-pricing-rows">
                  <div className="summary-pricing-row">
                    <span className="summary-label">Subtotal:</span>
                    <strong className="summary-value">{formatRupee(subtotal)}</strong>
                  </div>
                  <div className="summary-pricing-row">
                    <span className="summary-label">Delivery Charges:</span>
                    <span className="delivery-pending-text">To be confirmed (according to area/range)</span>
                  </div>
                  <div className="summary-pricing-row summary-total-row">
                    <span className="summary-label">Estimated Total:</span>
                    <div className="summary-total-calc">
                      <strong className="summary-value estimated-total-value">
                        {formatRupee(subtotal)} + delivery charges
                      </strong>
                      <span className="estimated-tag">(to be confirmed by our team)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="whatsapp-flow-explanation">
                <MessageCircle size={20} className="wa-flow-icon" />
                <div>
                  <strong>How WhatsApp Ordering Works</strong>
                  <p>
                    Clicking below will format your complete order and open our verified WhatsApp chat with <strong>{BUSINESS_CONFIG.displayPhone}</strong>. You will review and tap <strong>Send</strong> in WhatsApp. Our team will verify fresh batch stock and confirm delivery charges for your PIN code.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: WHATSAPP OPENED / POST-ACTION SCREEN */}
          {/* ========================================================= */}
          {checkoutStep === 'sent' && (
            <div className="cart-sent-container">
              <div className="sent-badge-wrap">
                <CheckCircle2 size={56} className="sent-check-icon" />
              </div>
              <h3 className="sent-title">WhatsApp Chat Opened!</h3>
              <p className="sent-subtitle">
                Please make sure to tap <strong>Send</strong> inside your WhatsApp app to share your order with Andhra Avakaya.
              </p>

              {popupBlocked && (
                <div className="popup-blocked-card" role="alert">
                  <AlertCircle size={20} className="warning-icon" />
                  <div>
                    <strong>Pop-up window was blocked?</strong>
                    <p>Click the button below to directly open WhatsApp.</p>
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp retry-wa-btn"
                    >
                      <ExternalLink size={16} />
                      <span>Open WhatsApp Chat Directly</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="sent-info-card">
                <Clock size={18} className="sent-info-icon" />
                <div>
                  <strong>What happens next?</strong>
                  <p>
                    1. Tap Send in WhatsApp.<br />
                    2. We will check today’s fresh batch stock.<br />
                    3. We will quote courier/delivery charges for PIN {customerDetails.pincode}.<br />
                    4. Settle payment via UPI or Cash on Delivery upon mutual confirmation.
                  </p>
                </div>
              </div>

              <div className="sent-actions-group">
                <button
                  type="button"
                  className="btn btn-secondary sent-keep-cart-btn"
                  onClick={closeCart}
                >
                  <span>Keep Cart & Continue Browsing</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary sent-clear-cart-btn"
                  onClick={() => {
                    clearCart();
                    closeCart();
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Order Placed? Clear Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer (Step Controls & Action Buttons) */}
        {cartItems.length > 0 && checkoutStep !== 'sent' && (
          <div className="cart-drawer-footer">
            {/* Price Calculations */}
            <div className="cart-pricing-breakdown">
              <div className="price-row">
                <span className="price-name">Subtotal</span>
                <span className="price-amount">{formatRupee(subtotal)}</span>
              </div>
              <div className="price-row delivery-note-row">
                <span className="price-name">Delivery Charges</span>
                <span className="price-tag-badge">To be confirmed (according to area/range)</span>
              </div>
              <div className="price-row total-row total-row-pending">
                <div className="total-title-block">
                  <span className="price-name">Estimated Total</span>
                  <span className="total-sub-note">
                    (according to area/range; our team will confirm)
                  </span>
                </div>
                <span className="price-amount total-highlight">
                  {formatRupee(subtotal)} + Delivery Charges
                </span>
              </div>
            </div>

            {/* Action Buttons based on current step */}
            <div className="cart-footer-actions">
              {checkoutStep === 'cart' && (
                <button
                  type="button"
                  className="btn btn-primary cart-proceed-btn"
                  onClick={handleProceedToDetails}
                  disabled={hasUnavailableItems}
                  id="cart-proceed-btn"
                >
                  <span>Proceed & Next</span>
                  <ArrowRight size={18} />
                </button>
              )}

              {checkoutStep === 'details' && (
                <div className="two-button-row">
                  <button
                    type="button"
                    className="btn btn-secondary back-step-btn"
                    onClick={() => setCheckoutStep('cart')}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Cart</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary continue-step-btn"
                    onClick={handleProceedToSummary}
                    id="cart-details-continue-btn"
                  >
                    <span>Review Order</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {checkoutStep === 'summary' && (
                <div className="two-button-row">
                  <button
                    type="button"
                    className="btn btn-secondary back-step-btn"
                    onClick={() => setCheckoutStep('details')}
                  >
                    <ArrowLeft size={16} />
                    <span>Edit Details</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-whatsapp place-order-wa-btn"
                    onClick={handlePlaceOrderWhatsApp}
                    disabled={isSubmitting || hasUnavailableItems}
                    id="place-order-whatsapp-btn"
                  >
                    <MessageCircle size={20} />
                    <span>{isSubmitting ? 'Preparing WhatsApp...' : 'Place Order on WhatsApp'}</span>
                  </button>
                </div>
              )}
            </div>

            <p className="cart-guarantee-note">
              🔒 Authentic Andhra recipes • Handcrafted in small batches • No online payment required upfront
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
