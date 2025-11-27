// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

// 1. Buat Context
const CartContext = createContext();

// 2. Buat Hook kustom untuk mempermudah penggunaan context
export const useCart = () => useContext(CartContext);

// 3. Buat Provider
export const CartProvider = ({ children }) => {
  // Inisialisasi state dari localStorage (agar data tidak hilang saat refresh)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Gagal mengambil data keranjang dari localStorage", error);
      return [];
    }
  });

  // Simpan ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- FUNGSI-FUNGSI KERANJANG ---

  // A. Tambah ke Keranjang
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Cek apakah produk sudah ada di keranjang
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Jika ada, update quantity-nya
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            toast.warn(`Stok tidak mencukupi. Sisa stok: ${product.stock}`);
            return prevItems; // Jangan tambahkan jika melebihi stok
        }
        
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        // Jika belum, tambahkan sebagai item baru
        if (quantity > product.stock) {
            toast.warn(`Stok tidak mencukupi. Sisa stok: ${product.stock}`);
            return prevItems; // Jangan tambahkan jika melebihi stok
        }
        return [...prevItems, { ...product, quantity }];
      }
    });
    toast.success(`Berhasil menambahkan ${product.name} ke keranjang! 🛒`);
  };

  // B. Hapus dari Keranjang
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.info("Item dihapus dari keranjang.");
  };

  // C. Update Quantity (misal di halaman keranjang)
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
        removeFromCart(productId); // Hapus jika kuantitas kurang dari 1
        return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => {
          if (item.id === productId) {
              if (quantity > item.stock) {
                  toast.warn(`Stok tidak mencukupi. Sisa stok: ${item.stock}`);
                  return { ...item, quantity: item.stock }; // Set ke maks stok
              }
              return { ...item, quantity };
          }
          return item;
      })
    );
  };

  // D. Kosongkan Keranjang (misal setelah Checkout)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    toast.info("Keranjang telah dikosongkan.");
  };

  // E. Hitung Total Harga
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // F. Hitung Total Item (untuk badge di ikon)
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Nilai yang akan diberikan ke komponen anak
  const value = {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};