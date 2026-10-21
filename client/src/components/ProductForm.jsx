import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const emptyForm = { name: "", price: "", description: "", image: "" };

function ProductForm({ editingProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        price: editingProduct.price !== undefined ? editingProduct.price : "",
        description: editingProduct.description || "",
        image: editingProduct.image || "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, description, image } = form;

    if (!name.trim()) {
      return setError("Product title is required.");
    }

    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      return setError("Please provide a valid selling price in PHP.");
    }

    if (!description.trim()) {
      return setError("Product bullet points / description are required.");
    }

    if (!image) {
      return setError("Please upload a high-resolution product image.");
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image,
      });
      if (!editingProduct) {
        setForm(emptyForm);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm sticky top-24 space-y-4"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            {editingProduct ? "Edit Product Listing" : "Add New Listing"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {editingProduct ? "Update item attributes and pricing." : "Publish an item to shoplifting."}
          </p>
        </div>
        {editingProduct && (
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            Editing
          </span>
        )}
      </div>

      {/* Image Upload Dropzone */}
      <ImageUpload
        image={form.image}
        onChange={(image) => setForm((prev) => ({ ...prev, image }))}
        onError={setError}
      />

      {/* Product Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 bg-slate-50/50 focus:bg-white transition-all font-medium"
        />
      </div>

      {/* Price Field */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Price (PHP) <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
            ₱
          </div>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={handleChange}
            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 bg-slate-50/50 focus:bg-white transition-all font-semibold"
          />
        </div>
      </div>

      {/* Description / Features */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          About this item <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Highlight key specs, features, compatibility, and box contents..."
          value={form.description}
          onChange={handleChange}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 bg-slate-50/50 focus:bg-white transition-all resize-none font-normal"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center space-x-2">
          <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-2.5 px-4 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 px-4 rounded-full text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-slate-900" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <span>{editingProduct ? "Update Listing" : "List Item on shoplifting"}</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
