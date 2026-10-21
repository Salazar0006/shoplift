import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import GalleryPage from './pages/GalleryPage';
import ManagePage from './pages/ManagePage';
import { getProducts, createProduct, updateProduct, deleteProduct } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'manage'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = async (productData) => {
    setSubmitting(true);
    try {
      const res = await createProduct(productData);
      if (res.success) {
        showToast('Product added successfully!');
        setProducts((prev) => [res.data, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    setSubmitting(true);
    try {
      const res = await updateProduct(id, productData);
      if (res.success) {
        showToast('Product updated successfully!');
        setProducts((prev) =>
          prev.map((item) => (item._id === id ? res.data : item))
        );
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        showToast('Product deleted successfully!');
        setProducts((prev) => prev.filter((item) => item._id !== id));
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-white/80 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={products.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'gallery' ? (
          <GalleryPage
            products={products}
            loading={loading}
            error={error}
            onRetry={fetchProducts}
            onNavigateToManage={() => setActiveTab('manage')}
          />
        ) : (
          <ManagePage
            products={products}
            loading={loading}
            error={error}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            isSubmitting={submitting}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          <p>
            ShowCase Product Gallery &copy; {new Date().getFullYear()} &bull; Built with MongoDB Atlas, Express, React (Vite), and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

