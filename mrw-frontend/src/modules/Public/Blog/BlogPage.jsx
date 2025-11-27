import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Ganti sesuai port backend Anda
const API_URL = "http://localhost:5001/api/blog";

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(API_URL)
            .then(res => setPosts(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Memuat artikel...</div>;

    return (
        <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
            <h1 style={{textAlign: 'center', marginBottom: '40px', color: '#333'}}>Marawa Journal</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {posts.map(post => (
                    <article key={post.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s' }}>
                        <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img src={post.image_url || 'https://placehold.co/600x400'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', color: '#222' }}>{post.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                                    {post.excerpt ? post.excerpt : post.content.substring(0, 100) + '...'}
                                </p>
                                <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                    {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
};
export default BlogPage;