import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductReport.css";

const REPORT_URL = "http://127.0.0.1:8001/api/report/products/";
const DEFAULT_THRESHOLD = 8;

type LowStockRow = {
  product_id: string;
  product_name: string;
  product_quantity: number;
};

type ProductReportResponse = {
  report: LowStockRow[];
  analysis: string;
};

function parseThreshold(raw: string): number | null {
  const parsed = Number.parseInt(raw.trim(), 10);
  if (Number.isNaN(parsed) || parsed < 1) return null;
  return Math.min(parsed, 1_000_000);
}

const ProductReport = () => {
  const [thresholdInput, setThresholdInput] = useState(
    String(DEFAULT_THRESHOLD),
  );
  const [report, setReport] = useState<LowStockRow[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (thresholdValue: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("threshold", String(thresholdValue));
      const res = await fetch(`${REPORT_URL}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data: ProductReportResponse = await res.json();
      setReport(Array.isArray(data.report) ? data.report : []);
      setAnalysis(typeof data.analysis === "string" ? data.analysis : "");
    } catch (err) {
      console.error("Error fetching product report", err);
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
    void fetchReport(DEFAULT_THRESHOLD);
  }, [fetchReport]);

  const handleUpdateReport = () => {
    const parsed = parseThreshold(thresholdInput);
    if (parsed === null) {
      setThresholdInput(String(DEFAULT_THRESHOLD));
      void fetchReport(DEFAULT_THRESHOLD);
      return;
    }
    void fetchReport(parsed);
  };

  const handleRetry = () => {
    const parsed = parseThreshold(thresholdInput);
    void fetchReport(parsed ?? DEFAULT_THRESHOLD);
  };

  const onThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThresholdInput(e.target.value);
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
            ⚡
          </span>
          <span className="product-report-hero-title-text">
            <span className="product-report-hero-gradient">Low-stock</span>
            <span className="product-report-hero-dot" aria-hidden="true">
              ·
            </span>
            <span className="product-report-hero-rest">report</span>
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
          Products below your threshold, with an AI read on shortages and risk.
          Tap{" "}
          <strong className="product-report-hero-strong">Update report</strong>{" "}
          after changing the number — no background refetch while you type.
        </p>
      </header>

      <section className="product-report-toolbar" aria-label="Report threshold">
        <div className="product-report-threshold">
          <label htmlFor="product-report-threshold">Stock threshold</label>
          <div className="product-report-threshold-row">
            <input
              id="product-report-threshold"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder={String(DEFAULT_THRESHOLD)}
              value={thresholdInput}
              onChange={onThresholdChange}
              aria-describedby="product-report-threshold-hint"
            />
            <button
              type="button"
              className="product-report-update-btn"
              onClick={handleUpdateReport}
              disabled={loading}
            >
              {loading ? "Updating…" : "Update report"}
            </button>
          </div>
          <p id="product-report-threshold-hint" className="product-report-hint">
            Default {DEFAULT_THRESHOLD}. Each row is a product whose quantity is
            strictly below this number. Invalid values fall back to{" "}
            {DEFAULT_THRESHOLD}.
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
          aria-label="Low-stock products"
        >
          <div className="product-report-table-head">
            <h2 className="product-report-section-title">
              <span className="product-report-section-icon" aria-hidden="true">
                ▤
              </span>
              At-risk SKUs
            </h2>
            <span className="product-report-count">
              {report.length} product{report.length === 1 ? "" : "s"}
            </span>
          </div>
          {report.length === 0 ? (
            <p className="product-report-empty">
              No products below this threshold. Inventory looks comfortable for
              now.
            </p>
          ) : (
            <div className="product-report-table-wrap">
              <table className="product-report-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Qty</th>
                    <th scope="col" className="product-report-col-action">
                      <span className="sr-only">Open</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row) => (
                    <tr key={row.product_id}>
                      <td>
                        <span className="product-report-name">
                          {row.product_name}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`product-report-qty${
                            row.product_quantity <= 3
                              ? " product-report-qty--warn"
                              : ""
                          }`}
                        >
                          {row.product_quantity}
                        </span>
                      </td>
                      <td className="product-report-col-action">
                        <Link
                          className="product-report-link"
                          to={`/products/${row.product_id}`}
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

export default ProductReport;
