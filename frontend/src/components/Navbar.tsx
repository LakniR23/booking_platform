import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CalendarRange, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass =
    'text-white hover:text-white/90 font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-lg bg-[var(--color-navbar-bg)]"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2" onClick={closeMenu}>
          <div className="relative">
            <CalendarRange className="text-white drop-shadow-lg" size={28} />
          </div>
          <span className="text-white drop-shadow-lg">
            Quick<span className="text-[var(--color-navbar-accent)]">Reserve</span>
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-4 md:flex">
          {token ? (
            <>
              <Link to="/services" className={navLinkClass}>
                Services
              </Link>
              <Link to="/bookings" className={navLinkClass}>
                Bookings
              </Link>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <User size={16} className="text-white" />
                <span className="text-sm font-medium text-white">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-white/70 hover:text-white backdrop-blur-sm"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/80 hover:text-white font-medium transition-all duration-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white/90 backdrop-blur-sm text-[var(--color-brand-navy)] hover:bg-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg shadow-[var(--color-brand-navy)]/30 hover:shadow-[var(--color-brand-navy)]/50 hover:scale-105 active:scale-95 border border-white/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[var(--color-navbar-bg)] px-4 pb-4 pt-2 md:hidden">
          {token ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-white/90">
                <User size={16} />
                <span className="truncate">{user?.name || user?.email}</span>
              </div>
              <Link to="/services" onClick={closeMenu} className="rounded-lg px-2 py-2.5 text-white/90 hover:bg-white/10">
                Services
              </Link>
              <Link to="/bookings" onClick={closeMenu} className="rounded-lg px-2 py-2.5 text-white/90 hover:bg-white/10">
                Bookings
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="mt-1 flex items-center gap-2 rounded-lg px-2 py-2.5 text-left text-rose-100 hover:bg-white/10"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-lg px-2 py-2.5 text-center text-white/90 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-lg bg-white/90 px-2 py-2.5 text-center font-medium text-[var(--color-brand-navy)] hover:bg-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
