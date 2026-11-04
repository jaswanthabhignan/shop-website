# Murali Electronics Catalogue Platform

A full-stack web application mirroring the exact functionality, UI architecture, and business logic of [Murali Electronics](https://murali-catalogue-staging.onrender.com/).

Built using **React (Frontend)** + **Python FastAPI & SQLAlchemy (Backend)** + **PostgreSQL (Database)**.

---

## 🌟 Overview & Key Concepts

**Murali Electronics** is an electronics and home appliances retail chain serving Andhra Pradesh, India (with physical stores in **Nellore, Gudur, Guntur, and Vijayawada**).

Unlike conventional e-commerce platforms that force complex online checkout, cart management, and payment gateways, Murali Electronics operates on an **Enquiry-First, Buy-In-Store** model:
1. **Compare Online**: Customers browse live verified prices, energy star ratings, dimensions, and specifications.
2. **Multi-Store Context Switcher**: Selecting a store location (e.g. *Nellore · Trunk Road*) dynamically adapts the entire website — updating store-specific WhatsApp links, customer helpline numbers, and routing callback requests directly to local store managers.
3. **WhatsApp Direct Enquiry**: Pre-populates customer messages with the exact model number, SKU, and product link directly to the local store manager.
4. **Call-Back Requests**: 10-digit mobile number collection with privacy consent for instant store follow-ups.
5. **Admin Operations Dashboard**: Store staff can manage product catalogues, track customer callback status (`pending` ➔ `contacted` ➔ `completed`), and review branch metrics.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Lucide Icons, Pure Modern CSS Design System (Custom HSL Color Tokens, Micro-interactions, Responsive Layouts) |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 ORM, Pydantic v2, Uvicorn, Python-dotenv |
| **Database** | PostgreSQL 16 (with JSONB specifications, indices, and foreign keys) + SQLite auto-fallback for immediate local testing |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📁 Repository Structure

```
shop website/
├── docker-compose.yml           # PostgreSQL + Backend + Frontend multi-container config
├── README.md                    # System documentation
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app with CORS, routers, and startup seeder
│   │   ├── config.py            # Environment settings (DATABASE_URL, CORS, Secret keys)
│   │   ├── database.py          # SQLAlchemy engine (PostgreSQL + SQLite fallback)
│   │   ├── seed_data.py         # Seed script with 25+ real appliances, 4 stores & offers
│   │   ├── models/              # SQLAlchemy Models
│   │   │   ├── store.py         # Physical store branches
│   │   │   ├── category.py      # Categories & Subcategories
│   │   │   ├── product.py       # Products with JSONB specifications
│   │   │   ├── offer.py         # Promotional coupons & terms
│   │   │   └── enquiry.py       # Customer callbacks & WhatsApp lead tracking
│   │   ├── schemas/             # Pydantic v2 Request/Response validation models
│   │   └── routes/              # Modular API endpoints
│   │       ├── stores.py        # /api/stores
│   │       ├── categories.py    # /api/categories
│   │       ├── products.py      # /api/products (facets, filters, search, pagination)
│   │       ├── offers.py        # /api/offers
│   │       ├── enquiries.py     # /api/enquiries
│   │       └── admin.py         # /api/admin
│   ├── sql/
│   │   ├── schema.sql           # Pure PostgreSQL DDL table definitions
│   │   └── seed.sql             # Pure PostgreSQL seed inserts
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py                   # Development server runner
│
└── frontend/
    ├── index.html               # Typography (Outfit, Plus Jakarta Sans) & SEO meta
    ├── vite.config.js           # Vite config with /api proxy to FastAPI
    ├── package.json
    ├── nginx.conf               # Nginx reverse proxy for production build
    ├── Dockerfile
    └── src/
        ├── index.css            # Comprehensive CSS Design System
        ├── App.jsx              # Routing & Application Providers
        ├── main.jsx             # React DOM entry point
        ├── context/
        │   ├── StoreContext.jsx # Global active store selection (localStorage persisted)
        │   └── ToastContext.jsx # Sleek notification alert system
        ├── services/
        │   └── api.js           # API Client for backend endpoints
        ├── components/
        │   ├── Navbar.jsx       # Header with active store switcher & search
        │   ├── Footer.jsx       # Footer with disclaimer & store addresses
        │   ├── StoreModal.jsx   # Modal to switch between 4 AP stores
        │   ├── EnquiryModal.jsx # "Request a Call Back" form modal
        │   ├── ProductCard.jsx  # Card with specs chips, MRP, and WhatsApp CTA
        │   └── FilterSidebar.jsx# Dynamic brand and specification facets
        └── pages/
            ├── HomePage.jsx     # Hero banner, category cards, deals, store grid
            ├── CategoryPage.jsx # Catalogue with facet filters and pagination
            ├── ProductDetailPage.jsx # Image, full specs table, WhatsApp & callback
            ├── OffersPage.jsx   # Store coupon codes with one-click copy
            ├── StoresPage.jsx   # 4 Andhra Pradesh store branch locator
            ├── StoreDetailPage.jsx  # Individual store branch details
            ├── ContactPage.jsx  # Helplines and callback request
            └── AdminPage.jsx    # Store staff portal for callbacks & products
```

---

## 🚀 Getting Started

### Option 1: Run with Docker Compose (Recommended)

Start PostgreSQL, the FastAPI Backend, and the React Frontend together with a single command:

```bash
docker compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend & Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL Database**: Port `5432` (`postgres:postgrespassword`)

---

### Option 2: Run Locally Without Docker

#### Step 1: Start the Python Backend
1. Open a terminal in `./backend`:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure database connection:
   - By default, the app attempts to connect to PostgreSQL at `postgresql://postgres:postgres@localhost:5432/murali_catalogue`.
   - **Zero-Friction Fallback**: If a local PostgreSQL instance is not currently active, the backend seamlessly falls back to a local SQLite database (`murali_catalogue.db`) and automatically seeds all stores, categories, and products on boot!
5. Start the backend:
   ```bash
   python run.py
   ```
   Backend runs at **http://localhost:8000** (Swagger documentation at **http://localhost:8000/docs**).

#### Step 2: Start the React Frontend
1. Open a second terminal in `./frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at **http://localhost:5173**.

---

## 🗄️ PostgreSQL Database Design

The PostgreSQL database schema consists of 6 core tables:

### 1. `stores`
Stores physical branch locations in Andhra Pradesh:
- `id` (SERIAL PRIMARY KEY)
- `code` (VARCHAR UNIQUE, e.g. `nlr`, `gdr`, `gnt`, `vja`)
- `name` (VARCHAR, e.g. `Nellore`, `Gudur`)
- `area`, `city`, `state`, `pincode`
- `phone`, `whatsapp_number`
- `opening_hours_weekday`, `opening_hours_sunday`
- `map_link`

### 2. `categories` & `subcategories`
- `categories`: `air-conditioners`, `televisions`, `refrigerators`, `washing-machines`
- `subcategories`: `split-ac`, `window-ac`, `led-tv`, `oled-tv`, `side-by-side-refrigerator`, `front-load-washing-machine`

### 3. `products`
- `id`, `name`, `slug`, `brand`, `model`, `sku`
- `category_id`, `subcategory_id`
- `selling_price`, `mrp`, `discount_percent`
- `image_url`, `short_description`, `description`
- `warranty_info`
- `key_features` (JSONB)
- `specifications` (JSONB): e.g. `{"tonnage": "1.5 ton", "star_rating": 3, "inverter": false}`
- `is_featured`, `is_price_drop`, `is_available`

### 4. `offers`
- `coupon_code` (e.g. `WELCOME10`)
- `title`, `discount_badge`, `description`, `validity`, `terms`

### 5. `enquiries`
- `store_id`, `product_id`
- `customer_name`, `customer_mobile` (10 digits)
- `enquiry_type` (`call_back`, `whatsapp_click`, `general_contact`)
- `status` (`pending`, `contacted`, `completed`, `cancelled`)
- `admin_notes`

---

## 📡 RESTful API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stores` | List all 4 stores with operating hours and contact |
| `GET` | `/api/stores/{code}` | Get single store by code (`nlr`, `gdr`, `gnt`, `vja`) |
| `GET` | `/api/categories` | List categories and their subcategories |
| `GET` | `/api/products` | Query products with filters (`category`, `brand`, `tonnage`, `star_rating`, `inverter`, `sort`, `page`) |
| `GET` | `/api/products/{slug}` | Get product details, specifications table, and similar items |
| `GET` | `/api/offers` | Fetch active discount coupons |
| `POST` | `/api/enquiries` | Submit customer call-back request |
| `GET` | `/api/enquiries` | Store staff fetch incoming customer leads |
| `PATCH` | `/api/enquiries/{id}/status`| Update lead status (`pending` ➔ `contacted`) |
| `GET` | `/api/admin/stats` | High-level metrics for management |

---

## 📱 WhatsApp Integration Specification

When a customer clicks the **"Enquire on WhatsApp · [Store]"** button on any product, a URL is generated pointing to `https://wa.me/{whatsapp_number}` with a pre-filled, URL-encoded template:

```
Hello Murali Electronics Nellore,
I'm interested in Godrej 1.5 Ton 3 Star Window AC GDJW153 (Model: GDJW153, SKU: GDJ-W153).
Please share the price and availability.
http://localhost:5173/p/godrej-gdjw153
```

This ensures instant customer engagement and zero drop-off!
