import React from 'react';

function ProductCard({ product, onEdit, onDelete, showActions = false }) {
  const price = Number(product.price || 0);

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image */}
      <div
        onClick={() => showActions && onEdit && onEdit(product)}
        className={`relative aspect-4/3 w-full overflow-hidden bg-slate-50 ${
          showActions ? 'cursor-pointer' : ''
        }`}
        title={showActions ? 'Click to edit product' : product.name}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-white/95 text-slate-900 shadow-md backdrop-blur border border-slate-100">
            ₱{price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => showActions && onEdit && onEdit(product)}
            className={`text-sm font-bold text-slate-900 transition-colors line-clamp-1 ${
              showActions
                ? 'group-hover:text-amber-600 cursor-pointer'
                : 'group-hover:text-slate-900'
            }`}
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Buttons: Edit & Delete (Only shown when showActions is true, e.g. in Manage Products) */}
        {showActions && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(product);
              }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              title="Edit Product"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(product._id);
              }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              title="Delete Product"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
