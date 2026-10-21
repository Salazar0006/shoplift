import React, { useRef } from 'react';

const MAX_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function ImageUpload({ image, onChange, onError }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      return onError('Please upload a valid JPG, PNG, or WebP product photo.');
    }

    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return onError(`Image size (${sizeMB} MB) exceeds maximum allowed size of 1.0 MB.`);
    }

    onError('');
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.onerror = () => onError('Failed to process image file.');
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    onError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Product Photo <span className="text-red-500">*</span>
        </label>
        <span className="text-[11px] text-slate-400">White background recommended (Max 1MB)</span>
      </div>

      {image ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 flex items-center justify-center p-2">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current && inputRef.current.click()}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 shadow hover:bg-slate-100 transition"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow hover:bg-red-700 transition"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current && inputRef.current.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30 p-5 flex flex-col items-center justify-center text-center transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-800">
            <span className="text-amber-600 hover:underline">Click to upload photo</span> or drag here
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            JPG, PNG, or WebP &bull; Max 1MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUpload;
