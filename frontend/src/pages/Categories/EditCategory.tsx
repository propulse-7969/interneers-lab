import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../../context/CategoryContext";
import "../Products/ProductForm.css";

const categoryUrl = (id: string) =>
    `http://127.0.0.1:8001/api/categories/${id}/`;

type FormState = {
    title: string;
    description: string;
    author: string;
};

const EditCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { categoryMap, loading: categoriesLoading, refreshCategories } =
        useCategories();

    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        author: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageTone, setMessageTone] = useState<
        "neutral" | "success" | "error"
    >("neutral");

    const category = categoryId ? categoryMap.get(categoryId) : undefined;

    useEffect(() => {
        if (categoriesLoading || !categoryId) return;
        if (!category) {
            setForm({ title: "", description: "", author: "" });
            return;
        }
        setForm({
            title: category.title || "",
            description: category.description?.trim() || "",
            author: category.author?.trim() || "",
        });
    }, [categoriesLoading, categoryId, category]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const buildPayload = () => {
        const payload: Record<string, string> = {
            title: form.title.trim(),
            description: form.description.trim(),
            author: form.author.trim(),
        };
        return payload;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) return;

        setSaving(true);
        setMessage("");
        setMessageTone("neutral");

        try {
            const res = await fetch(categoryUrl(categoryId), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPayload()),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                console.error(errBody);
                throw new Error("Failed to update category");
            }

            refreshCategories();
            setMessage("Category updated.");
            setMessageTone("success");
            setTimeout(() => navigate(`/categories/${categoryId}`), 800);
        } catch (err) {
            console.error(err);
            setMessage("Could not save changes. Try again.");
            setMessageTone("error");
        } finally {
            setSaving(false);
        }
    };

    if (categoriesLoading) {
        return (
            <div className="product-form-page">
                <p className="product-form-loading">Loading…</p>
            </div>
        );
    }

    if (!categoryId || !category) {
        return (
            <div className="product-form-page">
                <header className="product-form-hero">
                    <button
                        type="button"
                        className="product-form-back"
                        onClick={() => navigate("/categories")}
                    >
                        ← Categories
                    </button>
                    <h1 className="product-form-hero-title">Edit category</h1>
                    <p className="product-form-hero-sub">
                        This category is missing or was removed.
                    </p>
                </header>
                <div className="product-form-panel">
                    <p className="product-form-message product-form-message--error">
                        Category not found.
                    </p>
                    <div className="product-form-actions">
                        <button
                            type="button"
                            className="product-form-btn product-form-btn--primary"
                            onClick={() => navigate("/categories")}
                        >
                            Back to categories
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
                    onClick={() => navigate(`/categories/${categoryId}`)}
                >
                    ← {category.title}
                </button>
                <h1 className="product-form-hero-title">Edit category</h1>
                <p className="product-form-hero-sub">
                    Update title, description, or author. Changes apply across all
                    products in this category.
                </p>
            </header>

            <div className="product-form-panel">
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="product-form-field">
                        <label className="product-form-label" htmlFor="cat-edit-title">
                            Title
                        </label>
                        <input
                            id="cat-edit-title"
                            type="text"
                            name="title"
                            placeholder="Category title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            autoComplete="off"
                        />
                    </div>

                    <div className="product-form-field">
                        <label
                            className="product-form-label"
                            htmlFor="cat-edit-description"
                        >
                            Description <span className="optional">optional</span>
                        </label>
                        <textarea
                            id="cat-edit-description"
                            name="description"
                            placeholder="What belongs in this aisle"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="product-form-field">
                        <label className="product-form-label" htmlFor="cat-edit-author">
                            Author <span className="optional">optional</span>
                        </label>
                        <input
                            id="cat-edit-author"
                            type="text"
                            name="author"
                            placeholder="Owner or team name"
                            value={form.author}
                            onChange={handleChange}
                            maxLength={100}
                            autoComplete="off"
                        />
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
                            onClick={() => navigate(`/categories/${categoryId}`)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {message ? (
                    <p
                        className={`product-form-message ${messageTone === "success"
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

export default EditCategory;
