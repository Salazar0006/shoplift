import React, { useState, useRef } from 'react';

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ImageUpload = ({ value, onChange, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [internalError, setInternalError] = useState('');
  const inputRef = useRef(null);

  const processFile = (file) => {
    setInternalError('');

    if (!file) return;

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setInternalError('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
      return;
    }

    // Check file size (1MB max)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setInternalError(`File size (${sizeInMB} MB) exceeds maximum allowed size of 1.0 MB.`);
      return;
    }

    // Convert file to Base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      onChange(base64String);
    };
    reader.onerror = () => {
      setInternalError('Failed to read image file. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    setInternalError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayError = internalError || error;

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Product Image <span className="text-red-500">*</span>
      </label>

      {value ? (
        // Preview State
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 aspect-video sm:aspect-[16/9] flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => inputRef.current && inputRef.current.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg shadow transition-colors"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // Upload Dropzone
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-white'
          } ${displayError ? 'border-red-400 bg-red-50/20' : ''}`}
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-800">
            <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">
            JPG, PNG, or WebP (Max 1MB)
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {displayError && (
        <p className="mt-2 text-xs font-medium text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;

