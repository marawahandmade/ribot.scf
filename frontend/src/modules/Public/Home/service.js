// frontend/src/modules/Public/Home/service.js
import api from '../../../services/api';

export const getFeaturedProducts = async () => {
  try {
    // Kita memanggil endpoint products, lalu kita batasi hanya 4 item di frontend
    const response = await api.get('/products/featured');
    return response.data.slice(0, 4); 
  } catch (error) {
    console.error("Gagal memuat featured products:", error);
    return [];
  }
};