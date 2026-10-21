import React, { useState } from 'react';

function Navbar({ view, onChangeView, totalCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md bg-[#131921] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => onChangeView('gallery')}
            className="flex items-center cursor-pointer select-none py-1 px-2 rounded-md hover:outline hover:outline-1 hover:outline-white transition-all group"
          >
            <div className="relative flex items-center">
              <span className="text-2xl font-black tracking-tight text-white">
                shop<span className="text-amber-400">lifting</span>
              </span>
              {/* Smile underline */}
              <svg className="absolute -bottom-1 left-0.5 w-24 h-2 text-amber-400" viewBox="0 0 100 15" fill="none">
                <path d="M 5 3 Q 50 15 95 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 91 1 L 96 4 L 92 8" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Center Navigation Buttons */}
          <nav className="hidden sm:flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onChangeView('gallery')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                view === 'gallery'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Gallery</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                view === 'gallery' ? 'bg-slate-950 text-amber-400' : 'bg-white/20 text-white'
              }`}>
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeView('manage')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                view === 'manage'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Manage Products</span>
            </button>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#1f2833] text-white p-3 space-y-2 border-t border-slate-700">
          <button
            type="button"
            onClick={() => {
              onChangeView('gallery');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold ${
              view === 'gallery' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-white'
            }`}
          >
            <span>Product Gallery</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px]">
              {totalCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeView('manage');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold ${
              view === 'manage' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-white'
            }`}
          >
            <span>Manage Products</span>
            <span>+</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
