import React from 'react';
import { Link } from "@nextui-org/react";

import { User, Building2, Upload, Calendar, Clock, Star, Settings } from 'lucide-react';

export const SidebarNav = () => {
  const [currentPath, setCurrentPath] = React.useState('/vendor/vendorProfile');

  const menuItems = [
    { label: 'Profile', icon: <User className="w-5 h-5" />, path: '/user/profile' },
    { label: 'Wallet', icon: <Building2 className="w-5 h-5" />, path: '/vendor/packagedetails' },
    { label: 'Booking Details', icon: <Upload className="w-5 h-5" />, path: '/user/bookings' },
    // { label: 'Bookings', icon: <Calendar className="w-5 h-5" />, path: '/bookings' },
    // { label: 'Slot Update', icon: <Clock className="w-5 h-5" />, path: '/vendor/slots' },
    { label: 'Reviews', icon: <Star className="w-5 h-5" />, path: '/reviews' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' }
  ];

  const handleNavigation = (path:any) => {
    setCurrentPath(path);
    // Add your navigation logic here
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-white text-gray" style={{ marginTop: '4cm' }}>
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = currentPath === item.path;
            
            return (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`
                    flex text-black gap-3 px-4 py-3 rounded-lg
                    transition-all duration-150 ease-in-out
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'hover:bg-gray-50 hover:text-blue-500'
                    }
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarNav;