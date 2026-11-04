-- ==========================================================
-- Murali Electronics Catalogue - PostgreSQL Seed Data
-- ==========================================================

-- 1. Insert Stores
INSERT INTO stores (code, name, area, city, state, pincode, phone, whatsapp_number, map_link) VALUES
('nlr', 'Nellore', 'Trunk Road', 'Nellore', 'Andhra Pradesh', '524001', '+91 861 000 0001', '919000000001', 'https://maps.google.com/?q=Trunk+Road+Nellore+Andhra+Pradesh'),
('gdr', 'Gudur', 'Main Bazar Road', 'Gudur', 'Andhra Pradesh', '524101', '+91 862 000 0002', '919000000002', 'https://maps.google.com/?q=Main+Bazar+Road+Gudur+Andhra+Pradesh'),
('gnt', 'Guntur', 'Brodipet', 'Guntur', 'Andhra Pradesh', '522002', '+91 863 000 0003', '919000000003', 'https://maps.google.com/?q=Brodipet+Guntur+Andhra+Pradesh'),
('vja', 'Vijayawada', 'MG Road', 'Vijayawada', 'Andhra Pradesh', '520010', '+91 866 000 0004', '919000000004', 'https://maps.google.com/?q=MG+Road+Vijayawada+Andhra+Pradesh')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (id, name, slug, description, icon_name, display_order) VALUES
(1, 'Air Conditioners', 'air-conditioners', 'Split and window air conditioners from leading brands, with installation by our store teams.', 'Wind', 1),
(2, 'Televisions', 'televisions', 'LED, QLED and OLED televisions in every size, with wall-mount installation.', 'Tv', 2),
(3, 'Refrigerators', 'refrigerators', 'Single-door, double-door and side-by-side refrigerators for every kitchen.', 'Refrigerator', 3),
(4, 'Washing Machines', 'washing-machines', 'Front-load, top-load and semi-automatic washing machines.', 'WashingMachine', 4)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Subcategories
INSERT INTO subcategories (id, category_id, name, slug, description) VALUES
(1, 1, 'Split AC', 'split-ac', 'High-efficiency split air conditioners for modern spaces.'),
(2, 1, 'Window AC', 'window-ac', 'Compact and robust window air conditioners.'),
(3, 2, 'LED TV', 'led-tv', 'Crisp Full HD and 4K LED Smart TVs.'),
(4, 2, 'QLED TV', 'qled-tv', 'Quantum dot displays for vibrant colors.'),
(5, 2, 'OLED TV', 'oled-tv', 'Self-lit pixels with infinite contrast.'),
(6, 3, 'Single Door', 'single-door-refrigerator', 'Compact single door refrigerators for smaller households.'),
(7, 3, 'Double Door', 'double-door-refrigerator', 'Frost-free double door refrigerators.'),
(8, 3, 'Side-by-Side', 'side-by-side-refrigerator', 'Premium multi-door and side-by-side refrigerators.'),
(9, 4, 'Front Load', 'front-load-washing-machine', 'Gentle on clothes with maximum water and energy efficiency.'),
(10, 4, 'Top Load', 'top-load-washing-machine', 'Ergonomic top loading convenience with powerful pulsators.'),
(11, 4, 'Semi-Automatic', 'semi-automatic-washing-machine', 'Durable and economical twin tub washers.')
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Products
INSERT INTO products (name, slug, brand, model, sku, category_id, subcategory_id, selling_price, mrp, discount_percent, image_url, short_description, description, key_features, specifications, is_featured, is_price_drop) VALUES
('Godrej 1.5 Ton 3 Star Window AC, model GDJW153', 'godrej-gdjw153', 'Godrej', 'GDJW153', 'GDJ-W153', 1, 2, 25990.00, 31690.00, 17, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', '1.5 ton 3-star rated window AC with 100% copper condenser and dust filter.', 'Godrej 1.5 Ton 3 Star Window AC GDJW153 brings dependable cooling for medium-sized bedrooms.', '["100% Copper Condenser", "Anti-Dust Filter", "Self-Diagnosis"]'::jsonb, '{"tonnage": "1.5 ton", "star_rating": 3, "inverter": false}'::jsonb, TRUE, FALSE),
('Carrier 1.5 Ton 3 Star Window AC, model CARW153', 'carrier-carw153', 'Carrier', 'CARW153', 'CAR-W153', 1, 2, 26990.00, 32890.00, 17, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', 'Robust cooling from Carrier with high ambient performance up to 50°C.', 'Carrier CARW153 delivers powerful airflow with energy saver mode.', '["Copper Condenser", "Hydrophilic Blue Fins", "Auto Restart"]'::jsonb, '{"tonnage": "1.5 ton", "star_rating": 3, "inverter": false}'::jsonb, TRUE, FALSE),
('Blue Star 1 Ton 3 Star Inverter Split AC, model BLSS103I', 'blue-star-blss103i', 'Blue Star', 'BLSS103I', 'BLS-S103I', 1, 1, 28490.00, 34790.00, 18, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', 'Inverter split AC with dual rotor technology for whisper quiet operation.', '5-in-1 convertible modes to match your cooling requirements.', '["5-in-1 Convertible", "Inverter Compressor", "Whisper Quiet"]'::jsonb, '{"tonnage": "1 ton", "star_rating": 3, "inverter": true}'::jsonb, TRUE, TRUE),
('Sony 77 inch 4K UHD OLED Smart TV, model SNYOLED77', 'sony-snyoled77', 'Sony', 'SNYOLED77', 'SNY-OLED77', 2, 5, 389990.00, 449990.00, 13, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80', 'Cognitive Processor XR OLED with Acoustic Surface Audio+.', 'Pure black contrast and intense brightness powered by Google TV.', '["Cognitive Processor XR", "Acoustic Surface Audio+", "Google TV"]'::jsonb, '{"screen_size": "77 inch", "display_type": "OLED", "resolution": "4K UHD", "smart_tv": true}'::jsonb, TRUE, FALSE),
('Panasonic 32 inch HD Ready LED Smart TV, model PANLED32', 'panasonic-panled32', 'Panasonic', 'PANLED32', 'PAN-LED32', 2, 3, 24390.00, 29790.00, 18, 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80', '32-inch Google TV with vivid digital pro color tuning and Dolby Audio.', 'Ideal compact TV for bedrooms with Google Chromecast built-in.', '["Google TV", "Dolby Audio", "Vivid Digital Pro"]'::jsonb, '{"screen_size": "32 inch", "display_type": "LED", "resolution": "HD Ready", "smart_tv": true}'::jsonb, TRUE, TRUE),
('Bosch 690 L 3 Star Side-by-Side Refrigerator, model BSHSBS690', 'bosch-bshsbs690', 'Bosch', 'BSHSBS690', 'BSH-SBS690', 3, 8, 77590.00, 94690.00, 18, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80', 'German engineered 690-liter side-by-side refrigerator with VarioInverter.', 'Features MultiAirflow cooling system and VitaFresh plus drawer.', '["VarioInverter Compressor", "VitaFresh Plus", "MultiAirflow"]'::jsonb, '{"capacity": "690 L", "star_rating": 3, "door_type": "Side-by-Side"}'::jsonb, TRUE, FALSE),
('Panasonic 7.5 kg Fully-Automatic Top Load Washing Machine, model PANTL75', 'panasonic-pantl75', 'Panasonic', 'PANTL75', 'PAN-TL75', 4, 10, 18990.00, 23190.00, 18, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80', '5-Star rated 7.5 kg top load washer with Active Foam Wash.', 'Lifts tough stains using high-density foam before washing begins.', '["Active Foam System", "Aqua Spin Rinse", "Water Reuse Option"]'::jsonb, '{"capacity": "7.5 kg", "star_rating": 5, "load_type": "Top Load"}'::jsonb, TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Offers
INSERT INTO offers (title, discount_badge, coupon_code, description, validity, terms) VALUES
('Welcome offer: 10% off, up to ₹2,000', '10% off, up to ₹2,000', 'WELCOME10', 'Use code WELCOME10 at the billing counter.', 'Valid 1 Apr 2026 – 31 Mar 2027 · at all stores', 'Offer valid on purchases above ₹15,000 across all Murali Electronics stores in Andhra Pradesh.')
ON CONFLICT (coupon_code) DO NOTHING;
