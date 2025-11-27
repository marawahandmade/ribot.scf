import api from '../../../services/api'; 

// ==================================================
// 1. AUTHENTICATION (Login, Register, Logout)
// ==================================================
// ⚠️ JANGAN HAPUS BAGIAN INI, PENTING UNTUK LOGIN!

export const login = async (credentials) => {
    // Credentials berisi { username, password }
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Simpan data user lengkap (id, username, role, dll)
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

// ==================================================
// 2. PERSONAL PROFILE (User Sendiri)
// ==================================================

// Ambil data profil diri sendiri
export const fetchProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

// Update profil diri sendiri
export const updateProfile = async (data) => {
    const response = await api.put('/auth/profile', data);
    
    // Fitur Tambahan: Update localStorage agar nama di header berubah realtime
    try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (e) {
        console.error("Gagal update local storage", e);
    }
    
    return response.data;
};

// Ganti Password diri sendiri
export const changePassword = async (data) => {
    // Endpoint harus sesuai dengan backend route (/auth/change-password)
    const response = await api.put('/auth/change-password', data);
    return response.data;
};

// ==================================================
// 3. USER MANAGEMENT (Khusus Admin)
// ==================================================
// Perhatikan endpointnya adalah '/users', bukan '/auth/users'

export const fetchAllUsers = async () => {
    const response = await api.get('/users'); 
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

// Fungsi ini penting untuk pre-fill data saat Edit User
export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`); // Endpoint backend standar REST biasanya GET /users/:id
    // Jika backend Anda belum punya route specific GET /users/:id, 
    // biasanya fetchAllUsers sudah cukup jika list di frontend difilter, 
    // tapi idealnya ada endpoint ini. 
    // Jika error 404, pastikan di backend UserController ada router.get('/:id', ...)
    return response.data; 
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};