import React from 'react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Clock, Check, X } from 'lucide-react';

export const StoreModal = ({ isOpen, onClose }) => {
  const { stores, selectedStore, changeStore } = useStore();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSelect = (store) => {
    changeStore(store);
    addToast(`Switched active store to ${store.name} (${store.area})`, 'success');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Choose your nearest store</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Sets the WhatsApp number and team you connect with on product pages.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {stores.map((store) => {
            const isCurrent = selectedStore?.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => handleSelect(store)}
                style={{
                  border: isCurrent ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  backgroundColor: isCurrent ? '#f0f7ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>{store.name}</h4>
                    {isCurrent && (
                      <span
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          color: '#fff',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '600',
                        }}
                      >
                        Active Store
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    {store.area}, {store.city}, Andhra Pradesh {store.pincode}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} /> {store.phone}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> Mon-Sat: {store.opening_hours_weekday}
                    </span>
                  </div>
                </div>

                <button
                  className={isCurrent ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(store);
                  }}
                  style={{ flexShrink: 0 }}
                >
                  {isCurrent ? (
                    <>
                      <Check size={14} /> Selected
                    </>
                  ) : (
                    'Select Store'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            4 Stores across Andhra Pradesh
          </span>
          <button className="btn btn-dark btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
