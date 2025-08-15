import React, { useState } from "react";
import { Link } from "@nextui-org/react";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User, Building2, Upload, Star, Settings } from "lucide-react";

export const SidebarNav = () => {
  const [currentPath, setCurrentPath] = useState("/vendor/vendorProfile");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:1920px)");
  const menuItems = [
    { label: "Profile", icon: <User className="w-5 h-5" />, path: "/user/profile" },
    { label: "Wallet", icon: <Building2 className="w-5 h-5" />, path: "/vendor/packagedetails" },
    { label: "Booking Details", icon: <Upload className="w-5 h-5" />, path: "/user/bookings" },
    { label: "Reviews", icon: <Star className="w-5 h-5" />, path: "/reviews" },

  ];

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    window.location.href = path;
  };

  const sidebarContent = (
    <div
      className="min-h-screen bg-slate-100 text-gray pt-28"
      style={{ width: 240 }}
    >
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
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-gray-50 hover:text-blue-500"
                    }
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                    setMobileOpen(false); // close drawer after click
                  }}
                >
                  <span className={isActive ? "text-blue-600" : "text-gray-500"}>
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

  return (
    <>
      {/* Show fixed sidebar for large screens */}
      {isLargeScreen && (
        <div
          style={{
            width: 240,
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "white",
            borderRight: "1px solid #e5e7eb",
          }}
        >
          {sidebarContent}
        </div>
      )}

      {/* Show menu button for smaller screens */}
      {!isLargeScreen && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 130,
            left: 16,
            zIndex: 1200,
            backgroundColor: "#1e293b",
            color: "white",
            "&:hover": { backgroundColor: "#334155" }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer for mobile screens */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "#fff",
            color: "#000"
          }
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default SidebarNav;
