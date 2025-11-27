// frontend/src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import Breadcrumbs from '../components/Breadcrumbs';
import PageHeaderManager from '../components/PageHeaderManager';

// ... (headerStyles, navStyles, cartIconStyles, cartBadgeStyles tetap sama)
const headerStyles = {
// ...
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: '#333',
    color: 'white',
};
// ... (style lainnya)
const navStyles = {
    display: 'flex',
    gap: '20px',
};

const cartIconStyles = {
    position: 'relative',
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.5rem', 
};

const cartBadgeStyles = {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    background: '#dc3545', 
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
};
// ...

// 1. Tambahkan style untuk container utama (pembungkus)
const layoutContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh' // Setidaknya setinggi layar
};

const PublicLayout = () => {
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    return (
        // 2. Terapkan style container di div terluar
        <div style={layoutContainerStyles}> 
            <PageHeaderManager /> 

            <header style={headerStyles}>
                <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Marawa E-Commerce
                </Link>
                
                <nav style={navStyles}>
                    {/* ... Link Home, Produk, Cart ... */}
                    <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
                    <Link to="/products" style={{ textDecoration: 'none', color: 'white' }}>Produk</Link>
                    <Link to="/track-order" style={{ textDecoration: 'none', color: '#ffc107', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        🔍 Lacak
                    </Link>
                    <Link to="/cart" style={cartIconStyles} title="Keranjang Belanja">
                        🛒
                        {totalItems > 0 && (
                            <span style={cartBadgeStyles}>
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </nav>
            </header>
            
            {/* 3. Modifikasi style <main> */}
            <main style={{ 
                padding: '20px', 
                // maxWidth: '1200px', // <-- DIHAPUS agar tidak menyempit
                // margin: '0 auto',     // <-- DIHAPUS
                width: '100%', // Pastikan responsif
                flex: 1 // <-- INI KUNCINYA: Buat main content 'tumbuh'
            }}> 
                <Breadcrumbs /> 
                <Outlet /> 
            </main>
            
            {/* 4. Footer tidak perlu diubah. Flex: 1 di <main> akan mendorongnya ke bawah. */}
            <footer style={{ 
                textAlign: 'center', 
                padding: '20px', 
                background: '#f4f4f4', 
                borderTop: '1px solid #ddd' 
            }}>
                © 2025 Marawa E-Commerce
            </footer>
        </div>
    );
};
export default PublicLayout;