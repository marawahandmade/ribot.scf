/* eslint-disable no-unused-vars */
// frontend/src/modules/Public/Cart/CartPage.jsx
import React from 'react';
import { useCart } from '../../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Helper formatRupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

const CartPage = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        getTotalPrice,
        clearCart
    } = useCart();
    
    const navigate = useNavigate();

    const handleCheckout = () => {
        // Nanti ini akan mengarah ke Fase 1.4: Modul Order (Checkout)
        //toast.info('Fitur Checkout belum siap!');
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Keranjang Anda kosong.</h2>
                <Link to="/products" style={{ textDecoration: 'none', padding: '10px 20px', background: '#007bff', color: 'white', borderRadius: '5px' }}>
                    Mulai Belanja
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Keranjang Belanja Anda</h2>
            
            {/* Daftar Item Keranjang */}
            <div style={{ width: '100%', maxWidth: '900px', margin: 'auto' }}>
                {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '15px 0' }}>
                        <img 
                            src={item.image_url || 'https://placehold.co/100'} 
                            alt={item.name} 
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }} 
                        />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0 }}>{item.name}</h4>
                            <p style={{ margin: '5px 0', color: '#555' }}>{formatRupiah(item.price)}</p>
                        </div>
                        <div style={{ minWidth: '120px', textAlign: 'center' }}>
                            <input 
                                type="number" 
                                value={item.quantity} 
                                min="1"
                                max={item.stock}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                style={{ width: '60px', padding: '5px', textAlign: 'center' }}
                            />
                        </div>
                        <div style={{ minWidth: '120px', fontWeight: 'bold', textAlign: 'right' }}>
                            {formatRupiah(item.price * item.quantity)}
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)} 
                            style={{ background: 'none', border: 'none', color: 'red', fontSize: '1.2rem', cursor: 'pointer', marginLeft: '20px' }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {/* Total dan Tombol Aksi */}
            <div style={{ width: '100%', maxWidth: '900px', margin: '20px auto', textAlign: 'right' }}>
                <button 
                    onClick={clearCart}
                    style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                >
                    Kosongkan Keranjang
                </button>
                
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '20px 0' }}>
                    Total: {formatRupiah(getTotalPrice())}
                </div>

                <button 
                    onClick={handleCheckout}
                    style={{ padding: '12px 25px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}
                >
                    Lanjut ke Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;