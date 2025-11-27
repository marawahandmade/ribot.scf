/* eslint-disable react-hooks/immutability */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { findRouteConfig } from "../config/routesConfig";
import { House, ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  
  // 1. Cek apakah kita sedang berada di area Admin
  const isAdminArea = location.pathname.startsWith("/admin");

  // Pecah path menjadi array
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Jangan tampilkan di halaman login
  if (pathnames.length > 0 && pathnames[0] === "login") {
    return null;
  }
  
  // Jika di root halaman publik (pathnames kosong), return null
  if (!isAdminArea && pathnames.length === 0) {
      return null;
  }

  // 2. Tentukan Link Home dan Path Awal
  // Jika Admin: Home Icon -> /admin. Start path loop dari '/admin'
  // Jika Publik: Home Icon -> /. Start path loop dari ''
  let homeLink = isAdminArea ? "/admin" : "/";
  let currentPath = isAdminArea ? "/admin" : "";

  // 3. Modifikasi Array Pathnames untuk Admin
  // Kita hapus segmen "admin" dari array agar tidak muncul dobel (Home Admin > Admin > Produk)
  // Kita inginnya: Home Admin > Produk
  let displayPathnames = [...pathnames];
  if (isAdminArea && displayPathnames[0] === "admin") {
    displayPathnames.shift(); // Hapus elemen pertama ('admin')
  }

  // Jika di Dashboard Admin murni (/admin), breadcrumb tidak perlu muncul (opsional, tapi lebih bersih)
  if (isAdminArea && displayPathnames.length === 0) {
      return null; 
  }

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center text-sm text-gray-500 mb-4"
      style={{ padding: "10px 0", fontSize: "0.9rem", color: "#6c757d", display: 'flex', alignItems: 'center' }}
    >
      {/* Ikon Rumah: Link dinamis berdasarkan area */}
      <Link to={homeLink} style={{ textDecoration: "none", color: "#007bff", display: 'flex', alignItems: 'center' }}>
        <House size={16} style={{marginRight: '5px'}} />
        {isAdminArea ? "Dashboard" : "Home"} 
      </Link>

      {displayPathnames.map((name, index) => {
        const isLast = index === displayPathnames.length - 1;
        
        // Sambungkan path. 
        // Karena currentPath admin sudah '/admin', kita tinggal tambah '/produk' dst.
        currentPath += `/${name}`;

        let displayName = null;
        
        const routeConfig = findRouteConfig(currentPath);

        if (routeConfig) {
           displayName = routeConfig.title;
           
           if (routeConfig.path.includes('/:id') && isLast) {
               displayName = routeConfig.title;
           }
        } 
        
        if (!displayName && isLast) {
            // Logika pencarian parent untuk ID dinamis
            // Perlu hati-hati karena displayPathnames sudah di-shift untuk admin
            // Kita cari parent path string murni dari currentPath yang sedang dibangun
            const pathParts = currentPath.split('/').filter(x => x);
            pathParts.pop(); // Buang ID terakhir
            const parentPathString = '/' + pathParts.join('/');
            
            const dynamicConfig = findRouteConfig(`${parentPathString}/:id`);
            
            if (dynamicConfig) {
                displayName = dynamicConfig.title;
            } else if (!isNaN(name)) {
                displayName = `ID: ${name}`;
            }
        }

        if (!displayName) return null;

        return (
          <span key={currentPath} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ margin: "0 5px", display: 'flex' }}>
                <ChevronRight size={16} />
            </span>
            {isLast ? (
              <span style={{ fontWeight: "bold", color: "#495057" }}>
                {displayName}
              </span>
            ) : (
              <Link
                to={currentPath}
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;