
import React from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Image,
  Building2,
  Home,
  Crown,
  Info,
  HelpCircle,
  Waves,
  Mail,
  ShoppingCart,
  FileCheck,
  Wallet,
  LogOut,
} from "lucide-react";

import "./AdminLayout.css";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Hero", path: "/admin/hero", icon: Image },
  { label: "Properties", path: "/admin/properties", icon: Building2 },
  { label: "Spacious Living", path: "/admin/spacious-living", icon: Home },
  { label: "Luxury Properties", path: "/admin/luxury-properties", icon: Crown },
  { label: "Penthouse", path: "/admin/penthouse", icon: Home },
  { label: "Ideal Space", path: "/admin/ideal-space", icon: Building2 },
  { label: "Homes Speaking", path: "/admin/homes-speaking", icon: Home },
  { label: "About", path: "/admin/about", icon: Info },
  { label: "FAQ", path: "/admin/faq", icon: HelpCircle },
  { label: "Beachfront", path: "/admin/beachfront", icon: Waves },
  { label: "Contact", path: "/admin/contact", icon: Mail },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Sub-Admin KYC", path: "/admin/sub-admin/kyc", icon: FileCheck },
  { label: "Revenue", path: "/admin/revenue", icon: Wallet },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dashboard already has its own sidebar and header.
  const isDashboard =
    location.pathname === "/admin" ||
    location.pathname === "/admin/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/account/login", { replace: true });
  };

  return (
    <div
      className={`admin-layout ${
        isDashboard ? "admin-layout-dashboard" : ""
      }`}
    >
      {!isDashboard && (
        <aside className="admin-layout-sidebar">
          <div className="admin-layout-brand">
            <div className="admin-layout-logo">SL</div>

            <div className="admin-layout-brand-text">
              <strong>Spacious Living</strong>
              <span>Admin Panel</span>
            </div>
          </div>

          <div className="admin-layout-menu-title">MAIN MENU</div>

          <nav className="admin-layout-menu">
            {menuItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/admin"}
                className={({ isActive }) =>
                  `admin-layout-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="admin-layout-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </aside>
      )}

      <main className="admin-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
