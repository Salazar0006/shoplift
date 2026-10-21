import React from "react";
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
  const handleSubmit = onSubmit || onSave;
  const handleCancel = onCancelEdit || onCancel;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            {editingProduct
              ? "Update product details below, or click Cancel to return to adding new products."
              : "Fill in the details to publish a new product."}
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold mr-1.5">Total Products:</span>
            <span className="text-sm font-black text-slate-900">{products.length}</span>
          </div>
        </div>
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
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Products List ({products.length})</h2>
            {editingProduct && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                + Add New Product Instead
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/90">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
              <p className="mt-2 text-xs font-bold text-slate-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600 text-xs font-semibold">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-900">No products in inventory yet</p>
              <p className="text-xs text-slate-400 mt-1">Use the form to list your first item.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagePage;
