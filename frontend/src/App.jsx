// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Provider
import { CartProvider } from "./context/CartContext";

// Impor Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Impor Definisi Rute dari Modules
import { publicRoutes } from "./modules/Public/routes";
import { adminRoutes } from "./modules/Admin/routes";
import PrivateRoute from "./modules/Auth/components/PrivateRoute";

import Login from "./modules/Auth/pages/Login";

const NotFound = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h1>404</h1>
    <p>Halaman tidak ditemukan.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Rute Publik (E-commerce) */}
          <Route path="/" element={<PublicLayout />}>
            {publicRoutes}
          </Route>

          {/* Rute Admin (Akan berada di path /admin/*) */}
          {/* Catatan: Kita gunakan Route tanpa path di sini dan definisikan path utama /admin di AdminRoutes.jsx */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {adminRoutes}
          </Route>

          <Route path="/login" element={<Login />} />

          {/* Catch-All / 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right" // Posisi notifikasi
          autoClose={3000} // Auto close setelah 3 detik
          hideProgressBar={false}
        />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
