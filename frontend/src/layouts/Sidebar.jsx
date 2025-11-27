/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/layouts/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TicketPercent,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  FileText,
  ShoppingBag,
  AlertCircle,
  ArchiveRestore,
  BookImage,
  Tags,
  CloudDownload,
  BookA,
  BookMarked,
  HandCoins,
  Banknote,
  UserStar,
  UsersRound,
  Sheet,
  Handshake,
  Link2,
  Megaphone,
  Newspaper,
  Smartphone,
  Rss,
  ClipboardPen,
  List,
  SlidersHorizontal,
  Wallet,
  Truck,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  // State Tunggal untuk mengontrol submenu yang terbuka
  // Menyimpan ID string dari menu yang terbuka (misal: 'products', 'orders')
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fungsi Toggle Universal
  const handleToggle = (menuId) => {
    // Jika menu yang sama diklik, tutup (setel ke null)
    // Jika menu berbeda diklik, buka menu yang baru
    setOpenMenuId((prevId) => (prevId === menuId ? null : menuId));
  };

  // Efek: Otomatis buka menu berdasarkan rute yang sedang aktif (halaman reload/navigasi langsung)
  useEffect(() => {
    const pathname = location.pathname;
    let activeMenuId = null;

    // Cek rute yang mengandung submenu dan tentukan ID-nya
    if (pathname.startsWith("/admin/blog")) {
      activeMenuId = "blog";
    } else if (pathname.startsWith("/admin/settings") || pathname === "/admin/users") {
      activeMenuId = "settings";
    }

    // Set state hanya jika ada perubahan
    setOpenMenuId(activeMenuId);
  }, [location.pathname]);

  // Helper untuk cek link aktif
  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path ? "active" : "";
    return location.pathname.startsWith(path) ? "active" : "";
  };

  // Helper untuk cek apakah submenu saat ini terbuka
  const isMenuOpen = (menuId) => openMenuId === menuId;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">Admin Panel</div>

      <nav className="sidebar-menu">
        {/* 1. DASHBOARD */}
        <Link
          to="/admin"
          className={`sidebar-link ${isActive("/admin", true)}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>


        <div className="sidebar-group">
          <div
            className={`sidebar-link group-parent ${
              location.pathname.startsWith("/admin/settings") ||
              location.pathname === "/admin/users"
                ? "active-parent"
                : ""
            }`}
            onClick={() => handleToggle("settings")}
            style={{ cursor: "pointer", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Settings size={20} />
              <span>Pengaturan</span>
            </div>
            {isMenuOpen("settings") ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div> 
          

          {/* Submenu Container */}
          {isMenuOpen("settings") && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/settings"
                className={`submenu-link ${
                  location.pathname === "/admin/settings" ? "active" : ""
                }`}
              >
                <SlidersHorizontal size={16} />
                <span>Umum</span>
              </Link>
              <Link
                to="/admin/users"
                className={`submenu-link ${
                  isActive("/admin/users") ? "active" : ""
                }`}
              >
                <Users size={16} />
                <span>User/Staff</span>
              </Link>
            </div>
          )}
        </div>

        {/* TOMBOL LOGOUT */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "20px",
            borderTop: "1px solid #333",
          }}
        >
          <button
            onClick={onLogout}
            className="sidebar-link"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              color: "#ff6b6b",
              cursor: "pointer",
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
