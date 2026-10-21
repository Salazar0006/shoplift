import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import GalleryPage from "./pages/GalleryPage";
import ManagePage from "./pages/ManagePage";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api";

function App() {
  const [view, setView] = useState("gallery");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("failed to fetch")) {
        setError(
          "Backend server is offline. Please start it by running 'npm run dev' inside the 'server' folder."
        );
      } else {
        setError(err.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle Edit initiation from anywhere (Card, Gallery, or Manage)
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setView("manage");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Create or Update
  const handleCreateOrUpdate = async (productData) => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct._id, productData);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? updated : p))
        );
        setEditingProduct(null);
        showToast("Product updated successfully!");
        setView("gallery"); // return to gallery after updating
      } else {
        const created = await createProduct(productData);
        setProducts((prev) => [created, ...prev]);
        showToast("Product added successfully!");
        setView("gallery"); // return to gallery after adding
      }
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
      throw err;
    }
  };

  // Trigger Delete confirmation
  const promptDelete = (id) => {
    const item = products.find((p) => p._id === id);
    if (item) {
      setProductToDelete(item);
    }
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      if (editingProduct && editingProduct._id === productToDelete._id) {
        setEditingProduct(null);
      }
      showToast("Product deleted successfully!");
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] font-sans text-slate-900 antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white ${
              toast.type === "error"
                ? "bg-red-600 shadow-red-600/20"
                : "bg-emerald-600 shadow-emerald-600/20"
            }`}
          >
            {toast.type === "error" ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-white/80 hover:text-white ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Global Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800">"{productToDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Navbar */}
      <Navbar
        view={view}
        onChangeView={setView}
        totalCount={products.length}
      />

      {/* Main Views */}
      <main className="flex-1">
        {view === "gallery" ? (
          <GalleryPage
            products={products}
            loading={loading}
            error={error}
            onRetry={loadProducts}
            onNavigateToManage={() => {
              setEditingProduct(null);
              setView("manage");
            }}
          />
        ) : (
          <ManagePage
            products={products}
            loading={loading}
            error={error}
            editingProduct={editingProduct}
            onSubmit={handleCreateOrUpdate}
            onEdit={handleEditClick}
            onDelete={promptDelete}
            onCancelEdit={() => {
              setEditingProduct(null);
              setView("gallery");
            }}
          />
        )}
      </main>

      {/* Simple, Clean E-Commerce Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="text-base font-black text-slate-900">
            shop<span className="text-amber-500">lifting</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} shoplifting. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
