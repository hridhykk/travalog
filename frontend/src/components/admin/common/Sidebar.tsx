import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Layout, 
  Users, 
  Store, 
  FileText, 
  Calendar 
} from 'lucide-react';
import { logout } from '../../../features/admin/adminSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin/home', icon: <Layout size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Vendors', path: '/admin/vendors', icon: <Store size={18} /> },
    { name: 'Package Management', path: '/admin/packages', icon: <FileText size={18} /> },
    { name: 'Booking', path: '/admin/orderDetails', icon: <Calendar size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-gray-100 h-screen w-64 p-4 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold mb-8 bg-gray-200 p-3 rounded text-gray-700">
        ADMIN
      </h1>
      
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block p-3 rounded transition-colors duration-150 no-underline ${
                  location.pathname === item.path
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded w-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-150"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;