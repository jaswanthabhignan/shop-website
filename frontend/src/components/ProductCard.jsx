import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MessageSquare, ArrowRight, PhoneCall } from 'lucide-react';

export const ProductCard = ({ product, onOpenCallback }) => {
  const { selectedStore, getWhatsAppLink } = useStore();

  const specs = product.specifications || {};
  const chips = [];

  if (specs.tonnage) chips.push(specs.tonnage);
  if (specs.star_rating) chips.push(`${specs.star_rating} Star`);
  if (specs.inverter !== undefined) chips.push(`Inverter: ${specs.inverter ? 'Yes' : 'No'}`);
  if (specs.screen_size) chips.push(specs.screen_size);
  if (specs.display_type) chips.push(specs.display_type);
  if (specs.resolution) chips.push(specs.resolution);
  if (specs.capacity) chips.push(specs.capacity);
  if (specs.door_type) chips.push(specs.door_type);
  if (specs.load_type) chips.push(specs.load_type);

  const formattedPrice = product.selling_price
    ? `₹${Number(product.selling_price).toLocaleString('en-IN')}`
    : 'Price on request';

  const formattedMrp = product.mrp
    ? `₹${Number(product.mrp).toLocaleString('en-IN')}`
    : null;

  const whatsappUrl = getWhatsAppLink(product);

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <Link to={`/p/${product.slug}`}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>
        <div className="product-card-badges">
          <span className="badge-brand">{product.brand}</span>
          {product.discount_percent > 0 && (
            <span className="badge-discount">{product.discount_percent}% off</span>
          )}
          {product.is_price_drop && (
            <span className="badge-price-drop">Price Drop</span>
          )}
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span>{product.model} · SKU {product.sku}</span>
        </div>

        <h3 className="product-card-name">
          <Link to={`/p/${product.slug}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        {chips.length > 0 && (
          <div className="product-specs-chips">
            {chips.slice(0, 3).map((chip, idx) => (
              <span key={idx} className="spec-chip">
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="product-card-price-group">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
              From
            </span>
            <span className="price-selling">{formattedPrice}</span>
          </div>
          {formattedMrp && (
            <span className="price-mrp" title="Maximum Retail Price">
              MRP {formattedMrp}
            </span>
          )}
        </div>

        <div className="product-card-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            title={`Enquire on WhatsApp with ${selectedStore?.name || 'our'} store`}
          >
            <MessageSquare size={15} />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onOpenCallback(product)}
            title="Request a call back from store"
          >
            <PhoneCall size={14} />
          </button>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link
            to={`/p/${product.slug}`}
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-accent)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
