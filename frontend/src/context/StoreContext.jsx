import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStores } from '../services/api';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      try {
        const data = await getStores();
        setStores(data);

        // Retrieve saved store preference or default to first (Nellore)
        const savedCode = localStorage.getItem('murali_store_code');
        if (savedCode) {
          const matched = data.find((s) => s.code === savedCode);
          if (matched) {
            setSelectedStore(matched);
            setLoading(false);
            return;
          }
        }
        if (data.length > 0) {
          setSelectedStore(data[0]);
        }
      } catch (err) {
        console.error('Failed to load stores:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, []);

  const changeStore = (store) => {
    setSelectedStore(store);
    localStorage.setItem('murali_store_code', store.code);
  };

  /**
   * Generates WhatsApp direct chat URL matching Murali Electronics standard
   */
  const getWhatsAppLink = (product = null, customText = null) => {
    const store = selectedStore || (stores.length > 0 ? stores[0] : null);
    const storeNumber = store ? store.whatsapp_number : '919000000000';
    const storeName = store ? store.name : 'Nellore';

    let text = `Hello Murali Electronics ${storeName},`;

    if (customText) {
      text += `\n${customText}`;
    } else if (product) {
      text += `\nI'm interested in ${product.name} (Model: ${product.model}, SKU: ${product.sku}).\nPlease share the price and availability.`;
      if (typeof window !== 'undefined') {
        text += `\n${window.location.origin}/p/${product.slug}`;
      }
    } else {
      text += `\nI would like to enquire about home appliances and current offers.`;
    }

    return `https://wa.me/${storeNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        changeStore,
        loading,
        getWhatsAppLink,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
