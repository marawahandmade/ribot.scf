/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/modules/Public/Product/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail } from './service';
import { useCart } from '../../../context/CartContext'; // <-- 1. Import hook Cart
import { toast } from 'react-toastify'; // <-- 2. Import toast
import './detail.css';

const ProductDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const { addToCart } = useCart(); // <-- 3. Ambil fungsi addToCart

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1); // <-- 4. State untuk jumlah

    useEffect(() => {
        setLoading(true);
        setError(null);

        getProductDetail(id)
            .then((data) => {
                setProduct(data);
                setLoading(false);
                if (data && data.name) {
                    document.title = `${data.name} | Tokoku`;
                }
            })
            .catch((err) => {
                setError("Produk tidak ditemukan atau terjadi kesalahan server.");
                setLoading(false);
            });
    }, [id]);

    // <-- 5. Buat fungsi handler
    const handleAddToCart = () => {
        if (!product) return;
        if (product.stock < 1 || qty > product.stock) {
            toast.error("Stok produk tidak mencukupi!");
            return;
        }
        addToCart(product, qty); 
        // toast.success(`Berhasil menambahkan ${product.name} ke keranjang! 🛒`);
        // (Toast sudah ada di dalam context, jadi ini opsional)
    };


    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat Detail Produk...</div>;
    if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;
    if (!product) return null;

    return (
        <div className="detail-container">

            {/* Kolom Kiri: Gambar */}
            <div className="detail-image-wrapper">
                <img
                    src={product.image_url ? product.image_url : "https://placehold.co/400?text=Produk+Baru"}
                    alt={product.name}
                    className="card-img"
                    onError={(e) => { e.target.src = "https://placehold.co/400?text=Error+Img"; }}
                />
            </div>

            {/* Kolom Kanan: Informasi */}
            <div className="detail-info">
                <h1>{product.name}</h1>
                <p className="detail-price">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                </p>

                <div className="detail-desc">
                    <h3>Deskripsi</h3>
                    <p>{product.description || "Tidak ada deskripsi untuk produk ini."}</p>
                    <p><strong>Stok:</strong> {product.stock} unit</p>
                </div>

                {/* <-- 6. Tambah Input Kuantitas */}
                <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label>Jumlah:</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={product.stock} 
                        value={qty} 
                        onChange={(e) => setQty(parseInt(e.target.value))}
                        style={{ width: '60px', padding: '5px' }}
                    />
                </div>

                <div className="action-buttons">
                    {/* <-- 7. Update Tombol Keranjang */}
                    <button
                        className="btn-cart"
                        onClick={handleAddToCart}
                        disabled={product.stock < 1}
                        style={product.stock < 1 ? { background: '#ccc', cursor: 'not-allowed' } : {}}
                    >
                        {product.stock < 1 ? 'Habis' : '+ Keranjang'}
                    </button>

                    <button
                        className="btn-back"
                        onClick={() => navigate(-1)} 
                    >
                        Kembali
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductDetail;