import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

const ProductForm = ({ initialData = null, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price !== undefined ? initialData.price.toString() : '',
        description: initialData.description || '',
        image: initialData.image || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required.';
    }

    if (!formData.price.toString().trim()) {
      newErrors.price = 'Product price is required.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required.';
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required. Please upload an image.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (base64) => {
    setFormData((prev) => ({ ...prev, image: base64 }));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      image: formData.image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Image */}
      <div>
        <ImageUpload
          value={formData.image}
          onChange={handleImageChange}
          error={errors.image}
        />
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
            errors.name
              ? 'border-red-400 bg-red-50/20 focus:border-red-500'
              : 'border-slate-300 focus:border-indigo-600 bg-white'
          }`}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>
        )}
      </div>

      {/* Product Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Price (USD) <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
            $
          </div>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="99.99"
            className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.price
                ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                : 'border-slate-300 focus:border-indigo-600 bg-white'
            }`}
          />
        </div>
        {errors.price && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.price}</p>
        )}
      </div>

      {/* Product Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a detailed overview of the product features, specifications, and advantages..."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${
            errors.description
              ? 'border-red-400 bg-red-50/20 focus:border-red-500'
              : 'border-slate-300 focus:border-indigo-600 bg-white'
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.description}</p>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="pt-2 flex items-center justify-end space-x-3">
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{initialData ? 'Update Product' : 'Add Product'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

