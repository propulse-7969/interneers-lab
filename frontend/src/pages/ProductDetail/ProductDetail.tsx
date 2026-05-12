import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../../types/Product";
import { useCategories } from "../../context/CategoryContext";
import "./ProductDetail.css";

const PRODUCT_URL = "http://127.0.0.1:8001/api/product/";

function coverHueFromId(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i += 1) n += id.charCodeAt(i);
  return n % 360;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { categories, categoryMap, loading: categoryLoading } = useCategories();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PRODUCT_URL}${id}/`);
      const data = await res.json();
      setProduct({ ...data, id: data.id || data._id });
    } catch (err) {
      console.error("Error fetching product", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleCategoryChange = async (categoryId: string) => {
    if (!product) return;
    setUpdating(true);
    try {
      if (!categoryId) {
        if (product.category) {
          await fetch(
            `http://127.0.0.1:8001/api/categories/${product.category}/products/${product.id}/`,
            { method: "DELETE" },
          );
          fetchProduct();
        }
      } else {
        await fetch(
          `http://127.0.0.1:8001/api/categories/${categoryId}/products/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: product.id }),
          },
        );
        fetchProduct();
      }
    } catch (err) {
      console.error("Error updating category", err);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    try {
      await fetch(`${PRODUCT_URL}${product.id}/`, { method: "DELETE" });
      navigate("/products");
    } catch (err) {
      console.error("Error deleting product", err);
      setDeleting(false);
    }
  };

  if (loading || categoryLoading) {
    return (
      <div className="detail-page">
        <p className="detail-loading">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <p className="detail-not-found">Product not found.</p>
        <button
          type="button"
          className="detail-btn detail-btn--primary"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>
      </div>
    );
  }

  const category = product.category ? categoryMap.get(product.category) : null;

  const initial = (product.name || "?").trim().charAt(0).toUpperCase();
  const hue = coverHueFromId(product.id);
  const coverStyle = {
    background: `linear-gradient(155deg, hsl(${hue}, 42%, 32%) 0%, var(--sp-highlight) 55%, var(--sp-black) 100%)`,
  } as React.CSSProperties;

  return (
    <div className="detail-page">
      <header className="detail-hero">
        <button
          type="button"
          className="detail-back"
          onClick={() => navigate("/products")}
        >
          ← Products
        </button>
        <h1 className="detail-hero-title">Product</h1>
        <p className="detail-hero-sub">Details, category, and actions</p>
      </header>

      <div className="detail-layout">
        <div className="detail-panel detail-panel--main">
          <div className="detail-cover" style={coverStyle} aria-hidden="true">
            <span className="detail-cover-initial">{initial}</span>
          </div>

          <h2 className="detail-name">{product.name}</h2>
          <p className="detail-brand">{product.brand}</p>
          <p className="detail-price">
            {product.price !== undefined && product.price !== null
              ? `₹${product.price.toLocaleString("en-IN")}`
              : "—"}
          </p>
          {product.quantity !== undefined && product.quantity !== null ? (
            <p className="detail-stock">{product.quantity} in stock</p>
          ) : null}

          <p className="detail-description">
            {product.description?.trim() || "No description."}
          </p>

          <div className="detail-meta">
            <span className="detail-meta-label">Category</span>
            {category ? (
              <button
                type="button"
                className="detail-category-link"
                onClick={() => navigate(`/categories/${category.id}`)}
              >
                {category.title}
              </button>
            ) : (
              <span className="detail-uncategorized">Uncategorized</span>
            )}
          </div>

          <div className="detail-field">
            <label
              className="detail-field-label"
              htmlFor="detail-category-select"
            >
              Change category
            </label>
            <select
              id="detail-category-select"
              className="detail-select"
              disabled={updating}
              value={product.category || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {updating ? <p className="detail-updating">Updating…</p> : null}
        </div>

        <div className="detail-panel detail-panel--actions">
          <h3 className="detail-actions-title">Actions</h3>
          <div className="detail-actions-row">
            <button
              type="button"
              className="detail-btn detail-btn--primary"
              onClick={() => navigate(`/products/${product.id}/edit`)}
            >
              Edit product
            </button>
          </div>

          <div className="detail-danger">
            {!confirmDelete ? (
              <button
                type="button"
                className="detail-btn detail-btn--danger"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                Delete product
              </button>
            ) : (
              <div className="detail-confirm">
                <p className="detail-confirm-text">
                  Delete <strong>{product.name}</strong>? This cannot be undone.
                </p>
                <div className="detail-confirm-row">
                  <button
                    type="button"
                    className="detail-btn detail-btn--danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    className="detail-btn detail-btn--ghost"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
