import React, { useEffect, useState } from 'react';
import {
  getAdminStats,
  getEnquiries,
  updateEnquiryStatus,
  getProducts,
  deleteProduct,
} from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard,
  Inbox,
  Package,
  CheckCircle,
  Clock,
  Phone,
  Trash2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('enquiries');
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, enqData, prodsData] = await Promise.all([
        getAdminStats(),
        getEnquiries({ limit: 50 }),
        getProducts({ limit: 50 }),
      ]);
      setStats(statsData);
      setEnquiries(enqData);
      setProducts(prodsData.items || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      addToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await updateEnquiryStatus(enquiryId, newStatus);
      addToast(`Enquiry marked as ${newStatus}`, 'success');
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      addToast('Product deleted from database', 'success');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const filteredEnquiries =
    enquiryFilter === 'all'
      ? enquiries
      : enquiries.filter((e) => e.status === enquiryFilter);

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '72px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-accent)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Store Operations
          </span>
          <h1 style={{ fontSize: '2.25rem' }}>Admin & Staff Portal</h1>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '18px',
            marginBottom: '36px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>TOTAL ENQUIRIES</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>
              {stats.total_enquiries}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#d97706' }}>PENDING CALL-BACKS</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>
              {stats.enquiry_breakdown?.pending || 0}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>CONTACTED / RESOLVED</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>
              {(stats.enquiry_breakdown?.contacted || 0) + (stats.enquiry_breakdown?.completed || 0)}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>CATALOGUE PRODUCTS</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>
              {stats.total_products}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <button
          className={activeTab === 'enquiries' ? 'btn btn-primary' : 'btn btn-outline'}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('enquiries')}
        >
          <Inbox size={16} /> Customer Enquiries ({enquiries.length})
        </button>
        <button
          className={activeTab === 'products' ? 'btn btn-primary' : 'btn btn-outline'}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} /> Products Database ({products.length})
        </button>
      </div>

      {/* Tab 1: Enquiries */}
      {activeTab === 'enquiries' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem' }}>Incoming Call-Back Requests</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'pending', 'contacted', 'completed'].map((filter) => (
                <button
                  key={filter}
                  className={enquiryFilter === filter ? 'btn btn-dark btn-sm' : 'btn btn-outline btn-sm'}
                  onClick={() => setEnquiryFilter(filter)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '24px 0', textAlign: 'center' }}>
              No enquiries match this filter.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '12px 10px' }}>Date</th>
                    <th style={{ padding: '12px 10px' }}>Customer</th>
                    <th style={{ padding: '12px 10px' }}>Store</th>
                    <th style={{ padding: '12px 10px' }}>Product Reference</th>
                    <th style={{ padding: '12px 10px' }}>Notes / Message</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 10px', color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
                        {new Date(enq.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <strong>{enq.customer_name}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)' }}>
                          <Phone size={12} />
                          <a href={`tel:${enq.customer_mobile}`}>{enq.customer_mobile}</a>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '500' }}>
                        {enq.store ? enq.store.name : 'General'}
                      </td>
                      <td style={{ padding: '12px 10px', maxWidth: '240px' }}>
                        {enq.product ? (
                          <span style={{ fontSize: '0.8125rem' }}>{enq.product.name}</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-subtle)' }}>General Callback</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--color-text-muted)', maxWidth: '260px' }}>
                        {enq.message || '-'}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            backgroundColor:
                              enq.status === 'pending'
                                ? '#fef3c7'
                                : enq.status === 'contacted'
                                ? '#eff6ff'
                                : '#f0fdf4',
                            color:
                              enq.status === 'pending'
                                ? '#d97706'
                                : enq.status === 'contacted'
                                ? '#2563eb'
                                : '#16a34a',
                          }}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <select
                          className="form-select"
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          style={{ fontSize: '0.8rem', padding: '4px 8px', width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Products */}
      {activeTab === 'products' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Products in PostgreSQL Database</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '10px' }}>Model / SKU</th>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Brand</th>
                  <th style={{ padding: '10px' }}>Price</th>
                  <th style={{ padding: '10px' }}>MRP</th>
                  <th style={{ padding: '10px' }}>Discount</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px', fontFamily: 'monospace', fontWeight: '600' }}>
                      {p.model}
                    </td>
                    <td style={{ padding: '10px', maxWidth: '300px' }}>
                      <strong>{p.name}</strong>
                    </td>
                    <td style={{ padding: '10px' }}>{p.brand}</td>
                    <td style={{ padding: '10px', fontWeight: '700' }}>
                      ₹{p.selling_price.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px', color: 'var(--color-text-subtle)' }}>
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px' }}>{p.discount_percent}%</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{ color: '#dc2626' }}
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
