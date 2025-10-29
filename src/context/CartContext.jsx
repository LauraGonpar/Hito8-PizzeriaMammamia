import { createContext, useState, useMemo, useContext } from "react";

export const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const clearCart = () => {
    setCartItems([]);
  };
  const addToCart = (productToAdd) => {
    console.log("🧩 Producto recibido:", productToAdd);
    setCartItems((currentItems) => {
      const isProductInCart = currentItems.find(
        (item) => item.id === productToAdd.id
      );

      if (isProductInCart) {
        return currentItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === productId);

      if (!existingItem) return currentItems;

      if (existingItem.quantity === 1) {
        return currentItems.filter((item) => item.id !== productId);
      } else {
        return currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const contextValue = {
    cartItems,
    total,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
