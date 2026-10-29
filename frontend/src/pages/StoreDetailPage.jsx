import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { getStore, getProducts, createEnquiry } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { EnquiryModal } from '../components/EnquiryModal';
import {
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Home,
  CheckCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const StoreDetailPage = () => {
  const { code } = useParams();
  const { selectedStore, changeStore } = useStore();
  const { addToast } = useToast();

  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Callback modal
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Quick enquiry form
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custMessage, setCustMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadStoreData() {
      setLoading(true);
      try {
        const storeData = await getStore(code);
        setStore(storeData);

        const prods = await getProducts({ limit: 4, is_featured: true });
        setStoreProducts(prods.items || []);
      } catch (err) {
        console.error('Error fetching store details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStoreData();
  }, [code]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading store details...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <h2>Store Not Found</h2>
        <Link to="/stores" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to All Stores
        </Link>
      </div>
    );
  }

  const isCurrent = selectedStore?.id === store.id;
  const whatsappUrl = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
    `Hello Murali Electronics ${store.name}, I am reaching out regarding products at your store.`
  )}`;

  const handleMakeMyStore = () => {
    changeStore(store);
    addToast(`${store.name} set as your active store!`, 'success');
  };

  const handleStoreEnquiry = async (e) => {
    e.preventDefault();
    const cleanMobile = custMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry({
        customer_name: custName.trim(),
        customer_mobile: cleanMobile,
        store_id: store.id,
        enquiry_type: 'call_back',
        message: custMessage.trim() || `General enquiry for ${store.name} store`,
      });

      addToast(`Enquiry submitted! The ${store.name} team will contact you shortly.`, 'success');
      setCustName('');
      setCustMobile('');
      setCustMessage('');
    } catch (err) {
      addToast(err.message || 'Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '28px', paddingBottom: '72px' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: '24px',
        }}
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Home size={14} /> Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/stores">Stores</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>{store.name}</span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          marginBottom: '56px',
        }}
      >
        {/* Left: Store Card Info */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-accent)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                <Building2 size={14} /> Murali Electronics Store
              </span>
              <h1 style={{ fontSize: '2.25rem' }}>{store.name}</h1>
            </div>

            {isCurrent && (
              <span
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Active Store
              </span>
            )}
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            {store.area}, {store.city}, Andhra Pradesh {store.pincode}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="var(--color-accent)" />
              <a href={`tel:${store.phone.replace(/\s+/g, '')}`} style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-accent)' }}>
                {store.phone}
              </a>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-bg-muted)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', marginBottom: '8px' }}>
                <Clock size={16} />
                <span>Store Timings</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                Monday – Saturday: <strong>{store.opening_hours_weekday}</strong>
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Sunday: <strong>{store.opening_hours_sunday}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageSquare size={16} /> Chat on WhatsApp
            </a>

            {store.map_link && (
              <a
                href={store.map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <ExternalLink size={15} /> Directions
              </a>
            )}

            {!isCurrent && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleMakeMyStore}
              >
                Make {store.name} my store
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Direct Callback Enquiry */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>
            Talk to the {store.name} Team
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
            Leave your name and number. Our store manager in {store.name} will call you back to help with pricing and stock availability.
          </p>

          <form onSubmit={handleStoreEnquiry}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={custMobile}
                onChange={(e) => setCustMobile(e.target.value)}
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">What appliance are you looking for?</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. 1.5 ton split AC, or double door refrigerator..."
                value={custMessage}
                onChange={(e) => setCustMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : `Request Call from ${store.name} Store`}
            </button>
          </form>
        </div>
      </div>

      {/* Featured in Store */}
      {storeProducts.length > 0 && (
        <section>
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Appliances Available to Enquire</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Visit our showroom to inspect these items in person
              </p>
            </div>
            <Link to="/c/all" className="section-link">
              Browse Full Catalogue →
            </Link>
          </div>

          <div className="product-grid">
            {storeProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenCallback={() => {
                  setSelectedProduct(p);
                  setCallbackModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      <EnquiryModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};
