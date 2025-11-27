// frontend/src/modules/Public/Order/service.js
import api from '../../../services/api';

// Ambil opsi Checkout (Bank & Kurir)
export const getCheckoutOptions = async () => {
    const response = await api.get('/settings/checkout-options');
    return response.data;
};

// Kirim Pesanan Baru
export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const trackOrder = async (invoiceNumber) => {
    // Mengirim invoice sebagai query param
    const response = await api.get(`/orders/track?invoice=${invoiceNumber}`);
    return response.data;
};

export const checkVoucher = async (code, totalAmount) => {
    // Kirim kode dan total belanja (untuk validasi min_purchase)
    const response = await api.post('/discounts/verify', { 
        code, 
        total_amount: totalAmount 
    });
    return response.data;
};