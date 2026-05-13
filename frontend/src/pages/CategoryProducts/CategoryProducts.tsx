import React, { useEffect, useState, useCallback, useId } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../../components/Product/ProductCard";
import { Product } from "../../types/Product";
import { useCategories } from "../../context/CategoryContext";
import "./CategoryProducts.css";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const deleteTitleId = useId();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { categoryMap, refreshCategories } = useCategories();
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8001/api/categories/${categoryId}/products/`,
      );
      const data = await res.json();

      setProducts(data.results || data);
    } catch (err) {
      console.error("Error fetching category products", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const category = categoryId ? categoryMap.get(categoryId) : null;

  const closeDeleteModal = useCallback(() => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setDeleteError(null);
  }, [deleting]);

  useEffect(() => {
    if (!deleteModalOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDeleteModal();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [deleteModalOpen, closeDeleteModal]);

  const openDeleteModal = () => {
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const confirmDeleteInModal = async () => {
    if (!categoryId || deleting) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(
        `http://127.0.0.1:8001/api/categories/${categoryId}/`,
        { method: "DELETE" },
      );
      if (res.status === 204 || res.ok) {
        setDeleteModalOpen(false);
        refreshCategories();
        navigate("/categories");
        return;
      }
      if (res.status === 404) {
        setDeleteModalOpen(false);
        refreshCategories();
        navigate("/categories");
        return;
      }
      setDeleteError("Could not delete this category. Try again.");
    } catch (err) {
      console.error(err);
      setDeleteError(
        "Could not delete this category. Check your connection.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading products...</p>;
  }

  return (
    <div className="category-products-container">
      <button
        type="button"
        className="category-products-back"
        onClick={() => navigate("/categories")}
      >
        ← Categories
      </button>
      <div className="category-products-heading-row">
        <h2 className="category-products-heading">
          {category ? `${category.title} products` : "Category products"}
        </h2>
        {categoryId ? (
          <div className="category-products-actions">
            <Link
              className="category-products-edit"
              to={`/categories/${categoryId}/edit`}
              aria-label={`Edit ${category?.title || "category"}`}
              title="Edit category"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Link>
            <button
              type="button"
              className="category-products-delete"
              onClick={openDeleteModal}
              disabled={deleting}
              aria-label={`Delete ${category?.title || "category"}`}
              title="Delete category"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products in this category.</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryTitle={category?.title}
            />
          ))
        )}
      </div>

      {deleteModalOpen ? (
        <div
          className="category-products-modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div
            className="category-products-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteTitleId}
          >
            <h3 id={deleteTitleId} className="category-products-modal-title">
              Delete this category?
            </h3>
            <p className="category-products-modal-body">
              <strong>
                {category?.title ? `“${category.title}”` : "This category"}
              </strong>{" "}
              will be removed permanently. This cannot be undone.
            </p>
            {products.length > 0 ? (
              <p className="category-products-modal-warning">
                This category has{" "}
                <strong>
                  {products.length} product
                  {products.length === 1 ? "" : "s"}
                </strong>{" "}
                assigned. Deleting may leave those products without a category.
              </p>
            ) : null}
            {deleteError ? (
              <p className="category-products-modal-error" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="category-products-modal-actions">
              <button
                type="button"
                className="category-products-modal-btn category-products-modal-btn--ghost"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="category-products-modal-btn category-products-modal-btn--danger"
                onClick={confirmDeleteInModal}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete category"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CategoryProducts;
