import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/vendor/vendorSlice';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'HOME', href: '/vendor/home' },
    { label: 'TRIPS', href: '/vendor/trips' },
    { label: 'ACCOUNT', href: '/vendor/vednorProfile' },
    { label: 'ABOUT US', href: '/about' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/vendor');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full backdrop-blur-sm bg-black/20 text-white z-50">
      <nav className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left aligned */}
          <div className="text-3xl font-serif text-white">
            AVL Travells
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/90 hover:text-white text-sm font-medium 
                         transition-colors duration-300 no-underline"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white/90 hover:text-white
                       transition-all duration-300 px-6 py-2 rounded-full 
                       border border-white/30 hover:border-white/50"
            >
              LOGOUT
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden">
            <button
              className="text-white/90 hover:text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <div className="flex flex-col gap-1">
                  <div className="w-6 h-0.5 bg-white"></div>
                  <div className="w-6 h-0.5 bg-white"></div>
                  <div className="w-6 h-0.5 bg-white"></div>
                </div>
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
     <div className="md:hidden absolute left-0 top-full w-full bg-black/20 backdrop-blur-lg">

            <div className="flex flex-col py-6 px-8">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                     className="text-white/90 hover:text-white text-lg font-medium py-3
                           transition-colors duration-300 no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="text-left text-white/90 hover:text-white text-lg font-medium py-3
                         transition-colors duration-300"
              >
                LOGOUT
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;