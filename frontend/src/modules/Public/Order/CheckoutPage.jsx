// frontend/src/modules/Public/Order/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import { getCheckoutOptions, createOrder, checkVoucher } from './service';
import { Tag, X, MapPin } from 'lucide-react';

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    // 👇 UPDATE STATE FORM ALAMAT MENJADI TERPISAH
    const [address, setAddress] = useState({
        street: '',
        district: '',
        city: '',
        province: '',
        postal_code: ''
    });

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const [selectedCourier, setSelectedCourier] = useState(null); 
    const [selectedBank, setSelectedBank] = useState(''); 

    // State Voucher
    const [voucherCode, setVoucherCode] = useState('');
    const [discountData, setDiscountData] = useState(null);
    const [checkingVoucher, setCheckingVoucher] = useState(false);

    useEffect(() => {
        if (isSuccess) return; 
        if (cartItems.length === 0) {
            toast.warn("Keranjang belanja kosong.");
            navigate('/cart');
            return;
        }
        getCheckoutOptions()
            .then(data => {
                setBanks(data.paymentMethods);
                setCouriers(data.shippingMethods);
            })
            .catch(() => toast.error("Gagal memuat opsi."));
    }, [cartItems, navigate, isSuccess]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    // --- HITUNGAN ---
    const subtotal = getTotalPrice();
    const shippingCost = selectedCourier ? Number(selectedCourier.cost) : 0;
    const discountAmount = discountData ? Number(discountData.discount_amount) : 0;
    const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount);

    // --- HANDLER VOUCHER (SAMA SEPERTI SEBELUMNYA) ---
    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return toast.error("Masukkan kode voucher.");
        setCheckingVoucher(true);
        try {
            const result = await checkVoucher(voucherCode, subtotal);
            setDiscountData(result);
            toast.success(result.message);
        } catch (error) {
            setDiscountData(null);
            toast.error(error.response?.data?.message || "Voucher tidak valid.");
        } finally {
            setCheckingVoucher(false);
        }
    };

    const handleRemoveVoucher = () => {
        setDiscountData(null);
        setVoucherCode('');
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourier) return toast.error("Pilih jasa pengiriman.");
        if (!selectedBank) return toast.error("Pilih metode pembayaran.");

        setLoading(true);

        const payload = {
            customer_name: customerName,
            customer_phone: customerPhone,
            
            // Kirim Data Alamat Terpisah
            addr_street: address.street,
            addr_district: address.district,
            addr_city: address.city,
            addr_province: address.province,
            addr_postal_code: address.postal_code,

            courier_code: selectedCourier.code,
            courier_service: selectedCourier.name,
            shipping_cost: shippingCost,
            payment_bank: selectedBank,
            
            // Kirim Data Diskon
            total_discount: discountAmount, 
            voucher_code: discountData ? discountData.code : null,

            cart_items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })) 
        };

        try {
            const response = await createOrder(payload);
            setIsSuccess(true); 
            clearCart(); 
            navigate('/order-success', { 
                state: { 
                    invoice: response.invoiceNumber, 
                    total: grandTotal, 
                    bank: banks.find(b => b.bank_name === selectedBank) 
                } 
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal membuat pesanan.");
            setLoading(false); 
        } 
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
            <h2>Checkout Pengiriman</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                
                {/* KOLOM KIRI: FORMULIR */}
                <form id="checkoutForm" onSubmit={handleSubmit}>
                    
                    {/* 1. Data Diri & Alamat (DETAIL) */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                        <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <MapPin size={20} /> Alamat Pengiriman
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Nama Penerima</label>
                                <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>No. WhatsApp / HP</label>
                                <input type="text" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        {/* INPUT ALAMAT TERPISAH */}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Alamat Lengkap (Jalan, No Rumah, Gedung)</label>
                            <textarea name="street" rows="2" required value={address.street} onChange={handleAddressChange} placeholder="Contoh: Jl. Mawar No. 12, RT 01/02" style={inputStyle}></textarea>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Provinsi</label>
                                <input type="text" name="province" required value={address.province} onChange={handleAddressChange} placeholder="Contoh: Jawa Barat" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Kota / Kabupaten</label>
                                <input type="text" name="city" required value={address.city} onChange={handleAddressChange} placeholder="Contoh: Bandung" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Kecamatan</label>
                                <input type="text" name="district" required value={address.district} onChange={handleAddressChange} placeholder="Contoh: Coblong" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Kode Pos</label>
                                <input type="text" name="postal_code" required value={address.postal_code} onChange={handleAddressChange} placeholder="40132" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Jasa Pengiriman */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                        <h3>2. Jasa Pengiriman</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {couriers.map(courier => (
                                <label key={courier.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '6px', cursor: 'pointer', background: selectedCourier?.id === courier.id ? '#f0f8ff' : 'white' }}>
                                    <input 
                                        type="radio" name="courier" 
                                        value={courier.code} checked={selectedCourier?.id === courier.id}
                                        onChange={() => setSelectedCourier(courier)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <div style={{flex: 1, fontWeight: '500'}}>{courier.name}</div>
                                    <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                                        {Number(courier.cost) === 0 ? "GRATIS" : formatRupiah(courier.cost)}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 3. Pembayaran */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                        <h3>3. Metode Pembayaran</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {banks.map(bank => (
                                <label key={bank.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '6px', cursor: 'pointer', background: selectedBank === bank.bank_name ? '#f0f8ff' : 'white' }}>
                                    <input 
                                        type="radio" name="payment" 
                                        value={bank.bank_name} checked={selectedBank === bank.bank_name}
                                        onChange={(e) => setSelectedBank(e.target.value)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <div>
                                        <div style={{fontWeight: 'bold'}}>{bank.bank_name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>a.n {bank.account_name}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                </form>

                {/* KOLOM KANAN: RINGKASAN (TETAP SAMA DENGAN FITUR VOUCHER) */}
                <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
                    <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <h3 style={{marginTop: 0}}>Ringkasan Pesanan</h3>
                        
                        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px', borderBottom: '1px solid #ddd' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                                    <div style={{flex: 1}}>
                                        <div>{item.name}</div>
                                        <div style={{fontSize: '0.8rem', color: '#666'}}>x {item.quantity}</div>
                                    </div>
                                    <div style={{fontWeight: '500'}}>{formatRupiah(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>
                        
                        {/* INPUT VOUCHER */}
                        <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #ddd' }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold'}}>
                                <Tag size={14} /> Punya Kode Voucher?
                            </div>
                            
                            {!discountData ? (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input 
                                        type="text" placeholder="Masukkan Kode"
                                        value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }}
                                    />
                                    <button 
                                        type="button" onClick={handleApplyVoucher} disabled={checkingVoucher || !voucherCode}
                                        style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}
                                    >
                                        {checkingVoucher ? '...' : 'Pakai'}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ background: '#d1e7dd', color: '#0f5132', padding: '10px', borderRadius: '5px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>
                                        <strong>{discountData.code}</strong> <br/>
                                        <small>Hemat {formatRupiah(discountData.discount_amount)}</small>
                                    </span>
                                    <button onClick={handleRemoveVoucher} style={{ background: 'none', border: 'none', color: '#842029', cursor: 'pointer' }}>
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ITUNG-ITUNGAN */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Subtotal</span>
                            <span>{formatRupiah(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Ongkos Kirim</span>
                            <span>{selectedCourier ? (Number(selectedCourier.cost) === 0 ? 'Gratis' : formatRupiah(selectedCourier.cost)) : '-'}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#28a745' }}>
                                <span>Diskon Voucher</span>
                                <span>- {formatRupiah(discountAmount)}</span>
                            </div>
                        )}
                        
                        <hr style={{ margin: '15px 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total Bayar</span>
                            <span style={{ color: '#dc3545' }}>{formatRupiah(grandTotal)}</span>
                        </div>

                        <button 
                            type="submit" form="checkoutForm" disabled={loading}
                            style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {loading ? 'Memproses...' : 'Buat Pesanan Sekarang'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%', 
    padding: '10px', 
    marginTop: '5px', 
    border: '1px solid #ccc', 
    borderRadius: '4px'
};

export default CheckoutPage;