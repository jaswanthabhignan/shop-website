import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem' }}>Murali Electronics</h3>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '18px' }}>
              Home appliances and electronics from trusted brands, with help from a real store team before and after you buy.
            </p>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.78rem',
                color: '#cbd5e1',
              }}
            >
              <ShieldCheck size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Enquiry-only website:</strong> There are no online payments or orders. Prices, warranty and offers are confirmed at the billing counter in store.
              </span>
            </div>
          </div>

          {/* Our Stores */}
          <div>
            <h4 className="footer-col-title">Our Stores</h4>
            <ul className="footer-links">
              <li>
                <Link to="/stores/nlr" className="footer-link">
                  Nellore (Trunk Road)
                </Link>
              </li>
              <li>
                <Link to="/stores/gdr" className="footer-link">
                  Gudur (Main Bazar Road)
                </Link>
              </li>
              <li>
                <Link to="/stores/gnt" className="footer-link">
                  Guntur (Brodipet)
                </Link>
              </li>
              <li>
                <Link to="/stores/vja" className="footer-link">
                  Vijayawada (MG Road)
                </Link>
              </li>
              <li>
                <Link to="/stores" style={{ color: '#38bdf8', fontSize: '0.8125rem', fontWeight: '600' }}>
                  View All Store Timings →
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              <li>
                <Link to="/c/air-conditioners" className="footer-link">
                  Air Conditioners
                </Link>
              </li>
              <li>
                <Link to="/c/televisions" className="footer-link">
                  Televisions
                </Link>
              </li>
              <li>
                <Link to="/c/refrigerators" className="footer-link">
                  Refrigerators
                </Link>
              </li>
              <li>
                <Link to="/c/washing-machines" className="footer-link">
                  Washing Machines
                </Link>
              </li>
              <li>
                <Link to="/offers" className="footer-link">
                  Current Offers & Discounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office & Support */}
          <div>
            <h4 className="footer-col-title">Store Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <a
                href="tel:+919000000000"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}
              >
                <Phone size={15} color="#38bdf8" />
                <span>+91 9000000000</span>
              </a>
              <a
                href="mailto:care@murali.test"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}
              >
                <Mail size={15} color="#38bdf8" />
                <span>care@murali.test</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                <MapPin size={15} color="#38bdf8" />
                <span>Head Office: Andhra Pradesh, India</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Link to="/admin" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'underline' }}>
                  Store Staff & Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Murali Electronics. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/contact" className="footer-link">
              Contact Us
            </Link>
            <Link to="/offers" className="footer-link">
              Offers
            </Link>
            <span style={{ color: '#475569' }}>·</span>
            <span>Privacy Notice</span>
            <span style={{ color: '#475569' }}>·</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
