import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Ban,
  Search,
  Save,
  RotateCw,
  LogOut,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Check,
  Filter,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { PRODUCTS, formatRupee } from '../../data/products';
import { BUSINESS_CONFIG } from '../../config/business';
import { useStock } from '../../context/StockContext';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const { refreshStock, getProductImage, setProductImageLocally } = useStock();

  // Server state & draft working state
  const [serverStock, setServerStock] = useState({});
  const [draftStock, setDraftStock] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all'); // 'all' | 'instock' | 'outofstock'

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null); // { text, type: 'success' | 'error' }

  // Product Image Editing Dialog State
  const [editingProduct, setEditingProduct] = useState(null);
  const [stagedFile, setStagedFile] = useState(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Image editing dialog handlers
  const handleOpenImageDialog = (product) => {
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setEditingProduct(product);
    setStagedFile(null);
    setStagedPreviewUrl(null);
    setValidationError(null);
  };

  const handleCloseImageDialog = () => {
    if (isUploadingImage) return;
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setEditingProduct(null);
    setStagedFile(null);
    setStagedPreviewUrl(null);
    setValidationError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);

    // 1. Validate file format
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();

    if (!validMimes.includes(file.type?.toLowerCase()) && !validExtensions.includes(ext)) {
      setStagedFile(null);
      setStagedPreviewUrl(null);
      setValidationError(`Unsupported file format "${ext}". Please choose a JPG, JPEG, PNG, or WebP image.`);
      return;
    }

    // 2. Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setStagedFile(null);
      setStagedPreviewUrl(null);
      setValidationError(`Image size (${sizeMb} MB) exceeds the 5 MB limit. Please select a smaller image.`);
      return;
    }

    setValidationError(null);
    setStagedFile(file);
    setStagedPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveImage = () => {
    if (!editingProduct || !stagedFile || validationError || isUploadingImage) return;

    setIsUploadingImage(true);
    const reader = new FileReader();

    reader.onerror = () => {
      showToast('Failed to read image file from your computer', 'error');
      setIsUploadingImage(false);
    };

    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch('/api/admin/product-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: editingProduct.id,
            fileData: base64Data,
            mimeType: stagedFile.type || 'image/jpeg'
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Image upload failed');
        }

        // Update local context for instant storefront reactivity
        if (setProductImageLocally) {
          setProductImageLocally(editingProduct.id, data.imageUrl);
        }

        showToast(`✅ Successfully updated image for "${editingProduct.name}"!`);
        handleCloseImageDialog();
        fetchCurrentStock(true);
      } catch (err) {
        console.error('Image upload error:', err);
        showToast(`Upload failed: ${err.message}`, 'error');
      } finally {
        setIsUploadingImage(false);
      }
    };

    reader.readAsDataURL(stagedFile);
  };

  // Fetch current stock from server
  const fetchCurrentStock = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const res = await fetch('/api/stock', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch stock from server');
      const data = await res.json();
      if (data && data.stock) {
        setServerStock(data.stock);
        // Initialize draft copy matching server
        const initialDraft = {};
        for (const p of PRODUCTS) {
          const current = data.stock[p.id] || { inStock: true, note: '' };
          initialDraft[p.id] = {
            inStock: current.inStock !== false,
            note: current.note || current.stock_note || ''
          };
        }
        setDraftStock(initialDraft);
      }
    } catch (err) {
      console.error('Failed to load stock in dashboard:', err);
      showToast('Could not load stock: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCurrentStock();
    }
  }, [isOpen]);

  // Compute unsaved changes count
  const changedProductIds = useMemo(() => {
    const changed = [];
    for (const p of PRODUCTS) {
      const draft = draftStock[p.id];
      const server = serverStock[p.id] || { inStock: true, note: '' };
      if (!draft) continue;
      const stockChanged = (draft.inStock !== false) !== (server.inStock !== false);
      const noteChanged = (draft.note || '').trim() !== (server.note || '').trim();
      if (stockChanged || noteChanged) {
        changed.push(p.id);
      }
    }
    return changed;
  }, [draftStock, serverStock]);

  const hasUnsavedChanges = changedProductIds.length > 0;

  // Toggle single product stock status
  const handleToggleStock = (productId) => {
    setDraftStock((prev) => {
      const current = prev[productId] || { inStock: true, note: '' };
      return {
        ...prev,
        [productId]: {
          ...current,
          inStock: !current.inStock
        }
      };
    });
  };

  // Update note for product
  const handleNoteChange = (productId, newNote) => {
    setDraftStock((prev) => {
      const current = prev[productId] || { inStock: true, note: '' };
      return {
        ...prev,
        [productId]: {
          ...current,
          note: newNote
        }
      };
    });
  };

  // Bulk toggle for a specific category
  const handleBulkSetCategory = (category, inStockValue) => {
    const targetProducts = PRODUCTS.filter((p) => p.category === category);
    setDraftStock((prev) => {
      const updated = { ...prev };
      for (const p of targetProducts) {
        updated[p.id] = {
          ...(updated[p.id] || {}),
          inStock: inStockValue
        };
      }
      return updated;
    });
    showToast(`Marked all ${category === 'veg' ? 'Veg' : 'Non-Veg'} pickles as ${inStockValue ? 'In Stock' : 'Out of Stock'}. Click "Save Changes" to apply.`);
  };

  // Save changes to backend persistent store
  const handleSaveStock = async () => {
    setIsSaving(true);
    try {
      const updatesPayload = {};
      // Include all changed items or all items
      for (const p of PRODUCTS) {
        const draft = draftStock[p.id] || { inStock: true, note: '' };
        updatesPayload[p.id] = {
          inStock: draft.inStock !== false,
          note: (draft.note || '').trim()
        };
      }

      const res = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates: updatesPayload })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setServerStock(data.stock);
        setLastSavedTime(new Date());
        // Immediately refresh public store context!
        await refreshStock();
        showToast('✅ Inventory successfully updated and synced with the public website!');
      } else {
        throw new Error(data.message || 'Server rejected updates');
      }
    } catch (err) {
      console.error('Failed to save stock:', err);
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Logout
  const handleLogoutClick = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    onLogout();
  };

  if (!isOpen) return null;

  // Filter products based on search query & status filter
  const filterProduct = (product) => {
    const draft = draftStock[product.id] || { inStock: true, note: '' };
    const inStock = draft.inStock !== false;

    if (stockStatusFilter === 'instock' && !inStock) return false;
    if (stockStatusFilter === 'outofstock' && inStock) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchTelugu = product.teluguName?.toLowerCase().includes(q);
      return matchName || matchTelugu;
    }
    return true;
  };

  const vegProducts = PRODUCTS.filter((p) => p.category === 'veg' && filterProduct(p));
  const nonVegProducts = PRODUCTS.filter((p) => p.category === 'non-veg' && filterProduct(p));

  const totalVeg = PRODUCTS.filter((p) => p.category === 'veg').length;
  const totalNonVeg = PRODUCTS.filter((p) => p.category === 'non-veg').length;

  return (
    <div
      className="admin-dashboard-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-modal-title"
    >
      <div className="admin-dashboard-modal-card">
        {/* Sticky Header */}
        <header className="admin-dash-modal-header">
          <div className="admin-dash-brand">
            <img
              src={BUSINESS_CONFIG.logoSrc}
              alt="Logo"
              className="admin-dash-logo"
              width="44"
              height="44"
            />
            <div>
              <h1 id="admin-dashboard-modal-title" className="admin-dash-title">
                Admin Dashboard
              </h1>
              <span className="admin-dash-subtitle">
                Stock & Availability Management (20 Products)
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="admin-dash-actions">
            {/* Save Changes Button */}
            <button
              type="button"
              id="admin-dash-save-btn"
              disabled={isSaving}
              className={`btn-dash-save ${hasUnsavedChanges ? 'is-dirty' : ''}`}
              onClick={handleSaveStock}
              title="Save availability changes to persistent store"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>
                    {hasUnsavedChanges
                      ? `Save Changes (${changedProductIds.length})`
                      : 'Save All Changes'}
                  </span>
                </>
              )}
            </button>

            {/* Reload Data Button */}
            <button
              type="button"
              className="btn-dash-icon"
              onClick={() => fetchCurrentStock(false)}
              disabled={isLoading || isSaving}
              title="Refresh stock from server"
              aria-label="Refresh stock"
            >
              <RotateCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="btn-dash-logout"
              id="admin-dash-logout-btn"
              title="Log out from admin session"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn-dash-close"
              aria-label="Close Admin Dashboard"
              title="Return to website"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Transient Toast Notification */}
        {toastMessage && (
          <div className={`admin-dash-toast toast-${toastMessage.type}`} role="status">
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="admin-dash-modal-body">
          {/* Controls Bar: Search & Status Filters */}
          <div className="admin-dash-controls-bar">
            {/* Search Input */}
            <div className="admin-dash-search-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search pickle by name or Telugu title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-dash-search-input"
                id="admin-dash-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Stock Status Filter Pills */}
            <div className="admin-dash-filter-pills">
              <span className="filter-label">Filter:</span>
              <button
                type="button"
                className={`filter-pill ${stockStatusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStockStatusFilter('all')}
              >
                All (20)
              </button>
              <button
                type="button"
                className={`filter-pill ${stockStatusFilter === 'instock' ? 'active' : ''}`}
                onClick={() => setStockStatusFilter('instock')}
              >
                In Stock
              </button>
              <button
                type="button"
                className={`filter-pill ${stockStatusFilter === 'outofstock' ? 'active' : ''}`}
                onClick={() => setStockStatusFilter('outofstock')}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: VEG PICKLES (9 Products)                            */}
          {/* ============================================================== */}
          <section className="admin-category-section" id="admin-veg-section">
            <div className="admin-category-header">
              <div className="category-title-wrap">
                <span className="category-tag tag-veg">🌱 Vegetarian</span>
                <h2 className="category-title">Veg Pickles ({vegProducts.length} of {totalVeg})</h2>
              </div>
              <div className="category-bulk-actions">
                <span className="bulk-label">Quick Set:</span>
                <button
                  type="button"
                  className="btn-quick-bulk bulk-in"
                  onClick={() => handleBulkSetCategory('veg', true)}
                >
                  All In Stock
                </button>
                <button
                  type="button"
                  className="btn-quick-bulk bulk-out"
                  onClick={() => handleBulkSetCategory('veg', false)}
                >
                  All Out of Stock
                </button>
              </div>
            </div>

            <div className="admin-products-list">
              {vegProducts.map((product) => {
                const draft = draftStock[product.id] || { inStock: true, note: '' };
                const inStock = draft.inStock !== false;

                return (
                  <div
                    key={product.id}
                    className={`admin-item-card ${!inStock ? 'item-out-of-stock' : 'item-in-stock'}`}
                    id={`admin-item-${product.id}`}
                  >
                    {/* Item Thumbnail with Camera/Edit Button */}
                    <div
                      className="item-thumbnail-wrap thumbnail-clickable"
                      onClick={() => handleOpenImageDialog(product)}
                      title={`Click to change image for ${product.name}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenImageDialog(product);
                        }
                      }}
                    >
                      <img
                        src={getProductImage ? (getProductImage(product.id, product.image) || product.image) : product.image}
                        alt={product.name}
                        className="item-thumbnail"
                        loading="lazy"
                        width="80"
                        height="80"
                      />
                      <div className="thumbnail-camera-overlay">
                        <Camera size={15} />
                        <span>Edit</span>
                      </div>
                      <span className={`status-pill ${inStock ? 'pill-in' : 'pill-out'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Item Info */}
                    <div className="item-info-col">
                      <div className="item-names">
                        <span className="item-telugu-name">{product.teluguName}</span>
                        <h3 className="item-name">{product.name}</h3>
                      </div>

                      {/* Reference Pricing and Quantity Options */}
                      <div className="item-pricing-row">
                        <span className="item-ref-price">
                          <strong>Reference:</strong> {product.priceDisplay || `₹${product.menuReferencePrice}/kg`}
                        </span>
                        <div className="item-quantities">
                          <span className="qty-tag">250 g: {formatRupee(product.prices['250 g'])}</span>
                          <span className="qty-tag">500 g: {formatRupee(product.prices['500 g'])}</span>
                          <span className="qty-tag">1 kg: {formatRupee(product.prices['1 kg'])}</span>
                        </div>
                      </div>

                      {/* Optional Stock Note Field */}
                      <div className="item-note-row">
                        <input
                          type="text"
                          placeholder="Stock note (e.g. Expected tomorrow, Fresh batch, etc.)"
                          value={draft.note || ''}
                          onChange={(e) => handleNoteChange(product.id, e.target.value)}
                          className="item-note-input"
                        />
                      </div>
                    </div>

                    {/* Stock Status Control Toggle */}
                    <div className="item-toggle-col">
                      <div className="toggle-switch-group">
                        <button
                          type="button"
                          className={`btn-toggle-status ${inStock ? 'is-active-in' : ''}`}
                          onClick={() => !inStock && handleToggleStock(product.id)}
                          aria-pressed={inStock}
                        >
                          <CheckCircle2 size={15} />
                          <span>In Stock</span>
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-status ${!inStock ? 'is-active-out' : ''}`}
                          onClick={() => inStock && handleToggleStock(product.id)}
                          aria-pressed={!inStock}
                        >
                          <Ban size={15} />
                          <span>Out of Stock</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: NON-VEG PICKLES (11 Products)                       */}
          {/* ============================================================== */}
          <section className="admin-category-section" id="admin-non-veg-section">
            <div className="admin-category-header">
              <div className="category-title-wrap">
                <span className="category-tag tag-nonveg">🍗 Non-Vegetarian</span>
                <h2 className="category-title">Non-Veg Pickles ({nonVegProducts.length} of {totalNonVeg})</h2>
              </div>
              <div className="category-bulk-actions">
                <span className="bulk-label">Quick Set:</span>
                <button
                  type="button"
                  className="btn-quick-bulk bulk-in"
                  onClick={() => handleBulkSetCategory('non-veg', true)}
                >
                  All In Stock
                </button>
                <button
                  type="button"
                  className="btn-quick-bulk bulk-out"
                  onClick={() => handleBulkSetCategory('non-veg', false)}
                >
                  All Out of Stock
                </button>
              </div>
            </div>

            <div className="admin-products-list">
              {nonVegProducts.map((product) => {
                const draft = draftStock[product.id] || { inStock: true, note: '' };
                const inStock = draft.inStock !== false;

                return (
                  <div
                    key={product.id}
                    className={`admin-item-card ${!inStock ? 'item-out-of-stock' : 'item-in-stock'}`}
                    id={`admin-item-${product.id}`}
                  >
                    {/* Item Thumbnail with Camera/Edit Button */}
                    <div
                      className="item-thumbnail-wrap thumbnail-clickable"
                      onClick={() => handleOpenImageDialog(product)}
                      title={`Click to change image for ${product.name}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenImageDialog(product);
                        }
                      }}
                    >
                      <img
                        src={getProductImage ? (getProductImage(product.id, product.image) || product.image) : product.image}
                        alt={product.name}
                        className="item-thumbnail"
                        loading="lazy"
                        width="80"
                        height="80"
                      />
                      <div className="thumbnail-camera-overlay">
                        <Camera size={15} />
                        <span>Edit</span>
                      </div>
                      <span className={`status-pill ${inStock ? 'pill-in' : 'pill-out'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Item Info */}
                    <div className="item-info-col">
                      <div className="item-names">
                        <span className="item-telugu-name">{product.teluguName}</span>
                        <h3 className="item-name">{product.name}</h3>
                      </div>

                      {/* Reference Pricing and Quantity Options */}
                      <div className="item-pricing-row">
                        <span className="item-ref-price">
                          <strong>Reference:</strong> {product.priceDisplay || `₹${product.menuReferencePrice}/500 g`}
                        </span>
                        <div className="item-quantities">
                          <span className="qty-tag">250 g: {formatRupee(product.prices['250 g'])}</span>
                          <span className="qty-tag">500 g: {formatRupee(product.prices['500 g'])}</span>
                          <span className="qty-tag">1 kg: {formatRupee(product.prices['1 kg'])}</span>
                        </div>
                      </div>

                      {/* Optional Stock Note Field */}
                      <div className="item-note-row">
                        <input
                          type="text"
                          placeholder="Stock note (e.g. Fresh batch arriving tomorrow, Sold out, etc.)"
                          value={draft.note || ''}
                          onChange={(e) => handleNoteChange(product.id, e.target.value)}
                          className="item-note-input"
                        />
                      </div>
                    </div>

                    {/* Stock Status Control Toggle */}
                    <div className="item-toggle-col">
                      <div className="toggle-switch-group">
                        <button
                          type="button"
                          className={`btn-toggle-status ${inStock ? 'is-active-in' : ''}`}
                          onClick={() => !inStock && handleToggleStock(product.id)}
                          aria-pressed={inStock}
                        >
                          <CheckCircle2 size={15} />
                          <span>In Stock</span>
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-status ${!inStock ? 'is-active-out' : ''}`}
                          onClick={() => inStock && handleToggleStock(product.id)}
                          aria-pressed={!inStock}
                        >
                          <Ban size={15} />
                          <span>Out of Stock</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer info bar */}
        <footer className="admin-dash-modal-footer">
          <div className="footer-status-text">
            <span>Andhra Avakaya Inventory • Authenticated Admin: <strong>uday</strong></span>
            {lastSavedTime && (
              <span className="last-saved-tag">
                <Clock size={13} />
                <span>Last saved: {lastSavedTime.toLocaleTimeString()}</span>
              </span>
            )}
          </div>
          <div className="footer-actions">
            <button
              type="button"
              className="btn-dash-save-bottom"
              onClick={handleSaveStock}
              disabled={isSaving}
            >
              <Save size={15} />
              <span>{hasUnsavedChanges ? `Save (${changedProductIds.length} changes)` : 'Save All Changes'}</span>
            </button>
            <button
              type="button"
              className="btn-dash-done"
              onClick={onClose}
            >
              Done & View Store
            </button>
          </div>
        </footer>
      </div>

      {/* ========================================================= */}
      {/* Product Image Editing Dialog                              */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="admin-image-dialog-overlay" onClick={handleCloseImageDialog}>
          <div className="admin-image-dialog-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="image-dialog-header">
              <div>
                <span className="image-dialog-telugu">{editingProduct.teluguName}</span>
                <h3 className="image-dialog-title">Change Product Image</h3>
                <span className="image-dialog-product-name">{editingProduct.name}</span>
              </div>
              <button
                type="button"
                className="btn-dialog-close"
                onClick={handleCloseImageDialog}
                aria-label="Close image edit dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Previews Body */}
            <div className="image-dialog-body">
              <div className="image-previews-grid">
                {/* Current Image */}
                <div className="dialog-preview-col">
                  <span className="preview-label">Current Image</span>
                  <div className="dialog-img-box">
                    <img
                      src={getProductImage ? (getProductImage(editingProduct.id, editingProduct.image) || editingProduct.image) : editingProduct.image}
                      alt={editingProduct.name}
                    />
                  </div>
                </div>

                {/* Replacement Preview */}
                <div className="dialog-preview-col">
                  <span className="preview-label">
                    {stagedPreviewUrl ? 'New Replacement Preview' : 'Selected Replacement'}
                  </span>
                  <div className={`dialog-img-box ${stagedPreviewUrl ? 'has-new-img' : 'placeholder-box'}`}>
                    {stagedPreviewUrl ? (
                      <img src={stagedPreviewUrl} alt="Replacement Preview" />
                    ) : (
                      <div className="dialog-no-file">
                        <ImageIcon size={32} />
                        <span>No new image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Staged File Info */}
              {stagedFile && !validationError && (
                <div className="dialog-file-meta">
                  <span className="meta-filename" title={stagedFile.name}>📁 {stagedFile.name}</span>
                  <span className="meta-filesize">({(stagedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}

              {/* Validation Error Alert */}
              {validationError && (
                <div className="dialog-error-alert" role="alert">
                  <AlertCircle size={16} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* File Picker Row */}
              <div className="dialog-file-picker-row">
                <label htmlFor="modal-image-picker" className="btn-dialog-choose">
                  <Upload size={16} />
                  <span>{stagedFile ? 'Choose Different Image' : 'Choose Image from Computer'}</span>
                </label>
                <input
                  id="modal-image-picker"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <span className="dialog-format-hint">JPG, JPEG, PNG, or WebP (Max 5 MB)</span>
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <div className="image-dialog-footer">
              <button
                type="button"
                className="btn-dialog-cancel"
                onClick={handleCloseImageDialog}
                disabled={isUploadingImage}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-dialog-save"
                onClick={handleSaveImage}
                disabled={!stagedFile || Boolean(validationError) || isUploadingImage}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
