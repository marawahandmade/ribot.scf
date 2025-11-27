// frontend/src/modules/Public/Order/TrackOrderPage.jsx
import React, { useState } from 'react';
import { trackOrder } from './service';
import { toast } from 'react-toastify';

// Helper Status Badge (sama seperti di Admin tapi versi CSS inline)
const getStatusStyle = (status) => {
    const styles = {
        pending_payment: { bg: '#fff3cd', color: '#856404', label: 'Menunggu Pembayaran' },
        paid: { bg: '#d1ecf1', color: '#0c5460', label: 'Sudah Dibayar' },
        processing: { bg: '#e2e3e5', color: '#383d41', label: 'Sedang Dikemas' },
        shipped: { bg: '#cce5ff', color: '#004085', label: 'Dikirim' },
        completed: { bg: '#d4edda', color: '#155724', label: 'Selesai' },
        cancelled: { bg: '#f8d7da', color: '#721c24', label: 'Dibatalkan' },
    };
    return styles[status] || { bg: '#eee', color: '#333', label: status };
};

const TrackOrderPage = () => {
    const [invoiceInput, setInvoiceInput] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!invoiceInput.trim()) return toast.error("Masukkan nomor invoice.");

        setLoading(true);
        setOrderData(null); // Reset hasil sebelumnya

        try {
            const data = await trackOrder(invoiceInput.trim());
            setOrderData(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Pesanan tidak ditemukan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Lacak Status Pesanan</h2>

            {/* Form Pencarian */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Masukkan Nomor Invoice (Contoh: INV/2023...)" 
                    value={invoiceInput}
                    onChange={(e) => setInvoiceInput(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '12px 25px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}
                >
                    {loading ? 'Mencari...' : 'Lacak'}
                </button>
            </form>

            {/* Hasil Pencarian */}
            {orderData && (
                <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    
                    {/* Header Invoice & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Nomor Invoice</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff' }}>{orderData.invoice_number}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            {(() => {
                                const style = getStatusStyle(orderData.status);
                                return (
                                    <span style={{ background: style.bg, color: style.color, padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {style.label}
                                    </span>
                                );
                            })()}
                            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                                {new Date(orderData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Info Pengiriman & Resi */}
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ color: '#666' }}>Kurir:</span>
                            <strong>{orderData.courier_service} ({orderData.courier_code.toUpperCase()})</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Nomor Resi:</span>
                            {orderData.resi_number ? (
                                <strong style={{ color: '#28a745', fontSize: '1.1rem' }}>{orderData.resi_number}</strong>
                            ) : (
                                <span style={{ fontStyle: 'italic', color: '#999' }}>Belum tersedia</span>
                            )}
                        </div>
                    </div>

                    {/* Daftar Item */}
                    <h4 style={{ margin: '0 0 10px 0' }}>Barang yang dibeli:</h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#444' }}>
                        {orderData.items.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '5px' }}>
                                {item.name} <span style={{ color: '#888' }}>x {item.quantity}</span>
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
};

export default TrackOrderPage;