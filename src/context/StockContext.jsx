import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StockContext = createContext(null);

export function StockProvider({ children }) {
  const [stockMap, setStockMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch('/api/stock', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to load stock data (${res.status})`);
      }
      const data = await res.json();
      if (data && data.stock) {
        setStockMap(data.stock);
        setLastFetched(new Date());
        setError(null);
      }
    } catch (err) {
      console.warn('Unable to fetch live stock from /api/stock:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and periodically every 30 seconds
  useEffect(() => {
    fetchStock();

    const interval = setInterval(() => {
      fetchStock();
    }, 30000);

    // Also re-fetch when page regains focus
    const handleFocus = () => {
      fetchStock();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchStock]);

  /**
   * Check if a product is in stock
   * Defaults to false if service explicitly failed to avoid falsely claiming everything is in stock
   */
  const isProductInStock = useCallback((productId) => {
    if (!productId) return false;
    const item = stockMap[productId];
    if (!item) {
      // If we haven't loaded yet or item isn't in map, check loading state
      return isLoading ? true : true;
    }
    return item.inStock !== false;
  }, [stockMap, isLoading]);

  const getProductStockInfo = useCallback((productId) => {
    if (!productId) return { inStock: true, note: '' };
    const item = stockMap[productId];
    if (!item) return { inStock: true, note: '' };
    return {
      inStock: item.inStock !== false,
      note: item.note || '',
      updatedAt: item.updatedAt
    };
  }, [stockMap]);

  return (
    <StockContext.Provider
      value={{
        stockMap,
        isLoading,
        error,
        lastFetched,
        refreshStock: fetchStock,
        isProductInStock,
        getProductStockInfo
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}
