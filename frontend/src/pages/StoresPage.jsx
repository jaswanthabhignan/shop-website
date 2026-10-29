import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Building2,
} from 'lucide-react';

export const StoresPage = () => {
  const { stores, selectedStore, changeStore } = useStore();
  const { addToast } = useToast();

  const handleSelectStore = (store) => {
    changeStore(store);
    addToast(`${store.name} set as your active store!`, 'success');
  };

  return (
    <div className="container" style={{ paddingTop: '36px', paddingBottom: '72px' }}>
      <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
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
          <Building2 size={16} /> Retail Presence
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Our Stores</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
          Choose your nearest store: it sets the WhatsApp number and contact details you see on product pages, and where your call back enquiry goes.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}
      >
        {stores.map((store) => {
          const isSelected = selectedStore?.id === store.id;
          const cleanPhone = store.phone.replace(/\s+/g, '');
          const whatsappUrl = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
            `Hello Murali Electronics ${store.name}, I am visiting your website and have an enquiry.`
          )}`;

          return (
            <div
              key={store.id}
              style={{
                backgroundColor: '#ffffff',
                border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <CheckCircle size={13} /> Active Store
                </div>
              )}

              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                  {store.name}
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  {store.area}, {store.city}, Andhra Pradesh {store.pincode}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <a
                    href={`tel:${cleanPhone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--color-accent)',
                    }}
                  >
                    <Phone size={16} />
                    <span>{store.phone}</span>
                  </a>

                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-muted)',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-main)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', marginBottom: '6px' }}>
                      <Clock size={14} color="var(--color-text-muted)" />
                      <span>Opening Hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Monday – Saturday:</span>
                      <strong>{store.opening_hours_weekday}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Sunday:</span>
                      <strong>{store.opening_hours_sunday}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link to={`/stores/${store.code}`} className="btn btn-outline btn-sm">
                    Store Details
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </a>
                </div>

                {store.map_link && (
                  <a
                    href={store.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ justifyContent: 'center' }}
                  >
                    <ExternalLink size={13} /> View on Google Maps
                  </a>
                )}

                {!isSelected ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSelectStore(store)}
                  >
                    Make {store.name} my store
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled
                    style={{ opacity: 0.7, cursor: 'default' }}
                  >
                    Currently Selected
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
