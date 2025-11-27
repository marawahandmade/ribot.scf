// frontend/src/modules/Public/routes.jsx
import React from "react";
import { Route } from "react-router-dom";

// Import View langsung dari folder fiturnya
import HomePage from "./Home/index";
import ProductList from "./Product/ProductList";
import ProductDetail from "./Product/ProductDetail";
import CartPage from "./Cart/CartPage";
import CheckoutPage from "./Order/CheckoutPage";
import OrderSuccessPage from "./Order/OrderSuccessPage";
import TrackOrderPage from "./Order/TrackOrderPage";
import BlogPage from "./Blog/BlogPage";
import BlogDetail from "./Blog/BlogDetail";

export const publicRoutes = (
  <>
    <Route index element={<HomePage />} />
    {/* Grouping Product Routes */}
    <Route path="products">
      <Route index element={<ProductList />} /> {/* /products */}
      {/* Hapus /:id dan /detail/:id, biarkan /products/detail/:id
              yang ada di routesConfig.js
            */}
    </Route>
    {/* Rute detail dipisah agar /products/detail/:id berfungsi */}
    <Route path="products/detail/:id" element={<ProductDetail />} />
    {/* PINDAHKAN Rute Keranjang ke level atas (root) 
          agar cocok dengan link di Layout dan routesConfig.js
        */}
    <Route path="cart" element={<CartPage />} /> {/* /cart */}
    <Route path="checkout" element={<CheckoutPage />} />
    {/* /checkout */}
    <Route path="order-success" element={<OrderSuccessPage />} />{" "}
    {/* /order/success */}
    <Route path="track-order" element={<TrackOrderPage />} />{" "}
    {/* /track-order */}
    {/* Rute Blog*/}
    <Route path="blog" element={<BlogPage />} />
    <Route path="blog/:slug" element={<BlogDetail />} />
  </>
);
