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
    if (pathname.startsWith("/admin/orders")) {
      activeMenuId = "orders";
    } else if (pathname.startsWith("/admin/products")) {
      activeMenuId = "products";
    } else if (pathname.startsWith("/admin/reports")) {
      activeMenuId = "reports";
    } else if (pathname.startsWith("/admin/customers")) {
      activeMenuId = "customers";
    } else if (pathname.startsWith("/admin/marketing")) {
      activeMenuId = "marketing";
    } else if (pathname.startsWith("/admin/blog")) {
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

        {/* 2. PRODUK (Menggunakan ID 'products') */}
        <div className="sidebar-group">
          <div
            className={`sidebar-link group-parent ${
              location.pathname.startsWith("/admin/products")
                ? "active-parent"
                : ""
            }`}
            onClick={() => handleToggle("products")}
            style={{ cursor: "pointer", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Package size={20} />
              <span>Produk</span>
            </div>
            {isMenuOpen("products") ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>

          {/* Submenu Container */}
          {isMenuOpen("products") && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/products"
                className={`submenu-link ${
                  location.pathname === "/admin/products" ||
                  location.pathname.startsWith("/admin/products/create") ||
                  location.pathname.startsWith("/admin/products/variations")
                    ? "active"
                    : ""
                }`}
              >
                <ShoppingBag size={16} />
                <span>Daftar Produk</span>
              </Link>

              <Link
                to="/admin/products/stock"
                className={`submenu-link ${
                  isActive("/admin/products/stock") ||
                  location.pathname === "/admin/products/stock/opname"
                    ? "active"
                    : ""
                }`}
              >
                <ArchiveRestore size={16} />
                <span>Kelola Stok</span>
              </Link>

              <Link
                to="/admin/products/category"
                className={`submenu-link ${
                  isActive("/admin/products/category") ||
                  location.pathname === "/admin/products/category/create"
                    ? "active"
                    : ""
                }`}
              >
                <FileText size={16} />
                <span>Kategori</span>
              </Link>

              <Link
                to="/admin/products/catalog"
                className={`submenu-link ${
                  isActive("/admin/products/catalog") ||
                  location.pathname === "/admin/products/catalog/create"
                    ? "active"
                    : ""
                }`}
              >
                <BookImage size={16} />
                <span>Katalog</span>
              </Link>

              <Link
                to="/admin/products/bundle"
                className={`submenu-link ${
                  isActive("/admin/products/bundle") ||
                  location.pathname === "/admin/products/bundle/create"
                    ? "active"
                    : ""
                }`}
              >
                <Tags size={16} />
                <span>Produk Bundle</span>
              </Link>

              <Link
                to="/admin/products/import"
                className={`submenu-link ${
                  isActive("/admin/products/import") ||
                  location.pathname === "/admin/products/import/history"
                    ? "active"
                    : ""
                }`}
              >
                <CloudDownload size={16} />
                <span>Import (.xlsx)</span>
              </Link>

              <Link
                to="/admin/products/review"
                className={`submenu-link ${
                  isActive("/admin/products/review") ||
                  location.pathname === "/admin/products/review/create"
                    ? "active"
                    : ""
                }`}
              >
                <BookImage size={16} />
                <span>Review</span>
              </Link>
            </div>
          )}
        </div>

        {/* 3. GRUP PESANAN (Menggunakan ID 'orders') */}
        <div className="sidebar-group">
          <div
            className={`sidebar-link group-parent ${
              location.pathname.startsWith("/admin/orders")
                ? "active-parent"
                : ""
            }`}
            onClick={() => handleToggle("orders")}
            style={{ cursor: "pointer", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShoppingCart size={20} />
              <span>Pesanan</span>
            </div>
            {isMenuOpen("orders") ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>

          {/* Submenu Container */}
          {isMenuOpen("orders") && (
            <div className="sidebar-submenu">
              {/* A. Pesanan Aktif */}
              <Link
                to="/admin/orders"
                className={`submenu-link ${
                  location.pathname === "/admin/orders" ||
                  location.pathname.startsWith("/admin/orders/detail")
                    ? "active"
                    : ""
                }`}
              >
                <ShoppingBag size={16} />
                <span>Pesanan Aktif</span>
              </Link>

              {/* B. Draft / Manual */}
              <Link
                to="/admin/orders/drafts"
                className={`submenu-link ${
                  isActive("/admin/orders/drafts") ||
                  location.pathname === "/admin/orders/create"
                    ? "active"
                    : ""
                }`}
              >
                <FileText size={16} />
                <span>Draft / Manual</span>
              </Link>

              {/* C. Checkout Tertinggal */}
              <Link
                to="/admin/orders/abandoned"
                className={`submenu-link ${isActive(
                  "/admin/orders/abandoned"
                )}`}
              >
                <AlertCircle size={16} />
                <span>Checkout Tertinggal</span>
              </Link>
            </div>
          )}
        </div>

        {/* 4. DISKON */}
        <Link
          to="/admin/discounts"
          className={`sidebar-link ${isActive("/admin/discounts")}`}
        >
          <TicketPercent size={20} />
          <span>Diskon</span>
        </Link>

        {/* 5. PELANGGAN */}
        <div className="sidebar-group">
          <div
            className={`sidebar-link group-parent ${
              location.pathname.startsWith("/admin/customers")
                ? "active-parent"
                : ""
            }`}
            onClick={() => handleToggle("customers")}
            style={{ cursor: "pointer", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <UserStar size={20} />
              <span>Pelanggan</span>
            </div>
            {isMenuOpen("customers") ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>

          {/* Submenu Container */}
          {isMenuOpen("customers") && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/customers"
                className={`submenu-link ${
                  location.pathname === "/admin/customers" ? "active" : ""
                }`}
              >
                <UsersRound size={16} />
                <span>Daftar Pelanggan</span>
              </Link>
              <Link
                to="/admin/customers/segments"
                className={`submenu-link ${
                  isActive("/admin/customers/segments") ? "active" : ""
                }`}
              >
                <Sheet size={16} />
                <span>Segmen</span>
              </Link>
              <Link
                to="/admin/customers/affiliates"
                className={`submenu-link ${isActive(
                  "/admin/customers/affiliates"
                )}`}
              >
                <Handshake size={16} />
                <span>Affiliasi</span>
              </Link>
              <Link
                to="/admin/customers/resellers"
                className={`submenu-link ${isActive(
                  "/admin/customers/resellers"
                )}`}
              >
                <Link2 size={16} />
                <span>Reseller</span>
              </Link>
            </div>
          )}
        </div>

        {/* 5. Pemasaran */}
        <div className="sidebar-group">
          <div
            className={`sidebar-link group-parent ${
              location.pathname.startsWith("/admin/marketing")
                ? "active-parent"
                : ""
            }`}
            onClick={() => handleToggle("marketing")}
            style={{ cursor: "pointer", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Megaphone size={20} />
              <span>Pemasaran</span>
            </div>
            {isMenuOpen("marketing") ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>

          {/* Submenu Container */}
          {isMenuOpen("marketing") && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/marketing/newsletter"
                className={`submenu-link ${
                  location.pathname === "/admin/marketing/newsletter"
                    ? "active"
                    : ""
                }`}
              >
                <Newspaper size={16} />
                <span>Email Newsletters</span>
              </Link>
              <Link
                to="/admin/marketing/sms"
                className={`submenu-link ${
                  isActive("/admin/marketing/sms") ? "active" : ""
                }`}
              >
                <Smartphone size={16} />
                <span>SMS Blast</span>
              </Link>
            </div>
          )}
        </div>

        {/* 6. LAPORAN (Menggunakan ID 'reports') */}
        <div className="sidebar-group">
          <div
            className={`sidebar-link group-parent ${
              location.pathname.startsWith("/admin/reports")
                ? "active-parent"
                : ""
            }`}
            onClick={() => handleToggle("reports")}
            style={{ cursor: "pointer", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BookA size={20} />
              <span>Laporan</span>
            </div>
            {isMenuOpen("reports") ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>

          {/* Submenu Container */}
          {isMenuOpen("reports") && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/reports"
                className={`submenu-link ${
                  location.pathname === "/admin/reports" ? "active" : ""
                }`}
              >
                <BookMarked size={16} />
                <span>Umum</span>
              </Link>
              <Link
                to="/admin/reports/sales"
                className={`submenu-link ${
                  isActive("/admin/reports/sales") ? "active" : ""
                }`}
              >
                <HandCoins size={16} />
                <span>Penjualan</span>
              </Link>
              <Link
                to="/admin/reports/finance"
                className={`submenu-link ${isActive("/admin/reports/finance")}`}
              >
                <Banknote size={16} />
                <span>Keuangan</span>
              </Link>
            </div>
          )}
        </div>

        {/* 7. BLOG */}
        <Link
          to="/admin/blog"
          className={`sidebar-link ${isActive("/admin/blog")}`}
        >
          <Rss size={20} />
          <span>Blog</span>
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
                to="/admin/settings/payment"
                className={`submenu-link ${
                  isActive("/admin/settings/payment") ? "active" : ""
                }`}
              >
                <Wallet size={16} />
                <span>Pembayaran</span>
              </Link>
              <Link
                to="/admin/settings/shipping"
                className={`submenu-link ${
                  isActive("/admin/settings/shipping") ? "active" : ""
                }`}
              >
                <Truck size={16} />
                <span>Pengiriman</span>
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
