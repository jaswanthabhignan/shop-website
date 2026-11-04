import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { getProduct, createEnquiry } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { EnquiryModal } from '../components/EnquiryModal';
import {
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronRight,
  Home,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { selectedStore, getWhatsAppLink } = useStore();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);

  // Inline Quick Call Back Form State
  const [inlineName, setInlineName] = useState('');
  const [inlineMobile, setInlineMobile] = useState('');
  const [inlineConsent, setInlineConsent] = useState(true);
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineSuccess, setInlineSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProduct(slug);
        setProduct(data.product);
        setRelated(data.related || []);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    if (!inlineName.trim()) {
      addToast('Please enter your name', 'error');
      return;
    }

    const clean = inlineMobile.replace(/\D/g, '');
    if (clean.length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (!inlineConsent) {
      addToast('Please consent to receiving a call back', 'error');
      return;
    }

    setInlineSubmitting(true);
    try {
      await createEnquiry({
        customer_name: inlineName.trim(),
        customer_mobile: clean,
        store_id: selectedStore?.id,
        product_id: product?.id,
        enquiry_type: 'call_back',
        message: `Product detail callback request for ${product.name} (${product.model})`,
      });

      setInlineSuccess(true);
      addToast('Callback request submitted successfully!', 'success');
      setTimeout(() => {
        setInlineSuccess(false);
        setInlineName('');
        setInlineMobile('');
      }, 4000);
    } catch (err) {
      addToast(err.message || 'Failed to submit request', 'error');
    } finally {
      setInlineSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '12px 0 24px' }}>
          The requested appliance model may have been moved or updated.
        </p>
        <Link to="/c/all" className="btn btn-primary">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const specs = product.specifications || {};
  const keyFeatures = product.key_features || [];
  const whatsappUrl = getWhatsAppLink(product);

  const formattedPrice = product.selling_price
    ? `₹${Number(product.selling_price).toLocaleString('en-IN')}`
    : 'Price on request';

  const formattedMrp = product.mrp
    ? `₹${Number(product.mrp).toLocaleString('en-IN')}`
    : null;

  return (
    <div className="container" style={{ paddingTop: '28px', paddingBottom: '72px' }}>
      {/* Breadcrumb Navigation */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
        aria-label="Breadcrumb"
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Home size={14} /> Home
        </Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link to={`/c/${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        {product.subcategory && (
          <>
            <ChevronRight size={14} />
            <Link to={`/c/${product.category?.slug}?subcategory=${product.subcategory.slug}`}>
              {product.subcategory.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '44px',
          marginBottom: '56px',
        }}
      >
        {/* Left: Product Image */}
        <div>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '480px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
              <span className="badge-brand" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                {product.brand}
              </span>
              {product.discount_percent > 0 && (
                <span className="badge-discount" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                  {product.discount_percent}% off
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div>
          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: 'var(--color-text-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Model {product.model} · SKU {product.sku}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '14px', lineHeight: '1.3' }}>
            {product.name}
          </h1>

          {/* Quick specs chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {specs.tonnage && <span className="spec-chip">Tonnage: {specs.tonnage}</span>}
            {specs.star_rating && <span className="spec-chip">Energy Star: {specs.star_rating}</span>}
            {specs.inverter !== undefined && (
              <span className="spec-chip">Inverter: {specs.inverter ? 'Yes' : 'No'}</span>
            )}
            {specs.screen_size && <span className="spec-chip">Size: {specs.screen_size}</span>}
            {specs.display_type && <span className="spec-chip">{specs.display_type}</span>}
            {specs.capacity && <span className="spec-chip">Capacity: {specs.capacity}</span>}
            {specs.door_type && <span className="spec-chip">{specs.door_type}</span>}
            {specs.load_type && <span className="spec-chip">{specs.load_type}</span>}
          </div>

          {/* Price Box */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {formattedPrice}
              </span>
              {formattedMrp && (
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                  MRP {formattedMrp}
                </span>
              )}
              {product.discount_percent > 0 && (
                <span
                  style={{
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {product.discount_percent}% off
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              <strong>Indicative price:</strong> Your chosen store confirms the final price, current counter offers, and any delivery or installation charges before you pay in store.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageSquare size={20} />
                <span>Enquire on WhatsApp · {selectedStore?.name || 'Nellore'} Store</span>
              </a>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
                Opens WhatsApp with product details ready to send to your local store. Your chat stays private in WhatsApp.
              </p>

              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => setCallbackModalOpen(true)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <PhoneCall size={18} />
                <span>Request a Call Back</span>
              </button>
            </div>
          </div>

          {/* Guarantees & Buying In-Store Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <ShieldCheck size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>{product.warranty_info}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Keep the GST invoice from the store for manufacturer authorized warranty service.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Truck size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Delivery & Installation</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Arranged by your store — ask about timing and charges when you enquire.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <CreditCard size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Enquiry only — you buy in store</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  No online payment or order. Pay at the store by cash, UPI, or credit/debit card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs / Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          marginBottom: '56px',
        }}
      >
        {/* Specifications Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Technical Specifications</h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--color-text-muted)', width: '40%' }}>Brand</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{product.brand}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--color-text-muted)' }}>Model Name / Number</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{product.model}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 8px', color: 'var(--color-text-muted)' }}>SKU Reference</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{product.sku}</td>
              </tr>
              {Object.entries(specs).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                    {k.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: '600' }}>
                    {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                  </td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '12px 8px', color: 'var(--color-text-muted)' }}>Warranty</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{product.warranty_info}</td>
              </tr>
            </tbody>
          </table>

          {keyFeatures.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>Key Highlights</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--color-text-main)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                {keyFeatures.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Inline Callback Form ("Prefer a call? Leave your number") */}
        <div
          id="enquiry"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            height: 'fit-content',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Direct Store Assistance
            </span>
            <h2 style={{ fontSize: '1.4rem', marginTop: '4px' }}>Prefer a call?</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '6px' }}>
              Leave your number — a team member from your chosen store calls or WhatsApps you.
            </p>
          </div>

          {inlineSuccess ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h4>We have your details!</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                Our team at {selectedStore?.name} will get in touch regarding this model shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleInlineSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter full name"
                  value={inlineName}
                  onChange={(e) => setInlineName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9848012345"
                  value={inlineMobile}
                  onChange={(e) => setInlineMobile(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Store</label>
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--color-bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {selectedStore ? `${selectedStore.name} (${selectedStore.area})` : 'Nellore'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '18px' }}>
                <input
                  type="checkbox"
                  id="inline-consent"
                  checked={inlineConsent}
                  onChange={(e) => setInlineConsent(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--color-accent)' }}
                />
                <label htmlFor="inline-consent" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  I agree to receive a call/WhatsApp from Murali Electronics regarding this product enquiry.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={inlineSubmitting}
              >
                {inlineSubmitting ? 'Submitting...' : 'Call Me Back'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section style={{ marginTop: '48px' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Similar Appliances in {product.category?.name}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Explore alternative models and capacities
              </p>
            </div>
            {product.category && (
              <Link to={`/c/${product.category.slug}`} className="section-link">
                View All {product.category.name} →
              </Link>
            )}
          </div>

          <div className="product-grid">
            {related.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onOpenCallback={() => {
                  setProduct(rel);
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
        product={product}
      />
    </div>
  );
};
