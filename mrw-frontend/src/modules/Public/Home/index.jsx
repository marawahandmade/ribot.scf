// frontend/src/modules/Public/Home/index.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from './service';
import './style.css'; // Import CSS lokal

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFeaturedProducts()
            .then(data => setFeaturedProducts(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="home-container">

            {/* 1. HERO SECTION */}
            <section className="hero-section">
                <h1 className="hero-title">Selamat Datang di Toko Kami</h1>
                <p>Temukan produk terbaik dengan harga terjangkau.</p>

                <br />
                <Link to="/products" className="hero-btn">Belanja Sekarang</Link>
            </section>

            {/* 2. FEATURED PRODUCTS */}
            <section className="featured-section">
                <h2 className="section-title">Produk Unggulan</h2>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Memuat produk...</p>
                ) : (
                    <div className="product-grid">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <img
                                    src={product.image_url ? product.image_url : "https://placehold.co/400?text=Produk+Baru"}
                                    alt={product.name}
                                    className="card-img"
                                    onError={(e) => { e.target.src = "https://placehold.co/400?text=Error+Img"; }} // Jaga-jaga jika URL error
                                />
                                <div className="card-body">
                                    <h3>{product.name}</h3>
                                    <p className="price">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
                                    <Link to={`/products/detail/${product.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                                        Lihat Detail →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default HomePage;