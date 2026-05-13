import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../context/CategoryContext";
import "../Products/ProductForm.css";

const CATEGORY_URL = "http://127.0.0.1:8001/api/categories/";

type FormState = {
    title: string;
    description: string;
    author: string;
};

const emptyForm: FormState = {
    title: "",
    description: "",
    author: "",
};

const AddCategory = () => {
    const navigate = useNavigate();
    const { refreshCategories } = useCategories();

    const [form, setForm] = useState<FormState>(emptyForm);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageTone, setMessageTone] = useState<
        "neutral" | "success" | "error"
    >("neutral");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const buildPayload = () => {
        const payload: Record<string, string> = {
            title: form.title.trim(),
        };
        const desc = form.description.trim();
        if (desc) payload.description = desc;
        const author = form.author.trim();
        if (author) payload.author = author;
        return payload;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setMessageTone("neutral");

        try {
            const res = await fetch(CATEGORY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPayload()),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                console.error(errBody);
                throw new Error("Failed to create category");
            }

            refreshCategories();
            setMessage("Category created successfully.");
            setMessageTone("success");
            setTimeout(() => navigate("/categories"), 800);
        } catch (err) {
            console.error(err);
            setMessage("Could not create category. Check the title and try again.");
            setMessageTone("error");
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="product-form-hero-title">Add category</h1>
                <p className="product-form-hero-sub">
                    Title is required (max 100 characters). Description and author are
                    optional.
                </p>
            </header>

            <div className="product-form-panel">
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="product-form-field">
                        <label className="product-form-label" htmlFor="cat-add-title">
                            Title
                        </label>
                        <input
                            id="cat-add-title"
                            type="text"
                            name="title"
                            placeholder="e.g. Food"
                            value={form.title}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            autoComplete="off"
                        />
                    </div>

                    <div className="product-form-field">
                        <label className="product-form-label" htmlFor="cat-add-description">
                            Description <span className="optional">optional</span>
                        </label>
                        <textarea
                            id="cat-add-description"
                            name="description"
                            placeholder="What belongs in this aisle"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="product-form-field">
                        <label className="product-form-label" htmlFor="cat-add-author">
                            Author <span className="optional">optional</span>
                        </label>
                        <input
                            id="cat-add-author"
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
                            disabled={loading}
                        >
                            {loading ? "Creating…" : "Create category"}
                        </button>
                        <button
                            type="button"
                            className="product-form-btn product-form-btn--ghost"
                            onClick={() => navigate("/categories")}
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

export default AddCategory;
