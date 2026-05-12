import React from "react";
import { Route, Routes } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import CreateProduct from "./pages/Products/CreateProduct";
import EditProduct from "./pages/Products/EditProduct";
import Categories from "./pages/Categories/Categories";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import CategoryProducts from "./pages/CategoryProducts/CategoryProducts";
import CategoryReport from "./pages/Reports/CategoryReport/CategoryReport";
import ProductReport from "./pages/Reports/ProductReport/ProductReport";

function App() {
  return (
    <>
      <CategoryProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />

          <Route path="/categories" element={<Categories />} />
          <Route
            path="/categories/:categoryId"
            element={<CategoryProducts />}
          />

          <Route path="/reports/categories" element={<CategoryReport />} />
          <Route path="/reports/products" element={<ProductReport />} />
        </Routes>
      </CategoryProvider>
    </>
  );
}

export default App;
