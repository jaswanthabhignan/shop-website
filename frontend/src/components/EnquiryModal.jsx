import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { createEnquiry } from '../services/api';
import { PhoneCall, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const EnquiryModal = ({ isOpen, onClose, product = null }) => {
  const { stores, selectedStore } = useStore();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [storeId, setStoreId] = useState(selectedStore?.id || (stores[0]?.id || ''));
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (!consent) {
      addToast('Please agree to receive a call back', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createEnquiry({
        customer_name: name.trim(),
        customer_mobile: cleanMobile,
        store_id: storeId ? parseInt(storeId) : selectedStore?.id,
        product_id: product?.id || null,
        enquiry_type: 'call_back',
        message: message.trim() || (product ? `Enquiry for ${product.name}` : 'General customer enquiry'),
      });

      setSuccess(true);
      addToast('Call back request submitted successfully!', 'success');
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setMobile('');
        setMessage('');
        onClose();
      }, 2400);
    } catch (err) {
      addToast(err.message || 'Failed to submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhoneCall size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Request a Call Back</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {product ? `About: ${product.name}` : 'Connect with your nearest Murali Electronics store'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>Thank You, {name}!</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', maxWidth: '380px', margin: '0 auto' }}>
              Your nearest store team has received your enquiry and will call or WhatsApp you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {product && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-muted)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                      PRODUCT MODEL
                    </span>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{product.model} · {product.brand}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PRICE</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                      ₹{product.selling_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (10 digits) *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9848012345"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                  required
                />
                <span className="form-help">Our store team will call or WhatsApp you on this number.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Store *</label>
                <select
                  className="form-select"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.area}, {s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message or Questions (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Tell us what you need (e.g. size, installation requirement, best exchange offer)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px' }}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--color-accent)' }}
                />
                <label htmlFor="consent" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  I agree to be contacted by Murali Electronics store staff regarding this product enquiry. No spam guaranteed.
                </label>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <ShieldCheck size={16} color="#059669" />
                <span>Enquiry-only platform: No online payment required. Pay safely at the store.</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
