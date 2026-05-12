import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const LOGO_SRC = `${process.env.PUBLIC_URL ?? ""}/stockify.png`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isHome = path === "/" || path === "";
  const isCreate = path === "/products/create" || path === "/products/create/";
  const isProductsSection =
    path.startsWith("/products") &&
    !path.startsWith("/products/create") &&
    (path === "/products" ||
      path === "/products/" ||
      /^\/products\/[^/]+(\/edit)?\/?$/.test(path));
  const isCategories = path.startsWith("/categories");

  return (
    <nav className="navbar">
      <button
        type="button"
        className="navbar-brand"
        onClick={() => navigate("/")}
        aria-label="Stockify — home"
      >
        <img
          className="navbar-logo-img"
          src={LOGO_SRC}
          alt=""
          width={32}
          height={32}
          decoding="async"
        />
        <span className="navbar-wordmark">Stockify</span>
      </button>

      <div className="navbar-links">
        <button
          type="button"
          className={`nav-btn ${isHome ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          type="button"
          className={`nav-btn ${isCreate ? "active" : ""}`}
          onClick={() => navigate("/products/create")}
        >
          Add product
        </button>
        <button
          type="button"
          className={`nav-btn ${isProductsSection ? "active" : ""}`}
          onClick={() => navigate("/products")}
        >
          Products
        </button>

        <button
          type="button"
          className={`nav-btn ${isCategories ? "active" : ""}`}
          onClick={() => navigate("/categories")}
        >
          Categories
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
