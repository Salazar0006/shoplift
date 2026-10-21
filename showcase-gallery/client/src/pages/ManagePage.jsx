import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';

const ManagePage = ({
  products,
  loading,
  error,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  isSubmitting,
}) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleFormSubmit = async (formData) => {
    if (editingProduct) {
      const success = await onUpdateProduct(editingProduct._id, formData);
      if (success) {
        setEditingProduct(null);
      }
    } else {
      const success = await onCreateProduct(formData);
      if (success) {
        // Clear form handled in component or by remount
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    // Smooth scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await onDeleteProduct(productToDelete._id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Product Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, modify, and delete inventory items in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Form Panel (Add / Edit) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingProduct
                  ? 'Update the fields below to modify this product.'
                  : 'Fill in the information to publish a new product card.'}
              </p>
            </div>
            {editingProduct && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                Editing Mode
              </span>
            )}
          </div>

          <ProductForm
            key={editingProduct ? editingProduct._id : 'new'}
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right: Products Inventory List Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Inventory Items</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Products: <span className="font-semibold text-indigo-600">{products.length}</span>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <svg className="animate-spin h-6 w-6 text-indigo-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Loading inventory...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 text-sm">{error}</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No products in inventory yet</p>
              <p className="text-xs text-slate-400 mt-1">Use the form to create your first product.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
              {products.map((item) => {
                const isCurrentEditing = editingProduct && editingProduct._id === item._id;
                return (
                  <div
                    key={item._id}
                    className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/80 ${
                      isCurrentEditing ? 'bg-indigo-50/40 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    {/* Thumbnail & Info */}
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-1"
                        title="Edit Product"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-1"
                        title="Delete Product"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-700">"{productToDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="w-1/2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-1/2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePage;

