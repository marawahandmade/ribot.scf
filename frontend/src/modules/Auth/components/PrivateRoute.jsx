// frontend/src/modules/Auth/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Jika token tidak ada, redirect ke halaman login
    toast.error('Sesi berakhir atau Anda belum login.');
    return <Navigate to="/login" replace />;
  }
  
  // Jika token ada, render komponen anak (halaman Admin)
  return children;
};

export default PrivateRoute;