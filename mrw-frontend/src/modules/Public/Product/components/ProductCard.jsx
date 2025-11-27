// frontend/src/modules/Public/Product/components/ProductCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { toast } from 'react-toastify';

// Helper formatRupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Style untuk card
const cardStyles = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Memastikan card sama tinggi jika di dalam grid
};

const cardImageStyles = {
    width: '100%',
    height: '200px', // Tinggi gambar tetap
    objectFit: 'cover',
};

const cardContentStyles = {
    padding: '15px',
    flex: 1, // Mendorong tombol ke bawah
    display: 'flex',
    flexDirection: 'column',
};

const cardTitleStyles = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '5px',
};

const cardPriceStyles = {
    fontSize: '1rem',
    color: '#dc3545', // Merah
    fontWeight: 'bold',
    marginBottom: '10px',
};

const cardButtonContainerStyles = {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto', // Mendorong tombol ke bagian bawah card
};

const cardButtonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1, // Membuat tombol sama lebar
    fontSize: '0.9rem',
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        // 1. Hentikan event agar tidak pindah halaman (karena tombol ada di dalam Link)
        e.stopPropagation(); 
        e.preventDefault(); 
        
        if (product.stock < 1) {
            toast.error("Stok produk habis!");
            return;
        }
        // 2. Tambah 1 item ke keranjang
        addToCart(product, 1);
    };

    const handleViewDetail = (e) => {
        e.preventDefault();
        navigate(`/products/detail/${product.id}`);
    };

    return (
        // 3. Seluruh card adalah Link ke Halaman Detail
        <Link to={`/products/detail/${product.id}`} style={cardStyles}>
            <img 
                src={product.image_url || 'https://placehold.co/300'} 
                alt={product.name} 
                style={cardImageStyles}
            />
            <div style={cardContentStyles}>
                <h3 style={cardTitleStyles}>{product.name}</h3>
                <p style={cardPriceStyles}>{formatRupiah(product.price)}</p>
                
                <div style={cardButtonContainerStyles}>
                    {/* 4. Tombol "Tambah Keranjang" */}
                    <button 
                        style={{ ...cardButtonStyle, background: '#007bff', color: 'white' }}
                        onClick={handleAddToCart}
                        disabled={product.stock < 1}
                    >
                        {product.stock < 1 ? 'Habis' : '+ Keranjang'}
                    </button>
                    {/* 5. Tombol "Lihat Detail" */}
                    <button 
                        style={{ ...cardButtonStyle, background: '#6c757d', color: 'white' }}
                        onClick={handleViewDetail} // Menggunakan onClick terpisah untuk navigasi
                    >
                        Detail
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;