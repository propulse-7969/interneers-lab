# Product API — Interneers Lab 2026

A RESTful backend for managing warehouse products and product categories, with AI-powered inventory reporting. Built with **Django**, **MongoEngine**, and **Django REST Framework**, backed by **MongoDB**.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Running Locally](#running-locally)
4. [Data Models](#data-models)
5. [Product Endpoints](#product-endpoints)
6. [Category Endpoints](#category-endpoints)
7. [Report Endpoints](#report-endpoints)
8. [Scripts](#scripts)

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Framework  | Django 6.0.2                |
| Database   | MongoDB (Docker, port 27019)|
| ORM        | MongoEngine                 |
| API        | Django REST Framework        |
| AI         | Google Gemini 2.5 Flash     |
| Dev Server | http://127.0.0.1:8001       |

---

## Architecture

The project follows a clean hexagonal architecture with four layers:

```
Controller  →  Service  →  Repository  →  Model
   (HTTP)     (Business)    (Database)   (Schema)
```

```
productAPI/
├── controllers/       # Handle HTTP requests/responses
├── services/          # Business logic and orchestration
├── repositories/      # Database read/write operations
├── models/            # MongoEngine document schemas
├── serializers/       # Input validation and serialization
├── seed/              # Auto-runs on server startup
└── urls/              # URL routing
scripts/               # One-off migration scripts
```

---

## Running Locally

**1. Start MongoDB**
```bash
docker compose up -d
```

**2. Activate virtual environment**
```bash
cd backend/python

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Set environment variables**

Create a `.env` file in `backend/python/` with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**5. Start the server**
```bash
python manage.py runserver 8001
```

On startup, the seed script auto-runs and creates default categories in MongoDB if they don't already exist.

---

## Data Models

### Product

| Field        | Type      | Required | Notes                               |
|--------------|-----------|----------|-------------------------------------|
| id           | ObjectId  | auto     | MongoDB document ID                 |
| name         | String    | yes      | Max 150 characters                  |
| description  | String    | no       |                                     |
| category     | Reference | no       | References a ProductCategory        |
| price        | Integer   | no       | Must be >= 0                        |
| brand        | String    | yes      | Max 100 characters                  |
| quantity     | Integer   | no       | Stock count                         |
| created_at   | DateTime  | auto     | Set on first save (IST timezone)    |
| updated_at   | DateTime  | auto     | Updated on every save (IST timezone)|

### ProductCategory

| Field       | Type     | Required | Notes               |
|-------------|----------|----------|---------------------|
| id          | ObjectId | auto     | MongoDB document ID |
| title       | String   | yes      | Max 100 characters  |
| description | String   | no       |                     |
| author      | String   | no       | Max 100 characters  |

---

## Product Endpoints

Base path: `/api/product/`

### `GET /api/product/`
List all products. Supports filtering, sorting, and pagination.

**Query Parameters**

| Param        | Type    | Description                                                                |
|--------------|---------|----------------------------------------------------------------------------|
| `page`       | Integer | Page number. Returns 6 per page                                            |
| `sortby`     | String  | `asc` or `desc` (default) — sorts by `updated_at`                         |
| `categories` | String  | Comma-separated category **names**. Case-insensitive. Example: `Food,Electronics` |
| `min_price`  | Integer | Minimum price (inclusive)                                                  |
| `max_price`  | Integer | Maximum price (inclusive)                                                  |
| `brand`      | String  | Partial, case-insensitive brand match                                      |
| `name`       | String  | Partial, case-insensitive name match                                       |

**Example requests**
```
GET /api/product/
GET /api/product/?categories=Food,Electronics
GET /api/product/?min_price=50&max_price=200&brand=Amul
GET /api/product/?name=milk&sortby=asc&page=1
```

---

### `POST /api/product/`
Create a new product.

**Request body**
```json
{
  "name": "Milk",
  "brand": "Amul",
  "description": "Fresh dairy milk",
  "price": 50,
  "quantity": 100
}
```

---

### `PUT /api/product/{product_id}/`
Update an existing product by ID.

---

### `DELETE /api/product/{product_id}/`
Permanently delete a product by ID.

---

### `POST /api/product/bulk-upload/`
Bulk create products from a CSV file. Send as `multipart/form-data` with key `file`.

**Expected CSV format**
```csv
name,description,category,price,brand,quantity
Milk,Fresh dairy milk,,50,Amul,100
Bread,Whole wheat bread,,40,Britannia,80
```

Products with an empty `category` column will have category set to `null`.

---

## Category Endpoints

Base path: `/api/categories/`

### `GET /api/categories/`
List all categories. Supports `?page=` for pagination.

---

### `POST /api/categories/`
Create a new category.

**Request body**
```json
{
  "title": "Food",
  "description": "Edible products and groceries"
}
```

---

### `PUT /api/categories/{category_id}/`
Update an existing category by ID.

---

### `DELETE /api/categories/{category_id}/`
Permanently delete a category by ID.

---

### `GET /api/categories/{category_id}/products/`
Fetch all products belonging to a specific category.

---

### `POST /api/categories/{category_id}/products/`
Assign an existing product to a category. Does **not** create a new product.

**Request body**
```json
{
  "id": "<product_id>"
}
```

---

### `DELETE /api/categories/{category_id}/products/{product_id}/`
Unassign a product from a category — sets `category` to `null`. The product itself is **not** deleted.

---

## Report Endpoints

Base path: `/api/report/`

Report endpoints return structured data alongside an AI-generated analysis powered by **Google Gemini 2.5 Flash**. All responses follow this shape:

```json
{
  "report": [ /* structured data array */ ],
  "analysis": "Plain-text business analysis generated by AI"
}
```

---

### `GET /api/report/categories/`
Returns a product count per category, with an AI-generated analysis of category-wise product variety and actionable suggestions.

**Query Parameters**

| Param       | Type    | Description                                           |
|-------------|---------|-------------------------------------------------------|
| `min_count` | Integer | Only include categories with at least this many products |
| `max_count` | Integer | Only include categories with at most this many products  |

**Example requests**
```
GET /api/report/categories/
GET /api/report/categories/?min_count=5
GET /api/report/categories/?min_count=2&max_count=10
```

**Example response**
```json
{
  "report": [
    {
      "category": "Food",
      "category_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "product_count": 12
    },
    {
      "category": "Electronics",
      "category_id": "65f1a2b3c4d5e6f7a8b9c0d2",
      "product_count": 5
    }
  ],
  "analysis": "Food dominates the inventory with 12 products, suggesting strong stock variety..."
}
```

---

### `GET /api/report/products/`
Returns all products whose quantity falls below a configurable threshold, with an AI-generated analysis of stock shortages and overstock risks.

**Query Parameters**

| Param       | Type    | Default | Description                                      |
|-------------|---------|---------|--------------------------------------------------|
| `threshold` | Integer | `8`     | Products with quantity strictly less than this value are included |

**Example requests**
```
GET /api/report/products/
GET /api/report/products/?threshold=20
```

**Example response**
```json
{
  "report": [
    {
      "product_id": "65f1a2b3c4d5e6f7a8b9c0d3",
      "product_name": "Cheese",
      "product_quantity": 3
    },
    {
      "product_id": "65f1a2b3c4d5e6f7a8b9c0d4",
      "product_name": "Coffee",
      "product_quantity": 6
    }
  ],
  "analysis": "Two products are critically low on stock. Cheese at 3 units and Coffee at 6 units risk stockout..."
}
```

> **Note:** The default threshold is defined in `productAPI/constants/constants.py` as `DEFAULT_THRESHOLD_VALUE = 8`. Update this value to change the system-wide default.

---

## Scripts

Run all scripts from `backend/python` with the virtual environment active.

### Seed (auto)
Runs on every server startup via `AppConfig.ready()`. Creates default categories if they don't exist:
- Food
- Kitchen Essentials
- Electronics
- Personal Care
- Uncategorized

### migrate_uncategorized_products.py
Assigns all products with `category=null` to the `Uncategorized` category.
```bash
python scripts\migrate_uncategorized_products.py   # Windows
python scripts/migrate_uncategorized_products.py   # macOS / Linux
```

### add_default_brand_to_existing_products.py
Sets brand to `"Unknown"` for any products where brand is `null`. Handles backward compatibility when `brand` was made a required field.
```bash
python scripts\add_default_brand_to_existing_products.py   # Windows
python scripts/add_default_brand_to_existing_products.py   # macOS / Linux
```
