// frontend/src/components/PageHeaderManager.jsx
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { findRouteConfig } from '../config/routesConfig';
import {APP_CONFIG} from '../config/appConfig';

const setFavicon = (href) => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = href;
}

const PageHeaderManager = () => {
    const location = useLocation();
    // eslint-disable-next-line no-unused-vars
    const params = useParams(); // Mungkin tidak perlu, tapi bisa digunakan untuk judul dinamis

    useEffect(() => {
        // Ambil path saat ini (misalnya: /admin/products/edit/1)
        const currentPathname = location.pathname;
        
        // Cari konfigurasi rute yang cocok
        const routeConfig = findRouteConfig(currentPathname);
        
        let finalTitle = "E-commerce App";

        if (routeConfig) {
            finalTitle = `${routeConfig.title} | ${APP_CONFIG.APP_TITLE}`;
        } else {
            // Logika fallback jika rute tidak ditemukan (misalnya 404)
            finalTitle = `Halaman Tidak Ditemukan | ${APP_CONFIG.APP_TITLE}`;
        }
        
        document.title = finalTitle;
        if (currentPathname.startsWith('/admin')) {
            setFavicon(APP_CONFIG.FAVICON_ADMIN);
        } else {
            setFavicon(APP_CONFIG.FAVICON_PUBLIC);
        }
        
    }, [location.pathname]);

    return null; // Komponen ini hanya untuk logika (tidak merender apa-apa)
};

export default PageHeaderManager;