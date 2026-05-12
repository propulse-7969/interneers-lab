import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/Product";
import "./ProductCard.css";

type Props = {
  product: Product;
  categoryTitle?: string;
};

function coverHueFromId(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i += 1) n += id.charCodeAt(i);
  return n % 360;
}

const ProductCard = ({ product, categoryTitle }: Props) => {
  const navigate = useNavigate();
  const initial = (product.name || "?").trim().charAt(0).toUpperCase() || "?";
  const hue = coverHueFromId(product.id);
  const coverStyle = {
    background: `linear-gradient(155deg, hsl(${hue}, 42%, 32%) 0%, var(--sp-highlight) 55%, var(--sp-black) 100%)`,
  } as React.CSSProperties;

  const go = useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  const priceLabel =
    product.price !== undefined && product.price !== null
      ? `₹${product.price.toLocaleString("en-IN")}`
      : "—";

  return (
    <article
      className="product-card"
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={onKeyDown}
    >
      <div className="product-card-cover-wrap">
        <div className="product-card-cover" style={coverStyle}>
          <span className="product-card-cover-initial">{initial}</span>
        </div>
        <span
          className="product-card-tag"
          title={categoryTitle || "Uncategorized"}
        >
          {categoryTitle || "Uncategorized"}
        </span>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-subtitle">{product.brand}</p>
        <div className="product-card-meta">
          <span className="product-card-price">{priceLabel}</span>
          {product.quantity !== undefined && product.quantity !== null ? (
            <span className="product-card-stock">
              {product.quantity} in stock
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
