import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_URL = "http://localhost:5001/api/blog";

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/${slug}`)
            .then(res => {
                setPost(res.data);
                document.title = `${res.data.title} | Marawa Handmade`;
            })
            .catch(() => console.error("Artikel tidak ditemukan"))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Memuat artikel...</div>;
    if (!post) return <div style={{textAlign:'center', padding:'50px'}}>Artikel tidak ditemukan. <Link to="/blog">Kembali</Link></div>;

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 20px'}}>
            <Link to="/blog" style={{display:'inline-flex', alignItems:'center', gap:'5px', textDecoration:'none', color:'#666', marginBottom:'20px'}}>
                <ArrowLeft size={16}/> Kembali ke Blog
            </Link>
            
            <h1 style={{fontSize: '2.5rem', marginBottom: '10px', color:'#111'}}>{post.title}</h1>
            <div style={{color:'#888', marginBottom:'30px', fontSize:'0.9rem'}}>
                Ditulis oleh {post.author} • {new Date(post.created_at).toLocaleDateString('id-ID', { weekday:'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            {post.image_url && (
                <img src={post.image_url} alt={post.title} 
                     style={{width:'100%', maxHeight:'500px', objectFit:'cover', borderRadius:'8px', marginBottom:'40px'}} />
            )}

            <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
                {/* Rendering sederhana untuk newlines */}
                {post.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} style={{ marginBottom: '20px' }}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
};
export default BlogDetail;