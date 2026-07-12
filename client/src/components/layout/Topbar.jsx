import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Topbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'Drivers', href: '/drivers' },
    { name: 'Trips', href: '/trips' },
    { name: 'Maintenance', href: '/maintenance' },
    { name: 'Fuel & Expenses', href: '/fuel' },
    { name: 'Reports', href: '/reports' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-surface/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black font-bold text-sm shadow-[0_0_20px_-4px_var(--color-accent)]">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            TransitOps
          </span>
        </div>

        {/* Nav Links — desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-raised/60 border border-border-subtle rounded-full px-1.5 py-1 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-accent text-black shadow-[0_0_16px_-4px_var(--color-accent)]'
                    : 'text-gray-400 hover:text-white hover:bg-surface-panel'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-surface-raised border border-border-subtle text-accent">
            {user?.role || 'Guest'}
          </span>

          {/* User menu — desktop */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-surface-panel transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-border-subtle flex items-center justify-center text-sm font-medium text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-surface-raised/90 backdrop-blur-xl border border-border-subtle rounded-xl shadow-2xl py-1.5 overflow-hidden">
                <div className="px-3.5 py-2 border-b border-border-subtle">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Guest'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3.5 py-2 text-sm text-red-400 hover:bg-surface-panel transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile/tablet */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-panel transition-colors"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`h-[1.5px] bg-white rounded-full transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`h-[1.5px] bg-white rounded-full transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`h-[1.5px] bg-white rounded-full transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 pb-4 pt-1 bg-surface/95 backdrop-blur-xl border-t border-border-subtle">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent text-black'
                    : 'text-gray-400 hover:text-white hover:bg-surface-panel'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-border-subtle flex items-center justify-center text-sm font-medium text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-accent">{user?.role || 'Guest'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-sm text-red-400 font-medium px-3 py-1.5 rounded-lg hover:bg-surface-panel"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Topbar;