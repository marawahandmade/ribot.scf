/* eslint-disable react-hooks/static-components */
// frontend/src/modules/Admin/Home/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { ListChecks, AlertTriangle, Loader, WifiOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
// Catatan: Menggunakan path root absolut /TODO.md, karena file sekarang diletakkan 
// sejajar dengan index.html (diakses publik).

// Path yang diminta pengguna: di root publik
const TODO_FILE_PATH = '/TODO.md'; 


function Dashboard() {
    const [todoContent, setTodoContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTodoFile = async (path) => {
        try {
            const response = await fetch(path);
            
            if (!response.ok) {
                // throw new Error(`Gagal memuat file dari path: ${path}`);
                return null; // Jika path gagal, return null
            }
            
            const text = await response.text();
            
            // Cek apakah konten terlihat seperti halaman 404 (jika server merespons 200 dengan konten 404)
            if (text.includes("404 Not Found") || text.trim().length === 0) {
                 return null;
            }
            
            return text;

        } catch (e) {
            console.warn(`[TODO] Gagal fetch dari ${path}:`, e.message);
            return null;
        }
    };

    useEffect(() => {
        const loadTodo = async () => {
            setLoading(true);
            setError(null);
            
            let content = await fetchTodoFile(TODO_FILE_PATH);
            
            if (content) {
                setTodoContent(content);
            } else {
                setError(`File TODO.md tidak ditemukan di jalur: ${TODO_FILE_PATH}. Pastikan file diletakkan di root publik (sejajar dengan index.html).`);
            }
            
            setLoading(false);
        };
        
        loadTodo();
        
    }, []);

    // Komponen Card untuk Statistik (Dibiarkan sama)
    const Card = ({ title, value, icon, color }) => (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            borderLeft: `5px solid ${color}`
        }}>
            <div style={{color: color, fontSize: '1.8rem'}}>{icon}</div>
            <div style={{fontSize: '0.9rem', color: '#6c757d', fontWeight: '500'}}>{title}</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>{value}</div>
        </div>
    );
    
    return (   
        <div className="dashboard-layout">
            <style jsx="true">{`
                .dashboard-layout {
                    display: grid;
                    grid-template-columns: 2fr 1fr; 
                    gap: 30px;
                    padding-bottom: 30px;
                }
                .todo-panel {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    border: 1px solid #e9ecef;
                    position: sticky;
                    top: 20px; 
                    max-height: calc(100vh - 80px); 
                    overflow-y: auto;
                }
                .todo-panel h2 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #007bff;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    font-size: 1.2rem;
                }
                .todo-panel h3 {
                    margin-top: 20px;
                    margin-bottom: 10px;
                    color: #212529; 
                    font-size: 1.1rem;
                    border-left: 4px solid #ffc107; 
                    padding-left: 10px;
                }
                .todo-panel ul {
                    list-style-type: none;
                    padding-left: 0;
                    margin-top: 10px;
                }
                .todo-panel li {
                    margin-bottom: 8px;
                    font-size: 0.95rem;
                    color: #495057;
                }
                
                .todo-panel .task-list-item input[type="checkbox"] {
                    margin-right: 10px;
                    pointer-events: none; 
                }
                .todo-panel .task-list-item {
                    list-style: none; 
                }

                @media (max-width: 992px) {
                    .dashboard-layout {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .todo-panel {
                        position: static;
                        max-height: none;
                        overflow-y: visible;
                    }
                }
            `}</style>

            {/* KONTEN UTAMA DASHBOARD */}
            <div className="dashboard-main-content">
                <h1>Dashboard Admin</h1>
                <p>Selamat datang kembali, Admin! Di sini Anda bisa melihat ikhtisar penjualan, statistik stok, dan aktivitas terbaru.</p>

                {/* AREA UNTUK WIDGET/STATISTIK */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '30px'
                }}>
                    <Card title="Total Produk" value="250" icon="📦" color="#28a745" />
                    <Card title="Pesanan Baru" value="12" icon="🛒" color="#007bff" />
                    <Card title="Total Pendapatan" value="Rp 125 Jt" icon="💰" color="#ffc107" />
                    <Card title="Stok Rendah" value="5" icon="🚨" color="#dc3545" />
                </div>
                
                {/* Tabel Order Terbaru, dll. */}
                <h2 style={{marginTop: '40px', fontSize: '1.5rem', color: '#333'}}>Aktivitas Terbaru</h2>
                <div style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', minHeight: '200px', border: '1px solid #e9ecef'}}>
                    <p style={{color: '#6c757d'}}>Data order, stok, dan user terbaru akan ditampilkan di sini.</p>
                </div>
            </div>

            {/* PANEL TODO LIST */}
            <div className="todo-panel">
                <h2><ListChecks size={24} style={{color: '#007bff'}} /> Daftar Tugas Pengembangan</h2>
                
                {loading && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#007bff', padding: '20px', justifyContent: 'center'}}>
                        <Loader size={20} className="animate-spin" /> <span>Memuat daftar tugas dari disk...</span>
                    </div>
                )}
                
                {!loading && error && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#dc3545', background: '#f8d7da', border: '1px solid #f5c6cb', padding: '20px', borderRadius: '8px'}}>
                        <WifiOff size={24} /> 
                        <p style={{margin: 0, fontWeight: 'bold'}}>Gagal Memuat File</p>
                        <p style={{margin: 0, fontSize: '0.9rem', textAlign: 'center'}}>{error}</p>
                    </div>
                )}
                
                {!loading && todoContent && (
                    <ReactMarkdown 
                        rehypePlugins={[rehypeRaw]} 
                        children={todoContent} 
                    />
                )}

                {!loading && !error && !todoContent && (
                     <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#28a745', background: '#d4edda', border: '1px solid #c3e6cb', padding: '20px', borderRadius: '8px'}}>
                        <CheckCircle size={24} /> 
                        <p style={{margin: 0, fontWeight: 'bold'}}>TODO List Kosong</p>
                        <p style={{margin: 0, fontSize: '0.9rem', textAlign: 'center'}}>Semua tugas sudah selesai. Waktunya merayakan!</p>
                    </div>
                )}


                <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '0.8rem', color: '#999'}}>
                    *File diakses dari jalur: `{TODO_FILE_PATH}`.
                </div>
            </div>
        </div>
    );
}

export default Dashboard;