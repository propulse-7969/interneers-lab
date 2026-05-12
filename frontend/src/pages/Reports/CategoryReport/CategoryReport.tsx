import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../ProductReport/ProductReport.css";
import "./CategoryReport.css";

const REPORT_URL = "http://127.0.0.1:8001/api/report/categories/";

type CategoryCountRow = {
  category: string;
  category_id: string;
  product_count: number;
};

type CategoryReportResponse = {
  report: CategoryCountRow[];
  analysis: string;
};

type CountFilters = {
  min?: number;
  max?: number;
};

function parseOptionalCount(raw: string): {
  value: number | undefined;
  display: string;
} {
  const t = raw.trim();
  if (t === "") return { value: undefined, display: "" };
  const parsed = Number.parseInt(t, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return { value: undefined, display: "" };
  }
  const value = Math.min(parsed, 1_000_000);
  return { value, display: String(value) };
}

const CategoryReport = () => {
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [report, setReport] = useState<CategoryCountRow[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<CountFilters>({});

  const fetchReport = useCallback(async (filters: CountFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.min !== undefined)
        params.set("min_count", String(filters.min));
      if (filters.max !== undefined)
        params.set("max_count", String(filters.max));
      const query = params.toString();
      const url = query ? `${REPORT_URL}?${query}` : REPORT_URL;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data: CategoryReportResponse = await res.json();
      setLastQuery(filters);
      setReport(Array.isArray(data.report) ? data.report : []);
      setAnalysis(typeof data.analysis === "string" ? data.analysis : "");
    } catch (err) {
      console.error("Error fetching category report", err);
      setReport([]);
      setAnalysis("");
      setError(
        err instanceof Error ? err.message : "Could not load this report.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReport({});
  }, [fetchReport]);

  const buildFiltersFromInputs = (): CountFilters => {
    const rMin = parseOptionalCount(minInput);
    const rMax = parseOptionalCount(maxInput);
    setMinInput(rMin.display);
    setMaxInput(rMax.display);

    let min = rMin.value;
    let max = rMax.value;
    if (min !== undefined && max !== undefined && min > max) {
      const t = min;
      min = max;
      max = t;
      setMinInput(String(min));
      setMaxInput(String(max));
    }
    const out: CountFilters = {};
    if (min !== undefined) out.min = min;
    if (max !== undefined) out.max = max;
    return out;
  };

  const handleUpdateReport = () => {
    void fetchReport(buildFiltersFromInputs());
  };

  const handleRetry = () => {
    void fetchReport(buildFiltersFromInputs());
  };

  if (loading && report.length === 0 && !error) {
    return (
      <div className="product-report-page">
        <p className="product-report-loading">Loading report…</p>
      </div>
    );
  }

  return (
    <div className="product-report-page">
      <header className="product-report-hero">
        <h1 className="product-report-hero-title">
          <span className="product-report-hero-glyph" aria-hidden="true">
            ◇
          </span>
          <span className="product-report-hero-title-text">
            <span className="product-report-hero-gradient">Category</span>
            <span className="product-report-hero-dot" aria-hidden="true">
              ·
            </span>
            <span className="product-report-hero-rest">mix report</span>
            <span
              className="product-report-hero-glyph product-report-hero-glyph--end"
              aria-hidden="true"
            >
              ✦
            </span>
          </span>
        </h1>
        <p className="product-report-hero-sub">
          <span className="product-report-hero-sub-icon" aria-hidden="true">
            ◈
          </span>
          Product counts per category with an AI take on variety and balance.
          Set optional min or max counts, then tap{" "}
          <strong className="product-report-hero-strong">Update report</strong>—
          nothing runs while you type.
        </p>
      </header>

      <section className="product-report-toolbar" aria-label="Category filters">
        <div className="product-report-threshold">
          <label id="category-report-filters-label">
            Product count filters (optional)
          </label>
          <div className="product-report-threshold-row category-report-filter-row">
            <div
              className="category-report-count-filters"
              role="group"
              aria-labelledby="category-report-filters-label"
              aria-describedby="category-report-filters-hint"
            >
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Min"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                aria-label="Minimum products per category"
              />
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Max"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                aria-label="Maximum products per category"
              />
            </div>
            <button
              type="button"
              className="product-report-update-btn"
              onClick={handleUpdateReport}
              disabled={loading}
            >
              {loading ? "Updating…" : "Update report"}
            </button>
          </div>
          <p className="product-report-hint" id="category-report-filters-hint">
            Leave both empty for all categories. Invalid numbers are cleared. If
            min is greater than max, they are swapped before fetching.
          </p>
        </div>
      </section>

      {error ? (
        <div className="product-report-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="product-report-layout">
        <section
          className="product-report-table-card"
          aria-label="Category counts"
        >
          <div className="product-report-table-head">
            <h2 className="product-report-section-title">
              <span className="product-report-section-icon" aria-hidden="true">
                ▦
              </span>
              By category
            </h2>
            <span className="product-report-count">
              {report.length} categor{report.length === 1 ? "y" : "ies"}
            </span>
          </div>
          {report.length === 0 ? (
            <p className="product-report-empty">
              {lastQuery.min !== undefined || lastQuery.max !== undefined ? (
                <>
                  No categories match these filters. Try widening the min or max
                  range, or clear both fields.
                </>
              ) : (
                <>No category rows returned for this report.</>
              )}
            </p>
          ) : (
            <div className="product-report-table-wrap">
              <table className="product-report-table">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Products</th>
                    <th scope="col" className="product-report-col-action">
                      <span className="sr-only">Open</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row) => (
                    <tr key={row.category_id}>
                      <td>
                        <span className="product-report-name">
                          {row.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`product-report-qty${
                            row.product_count === 0
                              ? " product-report-qty--warn"
                              : ""
                          }`}
                        >
                          {row.product_count}
                        </span>
                      </td>
                      <td className="product-report-col-action">
                        <Link
                          className="product-report-link"
                          to={`/categories/${row.category_id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="product-report-analysis" aria-label="AI analysis">
          <h2 className="product-report-section-title">
            <span className="product-report-section-icon" aria-hidden="true">
              ✧
            </span>
            AI analysis
          </h2>
          {analysis.trim() ? (
            <div className="product-report-analysis-body">{analysis}</div>
          ) : (
            <p className="product-report-analysis-empty">
              No analysis returned for this run.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CategoryReport;
