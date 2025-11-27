// frontend/src/modules/Auth/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// 👇 Ganti axios manual dengan import service login kita
import { login } from "../service/authService"; 
import PageHeaderManager from "../../../components/PageHeaderManager";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Panggil fungsi login dari authService
      // Fungsi ini sudah otomatis simpan token & user ke LocalStorage
      const data = await login({ username, password });

      // 2. Ambil role dari object user (bukan langsung dari root)
      // Struktur data: { token: "...", user: { role: "admin", ... } }
      const userRole = data.user?.role?.toLowerCase(); // Pakai optional chaining & lowercase biar aman

      if (userRole === "admin" || userRole === "superadmin") {
        toast.success("Halo! Selamat Datang.");
        navigate("/admin");
      } else {
        toast.warn("Akses ditolak. Akun bukan Admin.");
        // Opsional: Hapus token jika ditolak
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }

    } catch (error) {
      console.error("Login Failed:", error);
      toast.error(error.response?.data?.message || "Gagal Login: Username atau Password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <PageHeaderManager />
      <div
        style={{
          padding: "40px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          minWidth: "350px",
        }}
      >
        <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Masuk Admin Panel</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div>
            <label style={{display: 'block', marginBottom: '5px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Masukkan username admin"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '5px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px"
            }}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;