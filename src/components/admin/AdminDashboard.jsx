import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Ban,
  Search,
  Save,
  RotateCw,
  LogOut,
  ExternalLink,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  FileEdit
} from 'lucide-react';
import { PRODUCTS, formatRupee } from '../../data/products';
import { BUSINESS_CONFIG } from '../../config/business';

export default function AdminDashboard({ onLogout, onNavigateHome }) {
  // Live server stock state: { [id]: { inStock: boolean, note: string, updatedAt: string } }
  const [serverStock, setServerStock] = useState({});
  // Draft edits working copy: { [id]: { inStock: boolean, note: string } }
  const [draftStock, setDraftStock] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'instock' | 'outofstock'

  // Confirmation Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'save' | 'bulk-in' | 'bulk-out'

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Show transient toast
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
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
      if (data?.stock) {
        setServerStock(data.stock);
        // Reset draft copy to match server
        const cleanDraft = {};
        for (const [id, val] of Object.entries(data.stock)) {
          cleanDraft[id] = {
            inStock: val.inStock !== false,
            note: val.note || ''
          };
        }
        setDraftStock(cleanDraft);
        setLastSavedTime(new Date());
      }
    } catch (err) {
      console.error('Error fetching stock:', err);
      showToast('Error loading live stock: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentStock();
  }, []);

  // Compute unsaved changes count and diff
  const changedProductIds = useMemo(() => {
    const changed = [];
    for (const product of PRODUCTS) {
      const id = product.id;
      const s = serverStock[id] || { inStock: true, note: '' };
      const d = draftStock[id] || { inStock: true, note: '' };
      const statusChanged = (s.inStock !== false) !== (d.inStock !== false);
      const noteChanged = (s.note || '').trim() !== (d.note || '').trim();
      if (statusChanged || noteChanged) {
        changed.push(id);
      }
    }
    return changed;
  }, [serverStock, draftStock]);

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

  // Mark all currently filtered products
  const handleBulkSetStatus = (inStockTarget) => {
    setDraftStock((prev) => {
      const updated = { ...prev };
      for (const product of filteredProducts) {
        const cur = updated[product.id] || { inStock: true, note: '' };
        updated[product.id] = {
          ...cur,
          inStock: inStockTarget
        };
      }
      return updated;
    });
    setIsConfirmOpen(false);
    showToast(`Marked ${filteredProducts.length} products as ${inStockTarget ? 'In Stock' : 'Out of Stock'}. Click "Save Changes" to apply.`);
  };

  // Save changes to server
  const handleExecuteSave = async () => {
    setIsConfirmOpen(false);
    setIsSaving(true);

    try {
      // Build updates payload for modified products or all products
      const updatesPayload = {};
      for (const id of changedProductIds) {
        updatesPayload[id] = {
          inStock: draftStock[id]?.inStock !== false,
          note: draftStock[id]?.note || ''
        };
      }

      if (Object.keys(updatesPayload).length === 0) {
        showToast('No modifications to save.');
        setIsSaving(false);
        return;
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
        showToast(`✅ Successfully saved availability for ${data.updatedCount || Object.keys(updatesPayload).length} product(s)!`);
      } else {
        throw new Error(data.message || 'Server rejected updates');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Logout handler
  const handleLogoutClick = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    onLogout();
  };

  // Filter products list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Stock status filter
      const inStock = draftStock[product.id]?.inStock !== false;
      if (statusFilter === 'instock' && !inStock) return false;
      if (statusFilter === 'outofstock' && inStock) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesTelugu = product.teluguName?.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        return matchesName || matchesTelugu || matchesCategory;
      }

      return true;
    });
  }, [categoryFilter, statusFilter, searchQuery, draftStock]);

  // Overall statistics
  const totalProductsCount = PRODUCTS.length;
  const inStockCount = useMemo(() => {
    return PRODUCTS.filter((p) => draftStock[p.id]?.inStock !== false).length;
  }, [draftStock]);
  const outOfStockCount = totalProductsCount - inStockCount;

  return (
    <div className="admin-page-wrapper">
      
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-nav-container">
          <div className="admin-brand-left">
            <img
              src={BUSINESS_CONFIG.logoSrc}
              alt="Brand Logo"
              className="admin-nav-logo"
            />
            <div>
              <h1 className="admin-nav-heading">Andhra Avakaya</h1>
              <span className="admin-nav-subheading">Stock & Availability Management</span>
            </div>
          </div>

          <div className="admin-nav-actions">
            {/* Save Changes Button */}
            <button
              type="button"
              id="admin-save-changes-btn"
              disabled={!hasUnsavedChanges || isSaving}
              className={`btn-admin-action btn-admin-primary ${hasUnsavedChanges ? 'has-changes' : ''}`}
              onClick={() => {
                setConfirmAction('save');
                setIsConfirmOpen(true);
              }}
            >
              <Save size={16} />
              <span>
                {isSaving
                  ? 'Saving...'
                  : hasUnsavedChanges
                  ? `Save Changes (${changedProductIds.length})`
                  : 'Changes Saved'}
              </span>
            </button>

            {/* Refresh from Server */}
            <button
              type="button"
              className="btn-admin-action btn-admin-secondary"
              onClick={() => fetchCurrentStock(false)}
              disabled={isLoading || isSaving}
              title="Reload live stock data from server"
            >
              <RotateCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            {/* Return to Public Store */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="btn-admin-action btn-admin-secondary"
              title="View public customer website"
            >
              <ExternalLink size={15} />
              <span>View Store</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="btn-admin-action btn-admin-danger"
              id="admin-logout-btn"
              title="Log out of admin session"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="admin-main-content">
        
        {/* Top Summary Stats Bar */}
        <section className="admin-stats-grid" aria-label="Catalog Summary Statistics">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Total Products</div>
              <div className="admin-stat-number">{totalProductsCount}</div>
            </div>
            <div className="admin-stat-icon-pill pill-total">
              <Sparkles size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">In Stock</div>
              <div className="admin-stat-number" style={{ color: '#059669' }}>
                {inStockCount}
              </div>
            </div>
            <div className="admin-stat-icon-pill pill-instock">
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Out of Stock</div>
              <div className="admin-stat-number" style={{ color: '#DC2626' }}>
                {outOfStockCount}
              </div>
            </div>
            <div className="admin-stat-icon-pill pill-outofstock">
              <Ban size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Unsaved Edits</div>
              <div className="admin-stat-number" style={{ color: hasUnsavedChanges ? '#D97706' : '#6B7280' }}>
                {changedProductIds.length}
              </div>
            </div>
            <div className="admin-stat-icon-pill pill-unsaved">
              <FileEdit size={24} />
            </div>
          </div>
        </section>

        {/* Controls Toolbar: Search, Filters & Bulk Actions */}
        <section className="admin-controls-card">
          <div className="admin-controls-top-row">
            {/* Search Box */}
            <div className="admin-search-wrap">
              <Search size={18} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search products by English or Telugu name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="admin-search-input"
              />
            </div>

            {/* Bulk Set Helpers for filtered items */}
            <div className="admin-bulk-actions">
              <span className="admin-filter-label">Quick Action (Filtered):</span>
              <button
                type="button"
                className="btn-bulk-action btn-bulk-instock"
                onClick={() => {
                  setConfirmAction('bulk-in');
                  setIsConfirmOpen(true);
                }}
              >
                Mark All In Stock
              </button>
              <button
                type="button"
                className="btn-bulk-action btn-bulk-outofstock"
                onClick={() => {
                  setConfirmAction('bulk-out');
                  setIsConfirmOpen(true);
                }}
              >
                Mark All Out of Stock
              </button>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="admin-filter-groups-row">
            {/* Category Filter */}
            <div className="admin-filter-group">
              <span className="admin-filter-label">Category:</span>
              <button
                type="button"
                className={`admin-filter-pill ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All ({totalProductsCount})
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${categoryFilter === 'veg' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('veg')}
              >
                🌱 Veg Pickles (9)
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${categoryFilter === 'non-veg' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('non-veg')}
              >
                🍗 Non Veg Pickles (11)
              </button>
            </div>

            {/* Status Filter */}
            <div className="admin-filter-group">
              <span className="admin-filter-label">Stock Status:</span>
              <button
                type="button"
                className={`admin-filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${statusFilter === 'instock' ? 'active' : ''}`}
                onClick={() => setStatusFilter('instock')}
              >
                In Stock ({inStockCount})
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${statusFilter === 'outofstock' ? 'active' : ''}`}
                onClick={() => setStatusFilter('outofstock')}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>
        </section>

        {/* Products Table Card */}
        <section className="admin-table-container">
          <div className="admin-table-header">
            <h2 className="admin-table-title">
              <span>Pickle Inventory Catalog</span>
              <span className="admin-table-counter">
                (Showing {filteredProducts.length} of {totalProductsCount} products)
              </span>
            </h2>

            {lastSavedTime && (
              <span style={{ fontSize: '0.8rem', color: '#8C7A6B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                <span>Last updated: {lastSavedTime.toLocaleTimeString()}</span>
              </span>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-stock-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Base Menu Price</th>
                  <th style={{ width: '220px' }}>Availability Status</th>
                  <th>Stock Note (Optional)</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const draft = draftStock[product.id] || { inStock: true, note: '' };
                  const server = serverStock[product.id] || { inStock: true, note: '' };
                  const isChanged = (draft.inStock !== (server.inStock !== false)) ||
                                    ((draft.note || '').trim() !== (server.note || '').trim());
                  const inStock = draft.inStock;

                  return (
                    <tr key={product.id} className={isChanged ? 'row-changed' : ''}>
                      {/* Index */}
                      <td style={{ color: '#8C7A6B', fontWeight: 600 }}>{idx + 1}</td>

                      {/* Product identity */}
                      <td>
                        <div className="product-cell-wrap">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="table-product-thumb"
                            width="52"
                            height="52"
                            loading="lazy"
                          />
                          <div className="table-product-info">
                            <span className="table-product-name">{product.name}</span>
                            <span className="table-product-telugu">{product.teluguName}</span>
                            {isChanged && (
                              <span className="unsaved-row-indicator">
                                <FileEdit size={11} />
                                <span>Unsaved Edits</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className={`category-tag ${product.category === 'veg' ? 'tag-veg' : 'tag-non-veg'}`}>
                          {product.category === 'veg' ? '🌱 Veg' : '🍗 Non-Veg'}
                        </span>
                      </td>

                      {/* Reference Price */}
                      <td>
                        <span className="table-price-text">
                          {formatRupee(product.menuReferencePrice)}
                        </span>
                        <span className="table-price-unit">
                          {' '}/ {product.pricingBasis}
                        </span>
                      </td>

                      {/* Availability Toggle Switch */}
                      <td>
                        <div className="toggle-switch-wrap">
                          <label className="stock-toggle-switch" htmlFor={`toggle-${product.id}`}>
                            <input
                              type="checkbox"
                              id={`toggle-${product.id}`}
                              checked={inStock}
                              onChange={() => handleToggleStock(product.id)}
                              aria-label={`Toggle availability for ${product.name}`}
                            />
                            <span className="slider-round" />
                          </label>

                          <span className={`status-pill-badge ${inStock ? 'badge-instock-active' : 'badge-outofstock-active'}`}>
                            {inStock ? (
                              <>
                                <CheckCircle2 size={13} />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <Ban size={13} />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Optional Note */}
                      <td>
                        <input
                          type="text"
                          className="table-note-input"
                          placeholder="e.g. Expected tomorrow"
                          value={draft.note || ''}
                          onChange={(e) => handleNoteChange(product.id, e.target.value)}
                          maxLength={120}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsConfirmOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              <AlertTriangle size={22} className="text-chilli" />
              <span>
                {confirmAction === 'save'
                  ? 'Confirm Stock Changes'
                  : confirmAction === 'bulk-in'
                  ? 'Bulk Mark In Stock'
                  : 'Bulk Mark Out of Stock'}
              </span>
            </h3>

            <p className="admin-modal-desc">
              {confirmAction === 'save'
                ? `You have modified availability or notes for ${changedProductIds.length} product(s). Saving will immediately update the live public website.`
                : confirmAction === 'bulk-in'
                ? `This will mark all ${filteredProducts.length} currently filtered products as In Stock in your draft.`
                : `This will mark all ${filteredProducts.length} currently filtered products as Out of Stock in your draft.`}
            </p>

            {confirmAction === 'save' && (
              <div className="admin-modal-summary">
                <strong>Modified Items ({changedProductIds.length}):</strong>
                <ul style={{ margin: '0.4rem 0 0 1.25rem', padding: 0, maxHeight: '120px', overflowY: 'auto' }}>
                  {changedProductIds.map((id) => {
                    const prod = PRODUCTS.find((p) => p.id === id);
                    const isNowInStock = draftStock[id]?.inStock !== false;
                    return (
                      <li key={id} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                        {prod?.name}: <strong style={{ color: isNowInStock ? '#059669' : '#DC2626' }}>
                          {isNowInStock ? 'In Stock' : 'Out of Stock'}
                        </strong>
                        {draftStock[id]?.note && <span> ({draftStock[id].note})</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="admin-modal-buttons">
              <button
                type="button"
                className="btn-admin-action btn-admin-secondary"
                onClick={() => setIsConfirmOpen(false)}
              >
                <X size={15} />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                className="btn-admin-action btn-admin-primary"
                id="admin-modal-confirm-btn"
                onClick={() => {
                  if (confirmAction === 'save') {
                    handleExecuteSave();
                  } else if (confirmAction === 'bulk-in') {
                    handleBulkSetStatus(true);
                  } else if (confirmAction === 'bulk-out') {
                    handleBulkSetStatus(false);
                  }
                }}
              >
                <Check size={15} />
                <span>Confirm & Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className={`admin-status-toast ${toastMessage.type === 'error' ? 'toast-error' : 'toast-success'}`} role="status">
          {toastMessage.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
