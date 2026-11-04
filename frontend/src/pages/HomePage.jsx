import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { EnquiryModal } from '../components/EnquiryModal';
import { getProducts, getOffers } from '../services/api';
import {
  ShieldCheck,
  MapPin,
  Truck,
  Wrench,
  Wind,
  Tv,
  Refrigerator,
  WashingMachine,
  ArrowRight,
  Sparkles,
  Tag,
  PhoneCall,
  Clock,
  Phone,
  Copy,
} from 'lucide-react';

export const HomePage = () => {
  const { stores, selectedStore, changeStore } = useStore();
  const { addToast } = useToast();

  const [acProducts, setAcProducts] = useState([]);
  const [tvProducts, setTvProducts] = useState([]);
  const [fridgeProducts, setFridgeProducts] = useState([]);
  const [washerProducts, setWasherProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enquiry modal state
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [selectedProductForCallback, setSelectedProductForCallback] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [acRes, tvRes, fridgeRes, washerRes, offersRes] = await Promise.all([
          getProducts({ category: 'air-conditioners', limit: 4 }),
          getProducts({ category: 'televisions', limit: 4 }),
          getProducts({ category: 'refrigerators', limit: 4 }),
          getProducts({ category: 'washing-machines', limit: 4 }),
          getOffers(),
        ]);

        setAcProducts(acRes.items || []);
        setTvProducts(tvRes.items || []);
        setFridgeProducts(fridgeRes.items || []);
        setWasherProducts(washerRes.items || []);
        setOffers(offersRes || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenCallback = (product) => {
    setSelectedProductForCallback(product);
    setCallbackModalOpen(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    addToast(`Coupon code ${code} copied to clipboard!`, 'success');
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tagline-badge">
              <Sparkles size={14} />
              <span>4 Stores in Andhra Pradesh · 17 Trusted Brands</span>
            </div>

            <h1 className="hero-title">
              Home Appliances, Delivered with Care by Real Stores
            </h1>

            <p className="hero-subtitle">
              Compare air conditioners, TVs, refrigerators and washing machines, then talk to your nearest Murali Electronics store on WhatsApp — <strong>no online payment, no pressure</strong>.
            </p>

            <div className="hero-badges-strip">
              <Link to="/c/air-conditioners" className="hero-pill-link">
                Split & Window ACs
              </Link>
              <Link to="/c/televisions" className="hero-pill-link">
                4K UHD & OLED TVs
              </Link>
              <Link to="/c/refrigerators" className="hero-pill-link">
                Side-by-Side Fridges
              </Link>
              <Link to="/c/washing-machines" className="hero-pill-link">
                Front & Top Load Washers
              </Link>
              <Link to="/offers" className="hero-pill-link" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
                View Store Offers →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Murali Electronics - Value Props */}
      <div className="container">
        <div className="props-grid">
          <div className="prop-card">
            <div className="prop-icon">
              <ShieldCheck size={24} />
            </div>
            <h4 className="prop-title">Genuine Brands</h4>
            <p className="prop-desc">
              17 top tier brands with genuine manufacturer warranty and GST invoice on every appliance.
            </p>
          </div>

          <div className="prop-card">
            <div className="prop-icon">
              <MapPin size={24} />
            </div>
            <h4 className="prop-title">A Store Near You</h4>
            <p className="prop-desc">
              4 stores in Nellore, Gudur, Guntur & Vijayawada where you can touch and see before you decide.
            </p>
          </div>

          <div className="prop-card">
            <div className="prop-icon">
              <Truck size={24} />
            </div>
            <h4 className="prop-title">Delivery & Installation</h4>
            <p className="prop-desc">
              Your store arranges prompt doorstep delivery and expert brand installation technicians.
            </p>
          </div>

          <div className="prop-card">
            <div className="prop-icon">
              <Wrench size={24} />
            </div>
            <h4 className="prop-title">Help After You Buy</h4>
            <p className="prop-desc">
              Warranty registration support and dedicated service assistance from the store you bought at.
            </p>
          </div>
        </div>

        {/* Shop by Category Section */}
        <section style={{ marginBottom: '64px' }} id="categories">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Explore top-selling appliances for your home
              </p>
            </div>
            <Link to="/c/all" className="section-link">
              View All Catalogue <ArrowRight size={15} />
            </Link>
          </div>

          <div className="category-grid">
            <Link to="/c/air-conditioners" className="category-card">
              <div>
                <div className="category-card-top">
                  <div className="category-card-icon">
                    <Wind size={26} />
                  </div>
                  <h3 className="category-card-title">Air Conditioners</h3>
                </div>
                <p className="category-card-desc">
                  Split and window air conditioners from Daikin, Voltas, Blue Star, Carrier, and Godrej with installation support.
                </p>
              </div>
              <span className="section-link">Explore ACs →</span>
            </Link>

            <Link to="/c/televisions" className="category-card">
              <div>
                <div className="category-card-top">
                  <div className="category-card-icon">
                    <Tv size={26} />
                  </div>
                  <h3 className="category-card-title">Televisions</h3>
                </div>
                <p className="category-card-desc">
                  LED, QLED and OLED televisions in sizes from 32" to 77" with free wall-mount installation.
                </p>
              </div>
              <span className="section-link">Explore TVs →</span>
            </Link>

            <Link to="/c/refrigerators" className="category-card">
              <div>
                <div className="category-card-top">
                  <div className="category-card-icon">
                    <Refrigerator size={26} />
                  </div>
                  <h3 className="category-card-title">Refrigerators</h3>
                </div>
                <p className="category-card-desc">
                  Single-door, double-door and side-by-side refrigerators for modern kitchens with inverter compressors.
                </p>
              </div>
              <span className="section-link">Explore Refrigerators →</span>
            </Link>

            <Link to="/c/washing-machines" className="category-card">
              <div>
                <div className="category-card-top">
                  <div className="category-card-icon">
                    <WashingMachine size={26} />
                  </div>
                  <h3 className="category-card-title">Washing Machines</h3>
                </div>
                <p className="category-card-desc">
                  Front-load, top-load and semi-automatic washers from IFB, Panasonic, and Whirlpool.
                </p>
              </div>
              <span className="section-link">Explore Washers →</span>
            </Link>
          </div>
        </section>

        {/* Current Offers Banner */}
        {offers.length > 0 && (
          <section
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 32px',
              marginBottom: '64px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                <Tag size={12} /> Active Store Coupon
              </span>
              <h3 style={{ fontSize: '1.45rem', color: 'var(--color-primary)', marginBottom: '6px' }}>
                {offers[0].title}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
                {offers[0].description} · {offers[0].validity}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px dashed var(--color-accent)',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  color: 'var(--color-accent)',
                  letterSpacing: '0.08em',
                }}
              >
                {offers[0].coupon_code}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleCopyCode(offers[0].coupon_code)}
              >
                <Copy size={16} /> Copy Code
              </button>
            </div>
          </section>
        )}

        {/* Air Conditioners Section */}
        {acProducts.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Air Conditioners</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Split & Window models with copper condenser and power saving star ratings
                </p>
              </div>
              <Link to="/c/air-conditioners" className="section-link">
                View All ACs ({acProducts.length}+) <ArrowRight size={15} />
              </Link>
            </div>

            <div className="product-grid">
              {acProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpenCallback={handleOpenCallback} />
              ))}
            </div>
          </section>
        )}

        {/* Televisions Section */}
        {tvProducts.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Televisions</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Smart Google TVs, 4K UHD screens, and flagship OLED displays
                </p>
              </div>
              <Link to="/c/televisions" className="section-link">
                View All Televisions <ArrowRight size={15} />
              </Link>
            </div>

            <div className="product-grid">
              {tvProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpenCallback={handleOpenCallback} />
              ))}
            </div>
          </section>
        )}

        {/* Refrigerators Section */}
        {fridgeProducts.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Refrigerators</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Energy-smart single door, frost-free double door, and high-capacity side-by-side models
                </p>
              </div>
              <Link to="/c/refrigerators" className="section-link">
                View All Refrigerators <ArrowRight size={15} />
              </Link>
            </div>

            <div className="product-grid">
              {fridgeProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpenCallback={handleOpenCallback} />
              ))}
            </div>
          </section>
        )}

        {/* Washing Machines Section */}
        {washerProducts.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Washing Machines</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Smart load detection, steam hygiene, and high spin efficiency
                </p>
              </div>
              <Link to="/c/washing-machines" className="section-link">
                View All Washing Machines <ArrowRight size={15} />
              </Link>
            </div>

            <div className="product-grid">
              {washerProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpenCallback={handleOpenCallback} />
              ))}
            </div>
          </section>
        )}

        {/* How Buying From Us Works */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            marginBottom: '64px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>How Buying From Us Works</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
              Transparent pricing, authentic products, and zero pressure
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#eff6ff',
                  color: 'var(--color-accent)',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                1
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Compare Online</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                Browse exact models, verified technical specifications, and indicative store prices on our website.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                2
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Enquire Your Way</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                Chat with your chosen store staff directly on WhatsApp or request a fast call back at your convenience.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                3
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Buy at the Store</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                Confirm final billing discount, arrange delivery and installation, and pay securely at the store.
              </p>
            </div>
          </div>
        </section>

        {/* Visit Our 4 Stores */}
        <section style={{ marginBottom: '72px' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Visit a Store Near You</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Our 4 flagship branches across Andhra Pradesh
              </p>
            </div>
            <Link to="/stores" className="section-link">
              All Store Details <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {stores.map((store) => {
              const isSelected = selectedStore?.id === store.id;
              return (
                <div
                  key={store.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{store.name}</h3>
                      {isSelected && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: 'var(--color-accent)',
                            color: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: '600',
                          }}
                        >
                          My Store
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                      {store.area}, {store.city}, AP {store.pincode}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="var(--color-accent)" /> {store.phone}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--color-accent)" /> Mon-Sat: {store.opening_hours_weekday}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={`/stores/${store.code}`}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                    >
                      Store Details
                    </Link>
                    {!isSelected && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          changeStore(store);
                          addToast(`Set ${store.name} as your primary store!`, 'success');
                        }}
                      >
                        Set as My Store
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        product={selectedProductForCallback}
      />
    </div>
  );
};
