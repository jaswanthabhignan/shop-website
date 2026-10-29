import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { getOffers, getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { EnquiryModal } from '../components/EnquiryModal';
import { Tag, Copy, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export const OffersPage = () => {
  const { addToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [priceDrops, setPriceDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [selectedProductForCallback, setSelectedProductForCallback] = useState(null);

  useEffect(() => {
    async function loadOffersData() {
      try {
        const [offersData, dropProducts] = await Promise.all([
          getOffers(),
          getProducts({ is_price_drop: true, limit: 16 }),
        ]);
        setOffers(offersData);
        setPriceDrops(dropProducts.items || []);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffersData();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    addToast(`Coupon code "${code}" copied to clipboard!`, 'success');
  };

  const handleOpenCallback = (product) => {
    setSelectedProductForCallback(product);
    setCallbackModalOpen(true);
  };

  return (
    <div className="container" style={{ paddingTop: '36px', paddingBottom: '72px' }}>
      <div style={{ maxWidth: '800px', marginBottom: '40px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-accent)',
            fontSize: '0.85rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}
        >
          <Tag size={16} /> Exclusive Counter Deals
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Offers & Price Drops</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
          Show the coupon code at the billing counter. Each offer lists where and until when it is valid. Offers are valid in store — ask our team for the full terms.
        </p>
      </div>

      {/* Coupons Section */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Store Coupons</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {offers.map((offer) => (
            <div
              key={offer.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '6px',
                  height: '100%',
                  backgroundColor: 'var(--color-accent)',
                }}
              />

              <div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#eff6ff',
                    color: 'var(--color-accent)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    marginBottom: '12px',
                  }}
                >
                  {offer.discount_badge}
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{offer.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '14px', lineHeight: '1.5' }}>
                  {offer.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '20px' }}>
                  {offer.validity}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  border: '1px dashed var(--color-border)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', display: 'block' }}>
                    COUPON CODE
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                    {offer.coupon_code}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCopy(offer.coupon_code)}
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Price Drops Catalogue */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="section-title">Price Drops Across Categories</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Handpicked models with current festive and seasonal markdowns
            </p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)', padding: '36px 0' }}>Loading hot price drops...</p>
        ) : priceDrops.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No active price drops currently listed.</p>
        ) : (
          <div className="product-grid">
            {priceDrops.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenCallback={handleOpenCallback}
              />
            ))}
          </div>
        )}
      </section>

      {/* Callback modal */}
      <EnquiryModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        product={selectedProductForCallback}
      />
    </div>
  );
};
