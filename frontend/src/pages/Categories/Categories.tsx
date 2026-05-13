import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../context/CategoryContext";
import "./Categories.css";

function coverHueFromId(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i += 1) n += id.charCodeAt(i);
  return n % 360;
}

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategories();

  const go = useCallback(
    (id: string) => {
      navigate(`/categories/${id}`);
    },
    [navigate],
  );

  if (loading) {
    return (
      <div className="categories-page">
        <p className="categories-loading">Loading categories…</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <header className="categories-hero">
        <div className="categories-hero-top">
          <div className="categories-hero-text">
            <h1 className="categories-hero-title">Categories</h1>
            <p className="categories-hero-sub">
              Browse shelves by aisle — tap a tile to see products in that
              category.
            </p>
          </div>
          <button
            type="button"
            className="categories-add-btn"
            onClick={() => navigate("/categories/create")}
          >
            Add category
          </button>
        </div>
      </header>

      <div className="categories-grid">
        {categories.length === 0 ? (
          <p className="categories-empty">No categories yet.</p>
        ) : (
          categories.map((c) => {
            const initial = (c.title || "?").trim().charAt(0).toUpperCase();
            const hue = coverHueFromId(c.id);
            const coverStyle = {
              background: `linear-gradient(155deg, hsl(${hue}, 42%, 32%) 0%, var(--sp-highlight) 55%, var(--sp-black) 100%)`,
            } as React.CSSProperties;

            const onKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                go(c.id);
              }
            };

            return (
              <article
                key={c.id}
                className="category-card"
                role="button"
                tabIndex={0}
                onClick={() => go(c.id)}
                onKeyDown={onKeyDown}
              >
                <div className="category-card-cover-wrap">
                  <div className="category-card-cover" style={coverStyle}>
                    <span className="category-card-cover-initial">
                      {initial}
                    </span>
                  </div>
                </div>
                <div className="category-card-body">
                  <h3 className="category-card-title">{c.title}</h3>
                  <p className="category-card-desc">
                    {c.description?.trim() || "No description"}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Categories;
