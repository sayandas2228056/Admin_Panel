import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../assets/Logo.jpg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Hide navbar on auth pages
  const hide = location.pathname === '/login' || location.pathname === '/auth-otp';
  if (hide) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 10);
    setLastScrollY(currentScrollY);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setShowProfileMenu(false);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideProfile = profileMenuRef.current && profileMenuRef.current.contains(event.target);
      
      if (!isClickInsideProfile) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Clients', link: '/clients' },
  ];

  return (
    <nav
      className={`fixed w-full z-[1000] transition-all duration-500 ease-out border-b border-slate-200/60 bg-white/90 backdrop-blur ${
        showNavbar ? 'translate-y-0 shadow-lg' : '-translate-y-full shadow-none'
      } apple-navbar`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16 md:h-18">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2 min-w-[140px] md:min-w-[180px] group">
          <div className="zenitech-brand text-orange-700 font-extrabold tracking-wide group-hover:text-orange-800 transition-colors duration-300">
            Zenitech Admin
          </div>
        </NavLink>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex gap-1 items-center justify-center flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `apple-nav-link font-medium px-4 py-2.5 relative transition-all duration-300 rounded-xl hover:scale-105 ${
                  isActive
                    ? 'text-orange-600 bg-orange-50/80 shadow-sm scale-105'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50/80'
                }`
              }
            >
              {item.name}
              <span className="apple-underline" />
            </NavLink>
          ))}
        </div>

        {/* User Actions (Desktop) */}
        <div className="flex items-center gap-3 min-w-[40px] md:min-w-[200px] justify-end">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 pr-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-50 hover:from-orange-100 hover:to-orange-100 text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm hidden lg:block">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                <div className={`absolute top-full right-0 bg-white/95 shadow-2xl rounded-2xl py-3 min-w-[220px] mt-2 border border-slate-200/50 transition-all duration-300 ${
                  showProfileMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                }`}>
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{user.name || user.email.split('@')[0]}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-orange-50/80 hover:text-orange-600 transition-all duration-200"
                  >
                    <User size={16} />
                    View Profile
                  </button>
                  
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="hidden md:inline-block apple-contact-btn px-6 py-3 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign In
            </NavLink>
          )}
          
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden focus:outline-none p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden apple-mobile-menu bg-white/95 border-t border-slate-200/60 backdrop-blur-xl">
          <div className="px-4 py-4 max-h-[80vh] overflow-y-auto">
            {user && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name || user.email.split('@')[0]}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { handleProfileClick(); toggleMobileMenu(); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/80 hover:bg-white text-slate-700 rounded-xl font-medium text-sm transition-all duration-200"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => { handleLogout(); toggleMobileMenu(); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-sm transition-all duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.link}
                className={({ isActive }) =>
                  `block py-4 font-semibold border-b border-slate-100 last:border-b-0 transition-colors duration-200 ${
                    isActive ? 'text-orange-600' : 'text-slate-800 hover:text-orange-600'
                  }`
                }
                onClick={toggleMobileMenu}
              >
                {item.name}
              </NavLink>
            ))}
            
            {!user && (
              <div className="pt-4">
                <NavLink
                  to="/login"
                  className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:shadow-xl"
                  onClick={toggleMobileMenu}
                >
                  Sign In
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .apple-navbar {
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          border-bottom: 1px solid rgba(226,232,240,0.6);
        }
        
        .apple-nav-link {
          position: relative;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        
        .apple-underline {
          position: absolute;
          left: 50%;
          right: 50%;
          bottom: 6px;
          height: 2px;
          background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .apple-nav-link:hover .apple-underline {
          left: 12px;
          right: 12px;
        }
        
        .apple-contact-btn {
          letter-spacing: -0.01em;
          border: 1px solid rgba(249, 115, 22, 0.2);
        }
        
        .apple-mobile-menu {
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.12);
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .zenitech-brand {
          font-size: 1.4rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
          font-weight: 800;
        }
        
        @media (min-width: 768px) {
          .zenitech-brand {
            font-size: 1.7rem;
          }
        }
        
        @media (max-width: 640px) {
          .zenitech-brand {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;