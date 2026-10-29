import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { EnquiryModal } from '../components/EnquiryModal';
import { ChevronRight, Home, Sparkles, AlertCircle } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTonnage, setSelectedTonnage] = useState(null);
  const [selectedStarRating, setSelectedStarRating] = useState(null);
  const [selectedInverter, setSelectedInverter] = useState(null);
  const [sortBy, setSortBy] = useState('default');

  // Callback Modal State
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [selectedProductForCallback, setSelectedProductForCallback] = useState(null);

  // Search keyword from URL query ?search=
  const searchQuery = searchParams.get('search') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';

  // Load all categories for breadcrumbs and navigation
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Products based on route and filters
  useEffect(() => {
    async function fetchCatalogue() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: sortBy,
        };

        if (slug && slug !== 'all') {
          params.category = slug;
        }

        if (subcategoryParam) {
          params.subcategory = subcategoryParam;
        }

        if (selectedBrands.length > 0) {
          params.brand = selectedBrands.join(',');
        }

        if (selectedTonnage) {
          params.tonnage = selectedTonnage;
        }

        if (selectedStarRating !== null) {
          params.star_rating = selectedStarRating;
        }

        if (selectedInverter !== null) {
          params.inverter = selectedInverter;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const data = await getProducts(params);
        setProducts(data.items || []);
        setFacets(data.facets || {});
        setTotalCount(data.total || 0);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogue();
  }, [
    slug,
    subcategoryParam,
    selectedBrands,
    selectedTonnage,
    selectedStarRating,
    selectedInverter,
    sortBy,
    currentPage,
    searchQuery,
  ]);

  // Find current category object
  const currentCategory = categories.find((c) => c.slug === slug);

  const handleToggleBrand = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedTonnage(null);
    setSelectedStarRating(null);
    setSelectedInverter(null);
    setSortBy('default');
    setCurrentPage(1);
  };

  const handleOpenCallback = (product) => {
    setSelectedProductForCallback(product);
    setCallbackModalOpen(true);
  };

  return (
    <div className="container" style={{ paddingBottom: '72px', paddingTop: '28px' }}>
      {/* Breadcrumbs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: '20px',
        }}
        aria-label="Breadcrumb"
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Home size={14} /> Home
        </Link>
        <ChevronRight size={14} />
        {currentCategory ? (
          <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>
            {currentCategory.name}
          </span>
        ) : (
          <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>
            {searchQuery ? `Search: "${searchQuery}"` : 'All Appliances'}
          </span>
        )}
        {subcategoryParam && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>
              {subcategoryParam.replace(/-/g, ' ').toUpperCase()}
            </span>
          </>
        )}
      </nav>

      {/* Header Info */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>
          {currentCategory ? currentCategory.name : searchQuery ? `Search Results for "${searchQuery}"` : 'All Home Appliances'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '780px' }}>
          {currentCategory?.description ||
            'Compare specifications, genuine brand warranty and indicative store prices. Talk to your nearest store team on WhatsApp.'}
        </p>

        {/* Subcategories Shortcuts */}
        {currentCategory?.subcategories?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => {
                setSearchParams({});
                setCurrentPage(1);
              }}
              className={!subcategoryParam ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
            >
              All {currentCategory.name}
            </button>
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSearchParams({ subcategory: sub.slug });
                  setCurrentPage(1);
                }}
                className={subcategoryParam === sub.slug ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notice Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span>
          Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> products in Andhra Pradesh stores.
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          Indicative pricing: Your store confirms current store discounts and installation terms.
        </span>
      </div>

      {/* Layout with Sidebar & Products */}
      <div className="catalogue-layout">
        {/* Sidebar Filters */}
        <FilterSidebar
          facets={facets}
          selectedBrands={selectedBrands}
          onToggleBrand={handleToggleBrand}
          selectedTonnage={selectedTonnage}
          onSelectTonnage={(t) => {
            setSelectedTonnage(t);
            setCurrentPage(1);
          }}
          selectedStarRating={selectedStarRating}
          onSelectStarRating={(s) => {
            setSelectedStarRating(s);
            setCurrentPage(1);
          }}
          selectedInverter={selectedInverter}
          onSelectInverter={(i) => {
            setSelectedInverter(i);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onChangeSort={(val) => {
            setSortBy(val);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
        />

        {/* Product Grid Area */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '72px 0' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '3px solid var(--color-border)',
                  borderTopColor: 'var(--color-accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ marginTop: '16px', color: 'var(--color-text-muted)' }}>
                Loading catalogue products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '64px 32px',
                textAlign: 'center',
              }}
            >
              <AlertCircle size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
                Try adjusting or resetting your brand and specification filters.
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenCallback={handleOpenCallback}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '36px',
                  }}
                >
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', padding: '0 8px' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        product={selectedProductForCallback}
      />
    </div>
  );
};
