import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StoreModal } from './components/StoreModal';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OffersPage } from './pages/OffersPage';
import { StoresPage } from './pages/StoresPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  return (
    <StoreProvider>
      <ToastProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar onOpenStoreModal={() => setStoreModalOpen(true)} />

            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/c/:slug" element={<CategoryPage />} />
                <Route path="/p/:slug" element={<ProductDetailPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/stores/:code" element={<StoreDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Store Switcher Modal */}
            <StoreModal
              isOpen={storeModalOpen}
              onClose={() => setStoreModalOpen(false)}
            />
          </div>
        </Router>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;
