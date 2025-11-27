import React, { useEffect, useState } from 'react';
import { getProducts } from './service'; // Import dari folder yang sama
import ProductCard from './components/ProductCard'; // Import komponen lokal

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data));
  }, []);

  return (
    <div>
      {/* 1. Tambahkan <style> untuk grid responsif */}
      <style>
        {`
          .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px 0;
          }
          @media (max-width: 600px) {
            .grid-container {
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 10px;
            }
          }
        `}
      </style>

      <h2>Katalog Produk</h2>
      <div className="grid-container">
        {products.map(product => (
            // 2. Pastikan ProductCard di-render
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;