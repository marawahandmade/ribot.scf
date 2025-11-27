// frontend/src/modules/Admin/Profile/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Save, RefreshCw, Mail, Calendar } from 'lucide-react';
import { fetchProfile, updateProfile } from '../../Auth/service/authService';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        birthday: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await fetchProfile();
            setFormData({
                username: data.username,
                full_name: data.full_name || '',
                email: data.email || '',
                birthday: data.birthday || ''
            });
        } catch (error) {
            toast.error("Gagal memuat profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(formData);
            toast.success("Profil berhasil diperbarui!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal update profil.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{padding: '20px'}}>Memuat data profil...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#333' }}>
                <User size={24} /> Edit Profil Saya
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Perbarui informasi akun Anda di sini.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* USERNAME */}
                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Username</label>
                    <input 
                        type="text" name="username" 
                        value={formData.username} onChange={handleChange} required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f9f9f9' }}
                    />
                </div>

                {/* FULL NAME */}
                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nama Lengkap</label>
                    <input 
                        type="text" name="full_name" 
                        value={formData.full_name} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                {/* EMAIL */}
                <div>
                    <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                        <Mail size={16} /> Email
                    </label>
                    <input 
                        type="email" name="email" 
                        value={formData.email} onChange={handleChange}
                        placeholder="nama@email.com"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                {/* BIRTHDAY */}
                <div>
                    <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                        <Calendar size={16} /> Tanggal Lahir
                    </label>
                    <input 
                        type="date" name="birthday" 
                        value={formData.birthday} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginTop: '10px' }}>
                    <button 
                        type="submit" 
                        disabled={saving}
                        style={{ 
                            padding: '12px 25px', 
                            background: '#007bff', color: 'white', 
                            border: 'none', borderRadius: '5px', 
                            cursor: 'pointer', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        {saving ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditProfile;