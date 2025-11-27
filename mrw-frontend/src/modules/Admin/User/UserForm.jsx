// frontend/src/modules/Admin/User/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// Pastikan authService.js sudah memiliki getUserById, createUser, updateUser
import { getUserById, createUser, updateUser } from '../../Auth/service/authService';
import { User, Save, ArrowLeft } from 'lucide-react';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Jika ada ID, berarti mode EDIT
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '', // Tambahkan email
        role: 'staff',
        password: '' // Password hanya wajib saat create
    });

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            getUserById(id)
                .then(data => {
                    setFormData({
                        username: data.username,
                        full_name: data.full_name || '',
                        email: data.email || '',
                        role: data.role,
                        password: '' // Password dikosongkan (biar user tidak perlu isi kalau tidak mau ganti)
                    });
                })
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    toast.error("Gagal memuat data pengguna.");
                    navigate('/admin/users');
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // Mode Edit
                // Jika password kosong, jangan kirim field password ke backend (backend harus handle ini)
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                
                await updateUser(id, payload);
                toast.success("User berhasil diperbarui!");
            } else {
                // Mode Create
                await createUser(formData);
                toast.success("User baru berhasil dibuat!");
            }
            navigate('/admin/users');
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menyimpan user.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <p style={{padding: '20px'}}>Memuat data...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
                <button onClick={() => navigate('/admin/users')} style={{background: 'none', border: 'none', cursor: 'pointer'}}><ArrowLeft /></button>
                <h2 style={{margin: 0}}>{isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Username</label>
                    <input 
                        type="text" name="username" required 
                        value={formData.username} onChange={handleChange}
                        // Username biasanya tidak boleh diganti saat edit untuk menjaga integritas, tapi opsional
                        disabled={isEditMode} 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: isEditMode ? '#eee' : 'white' }}
                    />
                </div>

                <div>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Nama Lengkap</label>
                    <input 
                        type="text" name="full_name" 
                        value={formData.full_name} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Email</label>
                    <input 
                        type="email" name="email" 
                        value={formData.email} onChange={handleChange}
                        placeholder="contoh@email.com"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>
                        Role
                    </label>
                    <select 
                        name="role" value={formData.role} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                    <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                        *Pastikan Anda memiliki wewenang untuk menetapkan role ini.
                    </small>
                </div>

                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px solid #eee' }}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>
                        {isEditMode ? 'Password Baru (Opsional)' : 'Password'}
                    </label>
                    <input 
                        type="password" name="password" 
                        required={!isEditMode} // Wajib saat create, opsional saat edit
                        value={formData.password} onChange={handleChange}
                        placeholder={isEditMode ? "Kosongkan jika tidak ingin mengganti" : "Masukkan password"}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        marginTop: '10px', padding: '12px', background: '#007bff', color: 'white', 
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Save size={18} />
                    {loading ? 'Menyimpan...' : 'Simpan Data'}
                </button>

            </form>
        </div>
    );
};

export default UserForm;