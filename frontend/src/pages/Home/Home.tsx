import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const LOGO_SRC = `${process.env.PUBLIC_URL ?? ""}/stockify.png`;

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-brand-lockup">
          <img
            className="home-logo"
            src={LOGO_SRC}
            alt=""
            width={100}
            height={100}
            decoding="async"
          />
          <p className="home-kicker">Warehouse inventory</p>
          <h1 className="home-title">Stockify</h1>
        </div>
        <p className="home-lead">
          Stockify is a simple and easy to use warehouse inventory system with
          AI powered Insights.
        </p>

        <div className="home-buttons">
          <button
            type="button"
            className="home-btn primary"
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            type="button"
            className="home-btn secondary"
            onClick={() => navigate("/categories")}
          >
            Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
