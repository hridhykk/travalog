import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { image } from '@nextui-org/react';


export const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "HOME", href: "/user" },
    { label: "TRIPS", href: "/user/trips" },
    { label: "ACCOUNT", href: "/user/profile" },
    { label: "ABOUT US", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/user");
    setIsMenuOpen(false);
  };

  const getLinkClass = (path: string): string => {
    const isActive = location.pathname === path;
    const baseColor = showHeader ? "text-black" : "text-white";
    const activeBorder = showHeader ? "border-black" : "border-white";
    const hoverBorder = showHeader ? "hover:border-black" : "hover:border-white";

    return `${baseColor} no-underline ${
      isActive
        ? `border-b-2 ${activeBorder} pb-1`
        : `hover:border-b-2 ${hoverBorder} hover:pb-1 transition-all duration-100`
    }`;
  };

  const logoutBtnClass = showHeader
    ? "text-black/90 hover:text-black border-black/30 hover:border-black/50"
    : "text-white/90 hover:text-white border-white/30 hover:border-white/50";

  return (
    <header
      className={`fixed w-full z-[1100] transition-all duration-z  ${
        showHeader ? "bg-white text-black shadow-md" : "bg-transparent text-white"
      }`}
    >
      <nav className=" px-6 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="w-24 sm:w-36"
              src={showHeader ? "/logoblack.png" : "/logo.png"}
              alt="Logo"
            />
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

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              className="transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 top-full w-full bg-black/70 backdrop-blur-md shadow-lg">
            <div className="flex flex-col py-6 px-8 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-white text-lg font-medium no-underline hover:text-blue-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className={`mt-3 text-sm font-medium text-white transition-all duration-300 px-6 py-2 rounded-full border ${logoutBtnClass}`}
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
