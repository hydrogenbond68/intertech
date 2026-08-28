import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      console.log('Loading cart from localStorage:', savedCart);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Cart loaded with items:', parsed);
          setCartItems(parsed);
        } else {
          console.log('Cart is empty');
          setCartItems([]);
        }
      }
    } catch (e) {
      console.error('Error loading cart:', e);
      setCartItems([]);
    }
  }, []);

  // Save to localStorage and update totals
  useEffect(() => {
    try {
      console.log('Saving cart to localStorage:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      const items = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const price = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      
      setTotalItems(items);
      setTotalPrice(price);
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    console.log('Adding to cart:', product, 'Quantity:', quantity);
    
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingIndex !== -1) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + quantity
        };
        console.log('Updated existing item:', updated[existingIndex]);
        return updated;
      } else {
        // Add new item
        const newItem = { 
          ...product, 
          quantity: quantity,
          price: product.price || 0
        };
        console.log('Added new item:', newItem);
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    console.log('Removing from cart:', productId);
    setCartItems(prev => {
      const filtered = prev.filter(item => item.id !== productId);
      console.log('Items after removal:', filtered);
      return filtered;
    });
  };

  const updateQuantity = (productId, quantity) => {
    console.log('Updating quantity:', productId, quantity);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
