import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";

function ManagePage({
  products = [],
  loading = false,
  error = "",
  editingProduct = null,
  onSubmit,
  onSave,
  onEdit,
  onDelete,
  onCancelEdit,
  onCancel,
}) {
  const [productToDelete, setProductToDelete] = useState(null);

  const handleSubmit = onSubmit || onSave;
  const handleCancel = onCancelEdit || onCancel;

  const confirmDelete = async () => {
    if (productToDelete) {
      await onDelete(productToDelete._id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Product Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, edit, and organize inventory displayed across the showcase gallery.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <ProductForm
            key={editingProduct ? editingProduct._id : "new"}
            editingProduct={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>

        {/* Inventory Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Inventory</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Products: <span className="font-bold text-indigo-600">{products.length}</span>
              </p>
            </div>
            {editingProduct && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                + Create New Instead
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-2 text-xs font-semibold text-slate-500">Loading inventory items...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-red-50 p-6 text-center text-red-600 text-xs font-semibold">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-800">No products in inventory yet</p>
              <p className="text-xs text-slate-400 mt-1">Use the form to add your first product.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showActions={true}
                  onEdit={onEdit}
                  onDelete={(id) => setProductToDelete(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800">"{productToDelete.name}"</strong>? This action cannot be reversed.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePage;

