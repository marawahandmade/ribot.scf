import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react';
import { changePassword } from '../../Auth/service/authService';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password !== formData.confirm_password) {
            return toast.error("Konfirmasi password tidak cocok.");
        }
        
        if (formData.new_password.length < 6) {
            return toast.error("Password minimal 6 karakter.");
        }

        setLoading(true);
        try {
            await changePassword({
                current_password: formData.current_password,
                new_password: formData.new_password
            });
            toast.success("Password berhasil diubah!");
            setFormData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal mengganti password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
                <Lock /> Ganti Password
            </h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password Saat Ini</label>
                    <input 
                        type="password" name="current_password" 
                        value={formData.current_password} onChange={handleChange} required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password Baru</label>
                    <input 
                        type="password" name="new_password" 
                        value={formData.new_password} onChange={handleChange} required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Konfirmasi Password Baru</label>
                    <input 
                        type="password" name="confirm_password" 
                        value={formData.confirm_password} onChange={handleChange} required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Memproses...' : 'Ganti Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;