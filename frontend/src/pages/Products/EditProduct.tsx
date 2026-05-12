import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../../context/CategoryContext";
import "./ProductForm.css";

const PRODUCT_URL = "http://127.0.0.1:8001/api/product/";

type FormState = {
  name: string;
  description: string;
  price: string;
  quantity: string;
  brand: string;
  category: string;
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading: categoryLoading } = useCategories();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
  });
  const [initialCategory, setInitialCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${PRODUCT_URL}${id}/`);
        const data = await res.json();

        setInitialCategory(data.category || "");
        setForm({
          name: data.name || "",
          description: data.description || "",
          price:
            data.price !== undefined && data.price !== null
              ? String(data.price)
              : "",
          quantity:
            data.quantity !== undefined && data.quantity !== null
              ? String(data.quantity)
              : "",
          brand: data.brand || "",
          category: data.category || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildPayload = () => {
    const payload: Record<string, string | number> = {
      name: form.name.trim(),
      brand: form.brand.trim(),
    };
    const desc = form.description.trim();
    payload.description = desc;

    if (form.price !== "") {
      const n = Number(form.price);
      if (!Number.isNaN(n) && n >= 0) payload.price = n;
    }
    if (form.quantity !== "") {
      const q = Number(form.quantity);
      if (!Number.isNaN(q) && q >= 0) payload.quantity = q;
    }
    return payload;
  };

  const syncCategory = async () => {
    if (!id) return;
    const prev = initialCategory || "";
    const next = form.category;
    if (prev === next) return;

    if (prev) {
      await fetch(
        `http://127.0.0.1:8001/api/categories/${prev}/products/${id}/`,
        { method: "DELETE" },
      );
    }
    await fetch(`http://127.0.0.1:8001/api/categories/${next}/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setFormError("");
    if (!form.category) {
      setFormError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${PRODUCT_URL}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      await syncCategory();
      navigate(`/products/${id}`);
    } catch (err) {
      console.error("Error updating product", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || categoryLoading) {
    return (
      <div className="product-form-page">
        <p className="product-form-loading">Loading product…</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="product-form-page">
        <header className="product-form-hero">
          <button
            type="button"
            className="product-form-back"
            onClick={() => navigate(`/products/${id}`)}
          >
            ← Product
          </button>
          <h1 className="product-form-hero-title">Edit product</h1>
          <p className="product-form-hero-sub">
            There are no categories yet. Create one before you can assign this
            product.
          </p>
        </header>
        <div className="product-form-panel">
          <p className="product-form-message product-form-message--error">
            No categories available.
          </p>
          <div className="product-form-actions">
            <button
              type="button"
              className="product-form-btn product-form-btn--primary"
              onClick={() => navigate("/categories")}
            >
              Go to categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <header className="product-form-hero">
        <button
          type="button"
          className="product-form-back"
          onClick={() => navigate(`/products/${id}`)}
        >
          ← Product
        </button>
        <h1 className="product-form-hero-title">Edit product</h1>
        <p className="product-form-hero-sub">
          Category is <strong>required</strong>. You can also update name,
          brand, price, stock, and description.
        </p>
      </header>

      <div className="product-form-panel">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-form-field">
            <label className="product-form-label" htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="edit-brand">
              Brand
            </label>
            <input
              id="edit-brand"
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="edit-price">
              Price (₹) <span className="optional">optional</span>
            </label>
            <input
              id="edit-price"
              type="number"
              name="price"
              min={0}
              step={1}
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="edit-quantity">
              In stock <span className="optional">optional</span>
            </label>
            <input
              id="edit-quantity"
              type="number"
              name="quantity"
              min={0}
              step={1}
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="edit-description">
              Description <span className="optional">optional</span>
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="edit-category">
              Category
            </label>
            <select
              id="edit-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="product-form-actions">
            <button
              type="submit"
              className="product-form-btn product-form-btn--primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              className="product-form-btn product-form-btn--ghost"
              onClick={() => navigate(`/products/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>

        {formError ? (
          <p className="product-form-message product-form-message--error">
            {formError}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default EditProduct;
