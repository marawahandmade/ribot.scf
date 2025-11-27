// frontend/src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumbs from '../components/Breadcrumbs';
import PageHeaderManager from '../components/PageHeaderManager';
import Sidebar from './Sidebar';

// Icons (Tambah LucideFileText untuk Draft)
import { LucideChartPie, LucideBarcode, LucideShoppingCart, LucideTicketPercent, LucideUserCog, LucideCog, LucideFileText } from 'lucide-react';
import './admin.css'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  
  const userString = localStorage.getItem('user');
  const userData = userString ? JSON.parse(userString) : { full_name: 'Admin', username: 'admin' };
  
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.info('Anda telah berhasil logout.');
    navigate('/login'); 
  };

  

  return (
    <div className="admin-container">
      
      {/* 1. SIDEBAR KIRI */}
      <Sidebar onLogout={handleLogout} />

      {/* 2. KONTEN KANAN */}
      <div className="admin-content">
        <PageHeaderManager />
        
        <header className="admin-header">
            <h3>Selamat Datang, {userData.full_name || userData.username}</h3>
            
            {/* User Dropdown */}
            <div 
                className="user-dropdown-container" 
                onMouseEnter={() => setIsOpen(true)} 
                onMouseLeave={() => setIsOpen(false)}
            >
                <button 
                  className="user-dropdown-toggle" 
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {userData.username || 'Admin'} <span>▼</span>
                </button>

                {isOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-header">
                        Halo, <strong>{userData.username}</strong>
                    </div>

                    <Link to="/admin/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                      Ubah Profil
                    </Link>
                    
                    <Link to="/admin/password" className="dropdown-item" onClick={() => setIsOpen(false)}>
                      Ganti Password
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Logout
                    </button>
                  </div>
                )}
            </div>
            
        </header>
        
        <main className="admin-main">
            <Breadcrumbs />
            <Outlet /> 
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;