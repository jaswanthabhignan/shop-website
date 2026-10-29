import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { createEnquiry } from '../services/api';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Headphones,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage = () => {
  const { stores, selectedStore } = useStore();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [storeId, setStoreId] = useState(selectedStore?.id || '');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter your name', 'error');
      return;
    }

    const clean = mobile.replace(/\D/g, '');
    if (clean.length < 10) {
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
        customer_mobile: clean,
        store_id: storeId ? parseInt(storeId) : selectedStore?.id,
        enquiry_type: 'general_contact',
        message: message.trim() || 'General inquiry from Contact page',
      });

      setSubmitted(true);
      addToast('Your enquiry has been received! Our store team will call you back.', 'success');
    } catch (err) {
      addToast(err.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '36px', paddingBottom: '72px' }}>
      <div style={{ maxWidth: '780px', marginBottom: '44px' }}>
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
          <Headphones size={16} /> Here to Help
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Let’s find the right appliance</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Ask about a product, price or installation. Call your nearest store, or leave your details for a call back.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
        }}
      >
        {/* Left Column: Stores & Head Office */}
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Talk to your store</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
            {stores.map((store) => (
              <div
                key={store.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{store.name}</h3>
                  <Link
                    to={`/stores/${store.code}`}
                    style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', fontWeight: '600' }}
                  >
                    Store details & WhatsApp →
                  </Link>
                </div>

                <a
                  href={`tel:${store.phone.replace(/\s+/g, '')}`}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Phone size={14} /> {store.phone}
                </a>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '12px' }}>
              Head Office Support
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '16px' }}>
              For bulk corporate purchase enquiries or state-wide warranty escalations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <a
                href="tel:+919000000000"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}
              >
                <Phone size={16} /> +91 9000000000
              </a>
              <a
                href="mailto:care@murali.test"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}
              >
                <Mail size={16} /> care@murali.test
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Callback Request Form */}
        <div>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Request a call back</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Tell us what you need (size, budget, installation). A team member from your chosen store calls or WhatsApps you.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <CheckCircle2 size={52} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Enquiry Submitted</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  Our store advisor will connect with you on {mobile} shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '20px' }}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
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
                  <span className="form-help">10-digit mobile number; we call or WhatsApp you on it.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Nearest Store *</label>
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
                  <label className="form-label">Message (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Tell us what you are looking for (e.g. looking for 55 inch TV with wall mount)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
                  <input
                    type="checkbox"
                    id="contact-consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--color-accent)' }}
                  />
                  <label htmlFor="contact-consent" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    I agree to be contacted by Murali Electronics store staff regarding my enquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Request a Call Back'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
