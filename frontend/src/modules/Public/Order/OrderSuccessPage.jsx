// frontend/src/modules/Public/Order/OrderSuccessPage.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
    const location = useLocation();
    const { invoice, total, bank } = location.state || {};

    if (!invoice) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Halaman tidak valid.</p>
                <Link to="/">Kembali ke Home</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #28a745', borderRadius: '10px', textAlign: 'center', background: '#fafffa' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>✅</div>
            <h1 style={{ color: '#28a745' }}>Pesanan Berhasil Dibuat!</h1>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>Terima kasih telah berbelanja di Toko Kami.</p>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', margin: '30px 0', textAlign: 'left' }}>
                <p><strong>Nomor Invoice:</strong> <span style={{ color: '#007bff' }}>{invoice}</span></p>
                <p><strong>Total Tagihan:</strong> <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#dc3545' }}>Rp {parseInt(total).toLocaleString('id-ID')}</span></p>
                
                <hr style={{ margin: '15px 0' }} />
                
                <p style={{ marginBottom: '10px' }}>Silakan transfer ke rekening berikut:</p>
                {bank ? (
                    <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '5px' }}>
                        <h3 style={{ margin: '0 0 5px 0' }}>{bank.bank_name}</h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>{bank.account_number}</div>
                        <div>a.n {bank.account_name}</div>
                    </div>
                ) : (
                    <p>Data bank tidak ditemukan. Hubungi Admin.</p>
                )}
                
                <p style={{ fontSize: '0.9rem', color: '#777', marginTop: '15px' }}>
                    *Pesanan Anda akan diproses setelah pembayaran dikonfirmasi. Silakan kirim bukti transfer ke Admin via WhatsApp.
                </p>
            </div>

            <Link to="/" style={{ padding: '12px 25px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                Kembali Berbelanja
            </Link>
        </div>
    );
};

export default OrderSuccessPage;