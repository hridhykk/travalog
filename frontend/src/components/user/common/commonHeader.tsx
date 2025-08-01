import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { image } from '@nextui-org/react';


export const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {

      setShowHeader(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const menuItems = [
    { label: 'HOME', href: '/user' },
    { label: 'TRIPS', href: '/user/trips' },
    { label: 'ACCOUNT', href: '/user/profile' },
    { label: 'ABOUT US', href: '/about' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/user');
    setIsMenuOpen(false);
  };
  const location = useLocation();

  const getLinkClass = (path: string): string => {
    const isActive = location.pathname === path;
    const txt = showHeader ? "text-black" : "text-white";
    const activeBorder = showHeader ? "border-black" : "border-white";
    const hoverBorder = showHeader ? "hover:border-balck" : "hover:border-white";
    return `${txt} no-underline ${isActive
      ? `border-b-2 ${activeBorder} pb-1`
      : `hover:border-b-2 ${hoverBorder} hover:pb-1 transition-all duration-100`
      }`;
  };

  const logoutBtnClass = showHeader
    ? "text-black/90 hover:text-black border-black/30 hover:border-black/50"
    : "text-white/90 hover:text-white border-white/30 hover:border-white/50";


  return (
    <header
      className={`fixed w-full  z-50 transition-colors duration-300 ${showHeader ? 'bg-white text-black' : 'bg-transparent'
        }`}
    >
      <nav className="container mx-auto px-8 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              {showHeader ? <img className= 'w-24 sm:w-36' src="/logoblack.png" alt="Logoblack" /> : <img className='w-24 sm:w-36' src="/logo.png" />}

            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={getLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className={`text-sm font-medium transition-all duration-300 px-6 py-2 rounded-full border ${logoutBtnClass}`}
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
                className={`text-sm font-medium transition-all duration-300 px-6 py-2 rounded-full border ${logoutBtnClass}`}
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
