import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useStock } from './StockContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'andhra_avakaya_cart_items_v1';
const CUSTOMER_STORAGE_KEY = 'andhra_avakaya_customer_v1';

const INITIAL_CUSTOMER_DETAILS = {
  name: '',
  phone: '',
  address: '',
  town: '',
  pincode: '',
  notes: ''
};

export function CartProvider({ children }) {
  const { isProductInStock, refreshStock } = useStock();

  // Load persisted cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load cart from localStorage:', err);
    }
    return [];
  });

  // Load persisted customer details from localStorage
  const [customerDetails, setCustomerDetails] = useState(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_CUSTOMER_DETAILS, ...parsed };
        }
      }
    } catch (err) {
      console.warn('Failed to load customer details from localStorage:', err);
    }
    return INITIAL_CUSTOMER_DETAILS;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'details' | 'summary' | 'sent'
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  // Persist customer details to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerDetails));
    } catch (err) {
      console.warn('Failed to save customer details to localStorage:', err);
    }
  }, [customerDetails]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isCartOpen]);

  /**
   * Add a product with selected weight to cart
   * Strictly uses authoritative price configured on product for that weight.
   * If same product and weight exists, increases its quantity instead of duplicate line.
   */
  const addToCart = useCallback((product, weight, quantity = 1) => {
    if (!product || !weight) return false;

    // Check stock availability
    if (!isProductInStock(product.id)) {
      return false;
    }

    const price = product.prices ? product.prices[weight] : null;
    if (typeof price !== 'number') {
      console.error(`Missing configured price for product ${product.id} weight ${weight}`);
      return false;
    }

    const itemKey = `${product.id}__${weight}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.weight === weight
      );

      if (existingIndex >= 0) {
        // Increase quantity of existing line
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          lineTotal: price * newQty
        };
        return updated;
      }

      // Add new cart line
      const newItem = {
        key: itemKey,
        id: product.id,
        name: product.name,
        teluguName: product.teluguName || '',
        category: product.category || 'veg',
        image: product.image,
        weight: weight,
        price: price,
        quantity: quantity,
        lineTotal: price * quantity
      };
      return [...prevItems, newItem];
    });

    setLastAddedItem({
      id: product.id,
      name: product.name,
      weight: weight,
      timestamp: Date.now()
    });

    return true;
  }, [isProductInStock]);

  /**
   * Update quantity of an item
   * If newQty <= 0, item is removed from cart.
   */
  const updateQuantity = useCallback((productId, weight, newQty) => {
    setCartItems((prevItems) => {
      if (newQty <= 0) {
        return prevItems.filter(
          (item) => !(item.id === productId && item.weight === weight)
        );
      }
      return prevItems.map((item) => {
        if (item.id === productId && item.weight === weight) {
          const qty = Math.max(1, Math.floor(newQty));
          return {
            ...item,
            quantity: qty,
            lineTotal: item.price * qty
          };
        }
        return item;
      });
    });
  }, []);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback((productId, weight) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && item.weight === weight))
    );
  }, []);

  /**
   * Clear all items from cart and reset step
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCheckoutStep('cart');
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear cart in localStorage:', err);
    }
  }, []);

  /**
   * Open the cart drawer, optionally setting the checkout step
   */
  const openCart = useCallback((step = 'cart') => {
    setCheckoutStep(step);
    setIsCartOpen(true);
  }, []);

  /**
   * Close the cart drawer
   */
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  /**
   * Update customer details
   */
  const updateCustomerDetails = useCallback((fields) => {
    setCustomerDetails((prev) => ({
      ...prev,
      ...fields
    }));
  }, []);

  /**
   * Calculate subtotal & totals strictly from cart items
   */
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  const total = useMemo(() => {
    return subtotal;
  }, [subtotal]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  /**
   * Validate stock for all items currently in cart.
   * Identifies any items that may have gone out of stock.
   */
  const getUnavailableCartItems = useCallback(() => {
    return cartItems.filter((item) => !isProductInStock(item.id));
  }, [cartItems, isProductInStock]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        checkoutStep,
        customerDetails,
        subtotal,
        total,
        totalItemsCount,
        lastAddedItem,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        setCheckoutStep,
        updateCustomerDetails,
        getUnavailableCartItems,
        refreshStock
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
