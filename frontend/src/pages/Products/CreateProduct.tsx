import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  brand: "",
  category: "",
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const { categories, loading: categoryLoading } = useCategories();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<
    "neutral" | "success" | "error"
  >("neutral");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const buildPayload = () => {
    const payload: Record<string, string | number> = {
      name: form.name.trim(),
      brand: form.brand.trim(),
    };
    const desc = form.description.trim();
    if (desc) payload.description = desc;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageTone("neutral");

    if (!form.category) {
      setMessage("Please select a category.");
      setMessageTone("error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(PRODUCT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();
      const productId = data.id || data._id;

      await fetch(
        `http://127.0.0.1:8001/api/categories/${form.category}/products/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId }),
        },
      );

      setMessage("Product created successfully.");
      setMessageTone("success");
      setTimeout(() => navigate("/products"), 800);
    } catch (err) {
      console.error(err);
      setMessage("Could not create product. Check required fields.");
      setMessageTone("error");
    } finally {
      setLoading(false);
    }
  };

  if (categoryLoading) {
    return (
      <div className="product-form-page">
        <p className="product-form-loading">Loading…</p>
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
            onClick={() => navigate("/products")}
          >
            ← Products
          </button>
          <h1 className="product-form-hero-title">Add product</h1>
          <p className="product-form-hero-sub">
            You need at least one category before you can add a product.
          </p>
        </header>
        <div className="product-form-panel">
          <p className="product-form-message product-form-message--error">
            No categories available. Create a category first, then try again.
          </p>
          <div className="product-form-actions">
            <button
              type="button"
              className="product-form-btn product-form-btn--primary"
              onClick={() => navigate("/categories/create")}
            >
              Add a category
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
          onClick={() => navigate("/products")}
        >
          ← Products
        </button>
        <h1 className="product-form-hero-title">Add product</h1>
        <p className="product-form-hero-sub">
          Name, brand, price, stock, description — and a{" "}
          <strong>required</strong> category.
        </p>
      </header>

      <div className="product-form-panel">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-form-field">
            <label className="product-form-label" htmlFor="create-name">
              Name
            </label>
            <input
              id="create-name"
              type="text"
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="create-brand">
              Brand
            </label>
            <input
              id="create-brand"
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="create-price">
              Price (₹) <span className="optional">optional</span>
            </label>
            <input
              id="create-price"
              type="number"
              name="price"
              placeholder="e.g. 99"
              min={0}
              step={1}
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="create-quantity">
              In stock <span className="optional">optional</span>
            </label>
            <input
              id="create-quantity"
              type="number"
              name="quantity"
              placeholder="Units on hand"
              min={0}
              step={1}
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="create-description">
              Description <span className="optional">optional</span>
            </label>
            <textarea
              id="create-description"
              name="description"
              placeholder="What buyers should know"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="product-form-field">
            <label className="product-form-label" htmlFor="create-category">
              Category
            </label>
            <select
              id="create-category"
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
              disabled={loading}
            >
              {loading ? "Creating…" : "Create product"}
            </button>
            <button
              type="button"
              className="product-form-btn product-form-btn--ghost"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>
          </div>
        </form>

        {message ? (
          <p
            className={`product-form-message ${
              messageTone === "success"
                ? "product-form-message--success"
                : messageTone === "error"
                  ? "product-form-message--error"
                  : ""
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default CreateProduct;
