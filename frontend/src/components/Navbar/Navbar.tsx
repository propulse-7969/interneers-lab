import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const LOGO_SRC = `${process.env.PUBLIC_URL ?? ""}/stockify.png`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const reportMenuRef = useRef<HTMLDivElement>(null);

  const path = location.pathname;
  const isHome = path === "/" || path === "";
  const isCreate = path === "/products/create" || path === "/products/create/";
  const isProductsSection =
    path.startsWith("/products") &&
    !path.startsWith("/products/create") &&
    (path === "/products" ||
      path === "/products/" ||
      /^\/products\/[^/]+(\/edit)?\/?$/.test(path));
  const isCategories =
    path.startsWith("/categories") && !path.startsWith("/reports");
  const isProductReport =
    path === "/reports/products" || path === "/reports/products/";
  const isCategoryReport =
    path === "/reports/categories" || path === "/reports/categories/";
  const isReportsSection = isProductReport || isCategoryReport;

  useEffect(() => {
    setReportMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!reportMenuOpen) return undefined;
    const onPointerDown = (e: PointerEvent) => {
      if (
        reportMenuRef.current &&
        !reportMenuRef.current.contains(e.target as Node)
      ) {
        setReportMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReportMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [reportMenuOpen]);

  const goReport = (to: string) => {
    navigate(to);
    setReportMenuOpen(false);
  };

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

        <div className="navbar-report-dropdown" ref={reportMenuRef}>
          <button
            type="button"
            className={`navbar-report-trigger ${isReportsSection ? "navbar-report-trigger--active" : ""}`}
            aria-haspopup="menu"
            aria-expanded={reportMenuOpen}
            aria-controls="navbar-report-menu"
            id="navbar-report-trigger"
            onClick={() => setReportMenuOpen((open) => !open)}
          >
            <span className="navbar-report-trigger-glyph" aria-hidden="true">
              ✦
            </span>
            <span className="navbar-report-trigger-label">Generate report</span>
            <span
              className={`navbar-report-chevron${reportMenuOpen ? " navbar-report-chevron--open" : ""}`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
          {reportMenuOpen ? (
            <div
              className="navbar-report-menu"
              id="navbar-report-menu"
              role="menu"
              aria-labelledby="navbar-report-trigger"
            >
              <button
                type="button"
                role="menuitem"
                className={`navbar-report-menu-item${isProductReport ? " navbar-report-menu-item--current" : ""}`}
                onClick={() => goReport("/reports/products")}
              >
                <span className="navbar-report-menu-kicker" aria-hidden="true">
                  ⚡
                </span>
                <span className="navbar-report-menu-text">
                  <span className="navbar-report-menu-title">
                    Product report
                  </span>
                  <span className="navbar-report-menu-desc">
                    Low-stock SKUs under a threshold
                  </span>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={`navbar-report-menu-item${isCategoryReport ? " navbar-report-menu-item--current" : ""}`}
                onClick={() => goReport("/reports/categories")}
              >
                <span className="navbar-report-menu-kicker" aria-hidden="true">
                  ◇
                </span>
                <span className="navbar-report-menu-text">
                  <span className="navbar-report-menu-title">
                    Category report
                  </span>
                  <span className="navbar-report-menu-desc">
                    Counts per category with filters
                  </span>
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
