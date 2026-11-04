-- ==========================================================
-- Murali Electronics Catalogue - PostgreSQL Schema DDL
-- Database: PostgreSQL 14+
-- ==========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-creating
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

-- 1. STORES TABLE
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    area VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Andhra Pradesh',
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    opening_hours_weekday VARCHAR(50) DEFAULT '09:30–21:30',
    opening_hours_sunday VARCHAR(50) DEFAULT '10:00–20:00',
    map_link VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stores_code ON stores(code);

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- 3. SUBCATEGORIES TABLE
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subcategories_slug ON subcategories(slug);
CREATE INDEX idx_subcategories_cat ON subcategories(category_id);

-- 4. PRODUCTS TABLE
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id INT REFERENCES subcategories(id) ON DELETE SET NULL,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    mrp NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_percent INT DEFAULT 0,
    image_url VARCHAR(500),
    short_description VARCHAR(500),
    description TEXT,
    warranty_info VARCHAR(255) DEFAULT '12 months warranty. Keep the GST invoice from the store for warranty service.',
    key_features JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_price_drop BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_selling_price ON products(selling_price);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_price_drop ON products(is_price_drop);

-- 5. OFFERS TABLE
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    discount_badge VARCHAR(100) NOT NULL,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    validity VARCHAR(100) NOT NULL,
    terms TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_code ON offers(coupon_code);

-- 6. ENQUIRIES TABLE
CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    store_id INT REFERENCES stores(id) ON DELETE SET NULL,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    enquiry_type VARCHAR(50) DEFAULT 'call_back',
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enquiries_store ON enquiries(store_id);
CREATE INDEX idx_enquiries_product ON enquiries(product_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created ON enquiries(created_at DESC);
