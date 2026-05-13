import React, { useEffect, useState } from "react";
import ProductCard from "../../components/Product/ProductCard";
import { Product } from "../../types/Product";
import { useCategories } from "../../context/CategoryContext";
import "./Products.css";

const PRODUCT_URL = "http://127.0.0.1:8001/api/product/";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [page, setPage] = useState(1);

  const [minPrice, setMinprice] = useState(0);
  const [maxPrice, setMaxprice] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");

  const { categoryMap, loading: categoryLoading } = useCategories();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      const nextPageQuery = new URLSearchParams();

      query.append("sortby", sort);
      query.append("page", page.toString());

      if (name) query.append("name", name);
      if (brand) query.append("brand", brand);
      if (minPrice) query.append("min_price", minPrice.toString());
      if (maxPrice !== null) query.append("max_price", maxPrice.toString());

      const res = await fetch(`${PRODUCT_URL}?${query.toString()}`);
      const data = await res.json();

      nextPageQuery.append("sortby", sort);
      nextPageQuery.append("page", (page + 1).toString());
      if (name) nextPageQuery.append("name", name);
      if (brand) nextPageQuery.append("brand", brand);
      if (minPrice) nextPageQuery.append("min_price", minPrice.toString());
      if (maxPrice !== null)
        nextPageQuery.append("max_price", maxPrice.toString());
      const nextPageUrl = `${PRODUCT_URL}?${nextPageQuery.toString()}`;
      const nextPageRes = await fetch(nextPageUrl);
      const nextPageData = await nextPageRes.json();

      setHasNextPage(nextPageData.length > 0);

      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delay);
  }, [sort, page, name, brand, minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [name, brand, minPrice, maxPrice]);

  if (loading || categoryLoading) {
    return (
      <div className="products-page">
        <p className="products-loading">Loading products…</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <header className="products-hero">
        <div className="products-hero-top">
          <h1 className="products-hero-title">Products</h1>
          <nav
            className="pagination products-hero-pagination"
            aria-label="Pagination"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              type="button"
              disabled={!hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </nav>
        </div>
        <p className="products-hero-sub">
          Search, filter by price, and sort like a playlist — but for inventory.
        </p>
      </header>

      <section className="products-toolbar" aria-label="Filters and sort">
        <div className="products-toolbar-row">
          <div className="products-sort">
            <label htmlFor="products-sort">Sort</label>
            <select
              id="products-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="filter-form">
          <input
            type="search"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Filter by product name"
          />
          <input
            type="search"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            aria-label="Filter by brand"
          />
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice || ""}
            onChange={(e) =>
              setMinprice(e.target.value === "" ? 0 : Number(e.target.value))
            }
            aria-label="Minimum price"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxprice(e.target.value ? Number(e.target.value) : null)
            }
            aria-label="Maximum price"
          />
        </div>
      </section>

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="products-empty">No products found.</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryTitle={
                p.category ? categoryMap.get(p.category)?.title : undefined
              }
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Products;
