/* eslint-disable no-unused-vars */
// frontend/src/modules/Admin/User/UserList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllUsers, deleteUser } from "../../Auth/service/authService";
import { Plus, Pencil, Trash2, Shield, User, Ban } from "lucide-react";
// Import CSS umum, path disesuaikan ke /assets/css/theme.css
import '../../../assets/css/theme.css'; 

// Definisi Hierarki Role (Pastikan kuncinya huruf kecil semua)
const ROLE_LEVELS = {
    'superadmin': 99,
    'admin': 20,
    'staff': 10,
    'user': 1
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. Ambil data user dari LocalStorage
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
        }
    } catch (e) {
        console.error("Gagal parsing user data", e);
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal memuat daftar pengguna.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    // GANTI window.confirm DENGAN MODAL KUSTOM DI PROYEK NYATA
    if (window.confirm(`Yakin ingin menghapus pengguna ${username}?`)) { 
      try {
        await deleteUser(id);
        toast.success(`Pengguna ${username} berhasil dihapus.`);
        loadData(); 
      } catch (error) {
        toast.error(error.response?.data?.message || "Gagal menghapus pengguna.");
      }
    }
  };

  const canManage = (targetUser) => {
      if (!currentUser || !currentUser.role) return false;
      if (String(currentUser.id) === String(targetUser.id)) return false;

      const myRole = currentUser.role.toLowerCase();
      const targetRole = (targetUser.role || '').toLowerCase();

      const myLevel = ROLE_LEVELS[myRole] || 0;
      const targetLevel = ROLE_LEVELS[targetRole] || 0;

      return myLevel > targetLevel;
  };

  const getRoleBadge = (role) => {
    const safeRole = (role || '').toLowerCase();
    let badgeClass = 'badge-member';
    let Icon = User;

    if (safeRole === 'superadmin') {
        badgeClass = 'badge-superadmin';
        Icon = Shield;
    } else if (safeRole === 'admin') {
        badgeClass = 'badge-admin';
        Icon = Shield;
    }
    
    return <span className={`role-badge ${badgeClass}`}><Icon size={12} /> {role}</span>;
  };

  return (
    // Menggunakan kelas page-container
    <div className="page-container">
      
      {/* Menggunakan kelas page-header */}
      <div className="page-header">
        <div>
            <h2 className="page-title">Manajemen Pengguna</h2>
            <p className="page-subtitle">
                Login sebagai: <strong>{currentUser?.username || 'Guest'}</strong> ({currentUser?.role || '-'})
            </p>
            {/* Peringatan jika belum login ulang */}
            {!currentUser && (
                <small style={{color: '#dc3545', fontSize: '0.9rem'}}>
                    ⚠️ Data sesi tidak lengkap. Silakan <Link to="/login" style={{color: '#dc3545'}}>Login Ulang</Link>.
                </small>
            )}
        </div>
        
        <Link to="/admin/users/create" className="btn-success">
            <Plus size={18} /> Tambah Pengguna
        </Link>
      </div>

      {loading ? (
        <p style={{textAlign: 'center', padding: '20px', color: '#666'}}>Memuat data...</p>
      ) : (
        // Menggunakan kelas data-table-wrapper
        <div className="data-table-wrapper">
            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Role</th>
                    <th className="action-column">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => {
                    const isAllowed = canManage(user);
                    const isSelf = String(currentUser?.id) === String(user.id);

                    return (
                        // Menggunakan highlight-row untuk baris sendiri
                        <tr key={user.id} className={isSelf ? 'highlight-row' : ''}>
                            <td>#{user.id}</td>
                            <td>
                                <div style={{fontWeight: 'bold', color: '#333'}}>
                                    {user.username} {isSelf && <span style={{fontSize: '0.8em', color: '#007bff'}}>(Anda)</span>}
                                </div>
                                <div style={{fontSize: '0.85rem', color: '#666'}}>{user.full_name || "-"}</div>
                            </td>
                            <td>{getRoleBadge(user.role)}</td>
                            
                            {/* Menggunakan kelas action-column dan action-buttons-group */}
                            <td className="action-column">
                                <div className="action-buttons-group">
                                    
                                    {/* TOMBOL EDIT */}
                                    <Link to={`/admin/users/edit/${user.id}`}>
                                        <button 
                                            title="Edit" 
                                            className="btn-action btn-warning" 
                                            disabled={!isAllowed}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </Link>

                                    {/* TOMBOL HAPUS */}
                                    <button 
                                        title={isSelf ? "Tidak bisa hapus diri sendiri" : (isAllowed ? "Hapus" : "Level akses tidak cukup")}
                                        onClick={isAllowed ? () => handleDelete(user.id, user.username) : null} 
                                        className="btn-action btn-danger" 
                                        disabled={!isAllowed}
                                    >
                                        {isAllowed ? <Trash2 size={16} /> : (isSelf ? <User size={16}/> : <Ban size={16} />)}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default UserList;