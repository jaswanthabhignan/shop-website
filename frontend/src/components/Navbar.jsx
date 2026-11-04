import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MapPin, Search, Phone, Menu, X, Tag, Sparkles, Building2 } from 'lucide-react';

export const Navbar = ({ onOpenStoreModal }) => {
  const { selectedStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/c/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Store Context Strip */}
      <div className="top-store-bar">
        <div className="container top-store-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>Your preferred store:</span>
            <button
              type="button"
              className="store-active-pill"
              onClick={onOpenStoreModal}
              title="Click to change your nearest Murali Electronics store"
            >
              <MapPin size={13} color="#38bdf8" />
              <span>{selectedStore ? `${selectedStore.name} (${selectedStore.area})` : 'Choose store'}</span>
              <span style={{ textDecoration: 'underline', opacity: 0.85, marginLeft: '4px' }}>Change</span>
            </button>
          </div>

          <div className="top-bar-links">
            {selectedStore && (
              <a href={`tel:${selectedStore.phone.replace(/\s+/g, '')}`} className="top-bar-link">
                <Phone size={13} />
                <span>Call Store: {selectedStore.phone}</span>
              </a>
            )}
            <Link to="/stores" className="top-bar-link">
              <Building2 size={13} />
              <span>4 AP Stores</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <span style={{ color: 'var(--color-primary)' }}>Murali</span>{' '}
              <span style={{ color: 'var(--color-accent)' }}>Electronics</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form className="nav-search-form" onSubmit={handleSearch}>
            <Search size={16} className="nav-search-icon" />
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search ACs, TVs, Fridges, Washers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Desktop Nav Links */}
          <nav className="nav-links" style={{ display: 'none', '@media (min-width: 1024px)': { display: 'flex' } }}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/c/air-conditioners" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Air Conditioners
            </NavLink>
            <NavLink to="/c/televisions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Televisions
            </NavLink>
            <NavLink to="/c/refrigerators" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Refrigerators
            </NavLink>
            <NavLink to="/c/washing-machines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Washing Machines
            </NavLink>
            <NavLink to="/offers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Tag size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Offers
            </NavLink>
            <NavLink to="/stores" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Stores
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--color-primary)',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--color-border)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/c/air-conditioners"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Air Conditioners
            </NavLink>
            <NavLink
              to="/c/televisions"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Televisions
            </NavLink>
            <NavLink
              to="/c/refrigerators"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Refrigerators
            </NavLink>
            <NavLink
              to="/c/washing-machines"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Washing Machines
            </NavLink>
            <NavLink
              to="/offers"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Offers & Coupons
            </NavLink>
            <NavLink
              to="/stores"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Our 4 Stores
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--color-text-subtle)', fontSize: '0.825rem' }}
            >
              Admin Dashboard
            </NavLink>
          </div>
        )}
      </header>
    </>
  );
};
