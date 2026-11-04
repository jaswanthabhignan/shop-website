import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';

export const FilterSidebar = ({
  facets = {},
  selectedBrands = [],
  onToggleBrand,
  selectedTonnage,
  onSelectTonnage,
  selectedStarRating,
  onSelectStarRating,
  selectedInverter,
  onSelectInverter,
  sortBy,
  onChangeSort,
  onResetFilters,
}) => {
  const brands = facets.brands || [];
  const tonnages = facets.tonnages || [];
  const starRatings = facets.star_ratings || [];
  const inverterFacets = facets.inverter || { yes: 0, no: 0 };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedTonnage ||
    selectedStarRating !== null ||
    selectedInverter !== null;

  return (
    <aside className="filter-sidebar">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.95rem',
            fontWeight: '700',
            color: 'var(--color-primary)',
          }}
        >
          <Filter size={16} /> Filters
        </span>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Sort Option */}
      <div className="filter-group">
        <label className="filter-title">Sort By</label>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => onChangeSort(e.target.value)}
          style={{ fontSize: '0.85rem', padding: '8px 10px' }}
        >
          <option value="default">Featured / Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="discount_desc">Biggest Discount</option>
          <option value="name_asc">Product Name (A-Z)</option>
        </select>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="filter-group">
          <label className="filter-title">Brands</label>
          <div className="filter-options" style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {brands.map((b) => {
              const isChecked = selectedBrands.includes(b.name);
              return (
                <label key={b.name} className="filter-checkbox-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleBrand(b.name)}
                    />
                    {b.name}
                  </span>
                  <span className="filter-count-badge">{b.count}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Tonnage Filter (For ACs) */}
      {tonnages.length > 0 && (
        <div className="filter-group">
          <label className="filter-title">Capacity / Tonnage</label>
          <div className="filter-options">
            {tonnages.map((t) => {
              const isChecked = selectedTonnage === t.name;
              return (
                <label key={t.name} className="filter-checkbox-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="tonnage"
                      checked={isChecked}
                      onChange={() => onSelectTonnage(isChecked ? null : t.name)}
                      style={{ marginRight: '8px', accentColor: 'var(--color-accent)' }}
                    />
                    {t.name}
                  </span>
                  <span className="filter-count-badge">{t.count}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Energy Star Rating */}
      {starRatings.length > 0 && (
        <div className="filter-group">
          <label className="filter-title">Energy Star Rating</label>
          <div className="filter-options">
            {starRatings.map((s) => {
              const starVal = parseInt(s.name);
              const isChecked = selectedStarRating === starVal;
              return (
                <label key={s.name} className="filter-checkbox-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="star_rating"
                      checked={isChecked}
                      onChange={() => onSelectStarRating(isChecked ? null : starVal)}
                      style={{ marginRight: '8px', accentColor: 'var(--color-accent)' }}
                    />
                    {s.name}
                  </span>
                  <span className="filter-count-badge">{s.count}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Inverter Compressor */}
      {(inverterFacets.yes > 0 || inverterFacets.no > 0) && (
        <div className="filter-group">
          <label className="filter-title">Inverter Technology</label>
          <div className="filter-options">
            <label className="filter-checkbox-label">
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="inverter"
                  checked={selectedInverter === true}
                  onChange={() => onSelectInverter(selectedInverter === true ? null : true)}
                  style={{ marginRight: '8px', accentColor: 'var(--color-accent)' }}
                />
                Inverter: Yes
              </span>
              <span className="filter-count-badge">{inverterFacets.yes}</span>
            </label>
            <label className="filter-checkbox-label">
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="inverter"
                  checked={selectedInverter === false}
                  onChange={() => onSelectInverter(selectedInverter === false ? null : false)}
                  style={{ marginRight: '8px', accentColor: 'var(--color-accent)' }}
                />
                Inverter: No
              </span>
              <span className="filter-count-badge">{inverterFacets.no}</span>
            </label>
          </div>
        </div>
      )}
    </aside>
  );
};
