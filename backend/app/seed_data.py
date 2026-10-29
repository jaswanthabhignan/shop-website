import logging
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models.store import Store
from app.models.category import Category, Subcategory
from app.models.product import Product
from app.models.offer import Offer
from app.models.enquiry import Enquiry

logger = logging.getLogger("uvicorn.error")

def seed_database(db: Session = None):
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        # Check if already seeded
        if db.query(Store).count() > 0:
            logger.info("Database already seeded. Skipping initial seed.")
            return

        logger.info("Seeding Murali Electronics catalogue database...")

        # 1. Stores
        stores_data = [
            {
                "code": "nlr",
                "name": "Nellore",
                "area": "Trunk Road",
                "city": "Nellore",
                "state": "Andhra Pradesh",
                "pincode": "524001",
                "phone": "+91 861 000 0001",
                "whatsapp_number": "919000000001",
                "opening_hours_weekday": "09:30–21:30",
                "opening_hours_sunday": "10:00–20:00",
                "map_link": "https://maps.google.com/?q=Trunk+Road+Nellore+Andhra+Pradesh"
            },
            {
                "code": "gdr",
                "name": "Gudur",
                "area": "Main Bazar Road",
                "city": "Gudur",
                "state": "Andhra Pradesh",
                "pincode": "524101",
                "phone": "+91 862 000 0002",
                "whatsapp_number": "919000000002",
                "opening_hours_weekday": "09:30–21:30",
                "opening_hours_sunday": "10:00–20:00",
                "map_link": "https://maps.google.com/?q=Main+Bazar+Road+Gudur+Andhra+Pradesh"
            },
            {
                "code": "gnt",
                "name": "Guntur",
                "area": "Brodipet",
                "city": "Guntur",
                "state": "Andhra Pradesh",
                "pincode": "522002",
                "phone": "+91 863 000 0003",
                "whatsapp_number": "919000000003",
                "opening_hours_weekday": "09:30–21:30",
                "opening_hours_sunday": "10:00–20:00",
                "map_link": "https://maps.google.com/?q=Brodipet+Guntur+Andhra+Pradesh"
            },
            {
                "code": "vja",
                "name": "Vijayawada",
                "area": "MG Road",
                "city": "Vijayawada",
                "state": "Andhra Pradesh",
                "pincode": "520010",
                "phone": "+91 866 000 0004",
                "whatsapp_number": "919000000004",
                "opening_hours_weekday": "09:30–21:30",
                "opening_hours_sunday": "10:00–20:00",
                "map_link": "https://maps.google.com/?q=MG+Road+Vijayawada+Andhra+Pradesh"
            }
        ]

        store_objects = {}
        for s in stores_data:
            obj = Store(**s)
            db.add(obj)
            db.flush()
            store_objects[s["code"]] = obj

        # 2. Categories & Subcategories
        categories_data = [
            {
                "name": "Air Conditioners",
                "slug": "air-conditioners",
                "description": "Split and window air conditioners from leading brands, with installation by our store teams.",
                "icon_name": "Wind",
                "display_order": 1,
                "subcategories": [
                    {"name": "Split AC", "slug": "split-ac", "description": "High-efficiency split air conditioners for modern spaces."},
                    {"name": "Window AC", "slug": "window-ac", "description": "Compact and robust window air conditioners."}
                ]
            },
            {
                "name": "Televisions",
                "slug": "televisions",
                "description": "LED, QLED and OLED televisions in every size, with wall-mount installation.",
                "icon_name": "Tv",
                "display_order": 2,
                "subcategories": [
                    {"name": "LED TV", "slug": "led-tv", "description": "Crisp Full HD and 4K LED Smart TVs."},
                    {"name": "QLED TV", "slug": "qled-tv", "description": "Quantum dot displays for vibrant colors."},
                    {"name": "OLED TV", "slug": "oled-tv", "description": "Self-lit pixels with infinite contrast."}
                ]
            },
            {
                "name": "Refrigerators",
                "slug": "refrigerators",
                "description": "Single-door, double-door and side-by-side refrigerators for every kitchen.",
                "icon_name": "Refrigerator",
                "display_order": 3,
                "subcategories": [
                    {"name": "Single Door", "slug": "single-door-refrigerator", "description": "Compact single door refrigerators for smaller households."},
                    {"name": "Double Door", "slug": "double-door-refrigerator", "description": "Frost-free double door refrigerators."},
                    {"name": "Side-by-Side", "slug": "side-by-side-refrigerator", "description": "Premium multi-door and side-by-side refrigerators."}
                ]
            },
            {
                "name": "Washing Machines",
                "slug": "washing-machines",
                "description": "Front-load, top-load and semi-automatic washing machines.",
                "icon_name": "WashingMachine",
                "display_order": 4,
                "subcategories": [
                    {"name": "Front Load", "slug": "front-load-washing-machine", "description": "Gentle on clothes with maximum water and energy efficiency."},
                    {"name": "Top Load", "slug": "top-load-washing-machine", "description": "Ergonomic top loading convenience with powerful pulsators."},
                    {"name": "Semi-Automatic", "slug": "semi-automatic-washing-machine", "description": "Durable and economical twin tub washers."}
                ]
            }
        ]

        cat_map = {}
        sub_map = {}

        for c_data in categories_data:
            subcats = c_data.pop("subcategories")
            cat_obj = Category(**c_data)
            db.add(cat_obj)
            db.flush()
            cat_map[cat_obj.slug] = cat_obj

            for s_data in subcats:
                s_obj = Subcategory(category_id=cat_obj.id, **s_data)
                db.add(s_obj)
                db.flush()
                sub_map[s_obj.slug] = s_obj

        # 3. Products
        products_data = [
            # --- Air Conditioners ---
            {
                "name": "Godrej 1.5 Ton 3 Star Window AC, model GDJW153",
                "slug": "godrej-gdjw153",
                "brand": "Godrej",
                "model": "GDJW153",
                "sku": "GDJ-W153",
                "category_slug": "air-conditioners",
                "subcategory_slug": "window-ac",
                "selling_price": 25990,
                "mrp": 31690,
                "discount_percent": 17,
                "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
                "short_description": "1.5 ton 3-star rated window AC with 100% copper condenser and dust filter.",
                "description": "Godrej 1.5 Ton 3 Star Window AC GDJW153 brings dependable cooling for medium-sized bedrooms. Comes with anti-corrosion blue fin coating and low noise operations.",
                "key_features": ["100% Copper Condenser", "Anti-Dust Filter", "Self-Diagnosis", "Turbo Mode"],
                "specifications": {
                    "tonnage": "1.5 ton",
                    "star_rating": 3,
                    "inverter": False,
                    "refrigerant": "R32",
                    "cooling_capacity": "5050 W",
                    "noise_level": "52 dB"
                },
                "is_featured": True,
                "is_price_drop": False
            },
            {
                "name": "Godrej 1 Ton 3 Star Window AC, model GDJW103",
                "slug": "godrej-gdjw103",
                "brand": "Godrej",
                "model": "GDJW103",
                "sku": "GDJ-W103",
                "category_slug": "air-conditioners",
                "subcategory_slug": "window-ac",
                "selling_price": 21990,
                "mrp": 26790,
                "discount_percent": 17,
                "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
                "short_description": "1 ton 3-star rated window AC suitable for compact bedrooms up to 120 sq ft.",
                "description": "Energy efficient Godrej 1 Ton Window AC provides quick cooling in Indian summers.",
                "key_features": ["100% Copper Coil", "Dust Filter", "Sleep Mode"],
                "specifications": {
                    "tonnage": "1 ton",
                    "star_rating": 3,
                    "inverter": False,
                    "refrigerant": "R32"
                },
                "is_featured": False,
                "is_price_drop": False
            },
            {
                "name": "Carrier 1.5 Ton 3 Star Window AC, model CARW153",
                "slug": "carrier-carw153",
                "brand": "Carrier",
                "model": "CARW153",
                "sku": "CAR-W153",
                "category_slug": "air-conditioners",
                "subcategory_slug": "window-ac",
                "selling_price": 26990,
                "mrp": 32890,
                "discount_percent": 17,
                "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
                "short_description": "Robust cooling from Carrier with high ambient performance up to 50°C.",
                "description": "Carrier CARW153 delivers powerful airflow with energy saver mode and auto restart.",
                "key_features": ["Copper Condenser", "Hydrophilic Blue Fins", "Auto Restart"],
                "specifications": {
                    "tonnage": "1.5 ton",
                    "star_rating": 3,
                    "inverter": False
                },
                "is_featured": True,
                "is_price_drop": False
            },
            {
                "name": "Carrier 1 Ton 3 Star Window AC, model CARW103",
                "slug": "carrier-carw103",
                "brand": "Carrier",
                "model": "CARW103",
                "sku": "CAR-W103",
                "category_slug": "air-conditioners",
                "subcategory_slug": "window-ac",
                "selling_price": 22990,
                "mrp": 27990,
                "discount_percent": 17,
                "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
                "short_description": "Reliable 1 Ton Window AC from Carrier with 3-star efficiency.",
                "description": "Best in class cooling for study rooms and guest bedrooms.",
                "key_features": ["Copper condenser", "Dust filter"],
                "specifications": {
                    "tonnage": "1 ton",
                    "star_rating": 3,
                    "inverter": False
                },
                "is_featured": False,
                "is_price_drop": False
            },
            {
                "name": "Blue Star 1.5 Ton 3 Star Window AC, model BLSW153",
                "slug": "blue-star-blsw153",
                "brand": "Blue Star",
                "model": "BLSW153",
                "sku": "BLS-W153",
                "category_slug": "air-conditioners",
                "subcategory_slug": "window-ac",
                "selling_price": 29490,
                "mrp": 35990,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
                "short_description": "Blue Star precision cooling window AC with anti-freeze thermostat.",
                "description": "Engineered for longevity with copper tubes and anti-corrosive hydrophilic blue fins.",
                "key_features": ["Precision Cooling", "Anti-Freeze Thermostat", "Copper Tubes"],
                "specifications": {
                    "tonnage": "1.5 ton",
                    "star_rating": 3,
                    "inverter": False
                },
                "is_featured": False,
                "is_price_drop": False
            },
            {
                "name": "Blue Star 1 Ton 3 Star Inverter Split AC, model BLSS103I",
                "slug": "blue-star-blss103i",
                "brand": "Blue Star",
                "model": "BLSS103I",
                "sku": "BLS-S103I",
                "category_slug": "air-conditioners",
                "subcategory_slug": "split-ac",
                "selling_price": 28490,
                "mrp": 34790,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
                "short_description": "Inverter split AC with dual rotor technology for whisper quiet operation.",
                "description": "5-in-1 convertible modes to match your cooling requirements and save on electricity.",
                "key_features": ["5-in-1 Convertible", "Inverter Compressor", "Whisper Quiet", "Copper Coil"],
                "specifications": {
                    "tonnage": "1 ton",
                    "star_rating": 3,
                    "inverter": True
                },
                "is_featured": True,
                "is_price_drop": True
            },
            {
                "name": "Haier 2 Ton 5 Star Inverter Split AC, model HAIS205I",
                "slug": "haier-hais205i",
                "brand": "Haier",
                "model": "HAIS205I",
                "sku": "HAI-S205I",
                "category_slug": "air-conditioners",
                "subcategory_slug": "split-ac",
                "selling_price": 44990,
                "mrp": 54890,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
                "short_description": "Heavy-duty 2 Ton 5-Star Split AC with 20-meter long air throw for large living halls.",
                "description": "Extreme cooling up to 60°C ambient temperatures with frost self-clean technology.",
                "key_features": ["Frost Self Clean", "20m Air Throw", "Triple Inverter+", "Hyper PCB"],
                "specifications": {
                    "tonnage": "2 ton",
                    "star_rating": 5,
                    "inverter": True
                },
                "is_featured": True,
                "is_price_drop": False
            },
            {
                "name": "Panasonic 1.5 Ton 5 Star Inverter Split AC, model PANS155I",
                "slug": "panasonic-pans155i",
                "brand": "Panasonic",
                "model": "PANS155I",
                "sku": "PAN-S155I",
                "category_slug": "air-conditioners",
                "subcategory_slug": "split-ac",
                "selling_price": 38990,
                "mrp": 47590,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
                "short_description": "Smart AI inverter AC with Miraie IoT connectivity and PM 2.5 air purification.",
                "description": "Control your climate via voice commands through Google Assistant and Alexa.",
                "key_features": ["Miraie App Control", "PM 2.5 Filter", "Shield Blu Anti-Corrosion"],
                "specifications": {
                    "tonnage": "1.5 ton",
                    "star_rating": 5,
                    "inverter": True
                },
                "is_featured": True,
                "is_price_drop": False
            },

            # --- Televisions ---
            {
                "name": "Sony 77 inch 4K UHD OLED Smart TV, model SNYOLED77",
                "slug": "sony-snyoled77",
                "brand": "Sony",
                "model": "SNYOLED77",
                "sku": "SNY-OLED77",
                "category_slug": "televisions",
                "subcategory_slug": "oled-tv",
                "selling_price": 389990,
                "mrp": 449990,
                "discount_percent": 13,
                "image_url": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80",
                "short_description": "Cognitive Processor XR OLED with Acoustic Surface Audio+.",
                "description": "Pure black contrast and intense brightness powered by Google TV and Dolby Vision Atmos.",
                "key_features": ["Cognitive Processor XR", "Acoustic Surface Audio+", "Google TV", "Dolby Vision & Atmos"],
                "specifications": {
                    "screen_size": "77 inch",
                    "display_type": "OLED",
                    "resolution": "4K UHD (3840 x 2160)",
                    "smart_tv": True,
                    "refresh_rate": "120 Hz"
                },
                "is_featured": True,
                "is_price_drop": False
            },
            {
                "name": "Sony 65 inch 4K UHD OLED Smart TV, model SNYOLED65",
                "slug": "sony-snyoled65",
                "brand": "Sony",
                "model": "SNYOLED65",
                "sku": "SNY-OLED65",
                "category_slug": "televisions",
                "subcategory_slug": "oled-tv",
                "selling_price": 249990,
                "mrp": 299990,
                "discount_percent": 16,
                "image_url": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80",
                "short_description": "Premium 65-inch OLED with immersive theater sound and gaming enhancements.",
                "description": "Breathtaking color depth and picture clarity for the ultimate living room cinema.",
                "key_features": ["XR Triluminos Pro", "Acoustic Center Sync", "HDMI 2.1 4K 120"],
                "specifications": {
                    "screen_size": "65 inch",
                    "display_type": "OLED",
                    "resolution": "4K UHD",
                    "smart_tv": True
                },
                "is_featured": True,
                "is_price_drop": False
            },
            {
                "name": "LG 77 inch 4K UHD OLED Smart TV, model LGOLED77",
                "slug": "lg-lgoled77",
                "brand": "LG",
                "model": "LGOLED77",
                "sku": "LG-OLED77",
                "category_slug": "televisions",
                "subcategory_slug": "oled-tv",
                "selling_price": 369990,
                "mrp": 429990,
                "discount_percent": 14,
                "image_url": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80",
                "short_description": "LG OLED evo C-series with α9 AI Processor Gen6 and webOS 24.",
                "description": "World's leading OLED screen with ultra-slim gallery design and G-Sync compatibility.",
                "key_features": ["α9 AI Processor Gen6", "Brightness Booster", "Magic Remote", "0.1ms Response Time"],
                "specifications": {
                    "screen_size": "77 inch",
                    "display_type": "OLED",
                    "resolution": "4K UHD",
                    "smart_tv": True
                },
                "is_featured": False,
                "is_price_drop": False
            },
            {
                "name": "Panasonic 32 inch HD Ready LED Smart TV, model PANLED32",
                "slug": "panasonic-panled32",
                "brand": "Panasonic",
                "model": "PANLED32",
                "sku": "PAN-LED32",
                "category_slug": "televisions",
                "subcategory_slug": "led-tv",
                "selling_price": 24390,
                "mrp": 29790,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
                "short_description": "32-inch Google TV with vivid digital pro color tuning and Dolby Audio.",
                "description": "Ideal compact TV for bedrooms with Google Chromecast built-in.",
                "key_features": ["Google TV", "Dolby Audio", "Vivid Digital Pro", "Bezel-less Design"],
                "specifications": {
                    "screen_size": "32 inch",
                    "display_type": "LED",
                    "resolution": "HD Ready (1366 x 768)",
                    "smart_tv": True
                },
                "is_featured": True,
                "is_price_drop": True
            },

            # --- Refrigerators ---
            {
                "name": "Bosch 690 L 3 Star Side-by-Side Refrigerator, model BSHSBS690",
                "slug": "bosch-bshsbs690",
                "brand": "Bosch",
                "model": "BSHSBS690",
                "sku": "BSH-SBS690",
                "category_slug": "refrigerators",
                "subcategory_slug": "side-by-side-refrigerator",
                "selling_price": 77590,
                "mrp": 94690,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80",
                "short_description": "German engineered 690-liter side-by-side refrigerator with VarioInverter.",
                "description": "Features MultiAirflow cooling system and VitaFresh plus drawer keeping vegetables fresh for twice as long.",
                "key_features": ["VarioInverter Compressor", "VitaFresh Plus", "MultiAirflow", "Digital Touch Display"],
                "specifications": {
                    "capacity": "690 L",
                    "star_rating": 3,
                    "door_type": "Side-by-Side",
                    "defrost_system": "Frost Free"
                },
                "is_featured": True,
                "is_price_drop": False
            },
            {
                "name": "Bosch 630 L 3 Star Side-by-Side Refrigerator, model BSHSBS630",
                "slug": "bosch-bshsbs630",
                "brand": "Bosch",
                "model": "BSHSBS630",
                "sku": "BSH-SBS630",
                "category_slug": "refrigerators",
                "subcategory_slug": "side-by-side-refrigerator",
                "selling_price": 75190,
                "mrp": 91690,
                "discount_percent": 17,
                "image_url": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80",
                "short_description": "Large capacity side-by-side refrigerator in fingerprint-resistant stainless steel.",
                "description": "Equipped with SuperCooling and SuperFreezing technology.",
                "key_features": ["Touch Control", "FreshSense Sensors", "LED Lighting"],
                "specifications": {
                    "capacity": "630 L",
                    "star_rating": 3,
                    "door_type": "Side-by-Side"
                },
                "is_featured": False,
                "is_price_drop": False
            },
            {
                "name": "Godrej 215 L 3 Star Single Door Refrigerator, model GDJSD215",
                "slug": "godrej-gdjsd215",
                "brand": "Godrej",
                "model": "GDJSD215",
                "sku": "GDJ-SD215",
                "category_slug": "refrigerators",
                "subcategory_slug": "single-door-refrigerator",
                "selling_price": 15790,
                "mrp": 19290,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80",
                "short_description": "215L single door refrigerator with largest vegetable tray and turbo cooling.",
                "description": "With advanced inverter technology and farm fresh crisper technology.",
                "key_features": ["Turbo Cooling", "Anti-Bacterial Gasket", "Thick PUF Insulation"],
                "specifications": {
                    "capacity": "215 L",
                    "star_rating": 3,
                    "door_type": "Single Door"
                },
                "is_featured": True,
                "is_price_drop": True
            },
            {
                "name": "LG 253 L 2 Star Double Door Refrigerator, model LGDD253",
                "slug": "lg-lgdd253",
                "brand": "LG",
                "model": "LGDD253",
                "sku": "LG-DD253",
                "category_slug": "refrigerators",
                "subcategory_slug": "double-door-refrigerator",
                "selling_price": 31190,
                "mrp": 38090,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80",
                "short_description": "Smart Inverter Double Door Refrigerator with Door Cooling+.",
                "description": "Uniform cooling throughout the fridge with auto smart connect during power outages.",
                "key_features": ["Smart Inverter Compressor", "Door Cooling+", "Multi Air Flow"],
                "specifications": {
                    "capacity": "253 L",
                    "star_rating": 2,
                    "door_type": "Double Door"
                },
                "is_featured": False,
                "is_price_drop": True
            },

            # --- Washing Machines ---
            {
                "name": "Panasonic 7.5 kg Fully-Automatic Top Load Washing Machine, model PANTL75",
                "slug": "panasonic-pantl75",
                "brand": "Panasonic",
                "model": "PANTL75",
                "sku": "PAN-TL75",
                "category_slug": "washing-machines",
                "subcategory_slug": "top-load-washing-machine",
                "selling_price": 18990,
                "mrp": 23190,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
                "short_description": "5-Star rated 7.5 kg top load washer with Active Foam Wash and Aqua Spin Rinse.",
                "description": "Lifts tough stains using high-density foam before washing begins.",
                "key_features": ["Active Foam System", "Aqua Spin Rinse", "Water Reuse Option", "Stainless Steel Drum"],
                "specifications": {
                    "capacity": "7.5 kg",
                    "star_rating": 5,
                    "load_type": "Top Load",
                    "motor_speed": "702 RPM"
                },
                "is_featured": True,
                "is_price_drop": True
            },
            {
                "name": "Panasonic 6.5 kg Fully-Automatic Top Load Washing Machine, model PANTL65",
                "slug": "panasonic-pantl65",
                "brand": "Panasonic",
                "model": "PANTL65",
                "sku": "PAN-TL65",
                "category_slug": "washing-machines",
                "subcategory_slug": "top-load-washing-machine",
                "selling_price": 17790,
                "mrp": 21690,
                "discount_percent": 17,
                "image_url": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
                "short_description": "Compact 6.5 kg automatic top load washer for small families.",
                "description": "Easy one-touch wash cycles with quick wash option.",
                "key_features": ["Fuzzy Logic", "Soft Closing Lid", "Child Lock"],
                "specifications": {
                    "capacity": "6.5 kg",
                    "star_rating": 5,
                    "load_type": "Top Load"
                },
                "is_featured": False,
                "is_price_drop": False
            },
            {
                "name": "IFB 8 kg Fully-Automatic Front Load Washing Machine, model IFBFL8",
                "slug": "ifb-ifbfl8",
                "brand": "IFB",
                "model": "IFBFL8",
                "sku": "IFB-FL8",
                "category_slug": "washing-machines",
                "subcategory_slug": "front-load-washing-machine",
                "selling_price": 34390,
                "mrp": 41990,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
                "short_description": "AI-powered front load washing machine with steam wash and 9-swirl wash motion.",
                "description": "Eliminates 99.9% germs and allergens with built-in heater and aqua energie water softener.",
                "key_features": ["Steam Wash at 95°C", "Aqua Energie", "Crescent Moon Drum", "Ball Valve Technology"],
                "specifications": {
                    "capacity": "8 kg",
                    "star_rating": 5,
                    "load_type": "Front Load",
                    "motor_speed": "1400 RPM"
                },
                "is_featured": True,
                "is_price_drop": True
            },
            {
                "name": "IFB 7 kg Fully-Automatic Front Load Washing Machine, model IFBFL7",
                "slug": "ifb-ifbfl7",
                "brand": "IFB",
                "model": "IFBFL7",
                "sku": "IFB-FL7",
                "category_slug": "washing-machines",
                "subcategory_slug": "front-load-washing-machine",
                "selling_price": 32590,
                "mrp": 39790,
                "discount_percent": 18,
                "image_url": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
                "short_description": "7 kg front loader with cradle wash program for silks and delicate garments.",
                "description": "High performance front loader with voltage protection and auto imbalance vibration control.",
                "key_features": ["Cradle Wash", "Inbuilt Heater", "Child Lock"],
                "specifications": {
                    "capacity": "7 kg",
                    "star_rating": 5,
                    "load_type": "Front Load"
                },
                "is_featured": False,
                "is_price_drop": True
            }
        ]

        for p_data in products_data:
            c_slug = p_data.pop("category_slug")
            s_slug = p_data.pop("subcategory_slug", None)
            
            cat = cat_map.get(c_slug)
            sub = sub_map.get(s_slug) if s_slug else None

            prod = Product(
                category_id=cat.id if cat else None,
                subcategory_id=sub.id if sub else None,
                **p_data
            )
            db.add(prod)

        # 4. Offers
        offers_data = [
            {
                "title": "Welcome offer: 10% off, up to ₹2,000",
                "discount_badge": "10% off, up to ₹2,000",
                "coupon_code": "WELCOME10",
                "description": "Use code WELCOME10 at the billing counter.",
                "validity": "Valid 1 Apr 2026 – 31 Mar 2027 · at all stores",
                "terms": "Offer valid on purchases above ₹15,000. Applicable on ACs, TVs, Refrigerators, and Washing Machines across all Murali Electronics stores in Andhra Pradesh.",
                "is_active": True
            },
            {
                "title": "Summer Exchange Bonanza",
                "discount_badge": "Extra ₹3,000 Off",
                "coupon_code": "SUMMEREX3K",
                "description": "Exchange any old appliance and get an additional discount on inverter air conditioners.",
                "validity": "Valid through this summer · at all stores",
                "terms": "Old appliance must be physically presented or picked up during delivery. Not combinable with other exchange vouchers.",
                "is_active": True
            }
        ]

        for off in offers_data:
            db.add(Offer(**off))

        # 5. Sample Enquiries
        db.flush()
        first_store = db.query(Store).first()
        first_prod = db.query(Product).first()

        sample_enquiries = [
            {
                "store_id": first_store.id,
                "product_id": first_prod.id,
                "customer_name": "Ramesh Kumar",
                "customer_mobile": "9848022334",
                "enquiry_type": "call_back",
                "message": "Interested in Godrej 1.5 Ton AC. Need installation by Saturday.",
                "status": "pending"
            },
            {
                "store_id": first_store.id,
                "product_id": None,
                "customer_name": "Suresh Reddy",
                "customer_mobile": "9440112233",
                "enquiry_type": "general_contact",
                "message": "Looking to buy full package for new house (TV, Refrigerator, AC, Washing Machine).",
                "status": "contacted",
                "admin_notes": "Called customer on 24th Oct, requested quotation for LG OLED + Bosch Refrigerator."
            }
        ]

        for enq in sample_enquiries:
            db.add(Enquiry(**enq))

        db.commit()
        logger.info("Successfully seeded Murali Electronics database with stores, categories, products, offers, and enquiries!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        if close_db:
            db.close()
