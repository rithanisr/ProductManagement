import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const SidebarIcon = ({ name }) => {
  const common = {
    className: "sidebar-nav-icon",
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M12 3l1.2 3.5L17 8l-3.8 1.5L12 13l-1.2-3.5L7 8l3.8-1.5L12 3z" />
          <path d="M19 12l.7 2 2 0.8-2 0.8-.7 2-.7-2-2-.8 2-.8.7-2z" />
        </svg>
      );
    case "templates":
      return (
        <svg {...common}>
          <path d="M4 4h7v7H4z" />
          <path d="M13 4h7v4h-7z" />
          <path d="M13 10h7v10h-7z" />
          <path d="M4 13h7v7H4z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common}>
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5 12l2-8h10l2 8" />
          <path d="M3 12v7h18v-7" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path d="M8 3v3" />
          <path d="M16 3v3" />
          <path d="M4 7h16" />
          <path d="M5 7v14h14V7" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 17V9" />
          <path d="M12 17V7" />
          <path d="M16 17v-5" />
        </svg>
      );
    case "help":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.3-1.4 1-1.4 1.7V14" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M3 12l9-9 9 9" />
          <path d="M9 21V9h6v12" />
        </svg>
      );
    case "products":
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M3.3 7.3 12 12l8.7-4.7" />
          <path d="M12 22V12" />
        </svg>
      );
    case "categories":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
          <path d="M6 6v12" />
        </svg>
      );
    case "vendors":
      return (
        <svg {...common}>
          <path d="M3 7h18" />
          <path d="M5 7l1 14h12l1-14" />
          <path d="M8 7a4 4 0 0 1 8 0" />
        </svg>
      );
    case "orders":
      return (
        <svg {...common}>
          <path d="M9 6h11" />
          <path d="M9 12h11" />
          <path d="M9 18h11" />
          <path d="M4 6h.01" />
          <path d="M4 12h.01" />
          <path d="M4 18h.01" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <path d="M6 6h15l-2 10H7L6 6z" />
          <path d="M16 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M8 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.8 4.6c-1.5-1.6-4-1.8-5.7-.5L12 6.1l-3.1-2c-1.7-1.3-4.2-1.1-5.7.5-1.8 1.9-1.8 5 0 6.8l8.8 8.9 8.8-8.9c1.8-1.8 1.8-4.9 0-6.8z" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          <path d="M19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3h-6l-.3 2.9a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 12a7.9 7.9 0 0 0-.1 1 7.9 7.9 0 0 0 .1 1l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 1.7 1L9 21h6l.3-2.9a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 12h16" />
        </svg>
      );
  }
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "Admin User"
  )}&background=0D8ABC&color=fff`;

  return (
    <aside className="sidebar d-none d-lg-flex flex-column">
      <div className="sidebar-inner">
        <div className="sidebar-brand-row">
          <div className="sidebar-brand">
            <div className="sidebar-brand-logo" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="M3.3 7.3 12 12l8.7-4.7" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div className="min-width-0">
              <div className="sidebar-brand-title">ProductHub</div>
              <p className="sidebar-brand-subtitle">
                {user?.role === "VENDOR"
                  ? "Vendor workspace"
                  : user?.role === "ADMIN"
                  ? "Admin workspace"
                  : "User marketplace"}
              </p>
            </div>
          </div>

          <button className="sidebar-top-action" type="button" aria-label="Profile">
            <span style={{ fontWeight: 700 }}>{user?.name?.slice(0, 1) || "A"}</span>
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav className="nav flex-column gap-1">
          {/* Your existing navigation links remain unchanged */}
          {user?.role !== "USER" && (
            <NavLink
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                  isActive ? "bg-primary text-white" : "text-white"
                }`
              }
              to={user?.role === "VENDOR" ? "/vendor/dashboard" : "/admin"}
            >
              <SidebarIcon name="dashboard" />
              Dashboard
            </NavLink>
          )}

          {user?.role === "VENDOR" && (
            <>
              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/vendor/products"
              >
                <SidebarIcon name="products" />
                Products
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/vendor/stock"
              >
                <SidebarIcon name="orders" />
                Stock Items
              </NavLink>
            </>
          )}

          {user?.role === "USER" && (
            <>
              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/user/dashboard"
              >
                <SidebarIcon name="dashboard" />
                Home
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/user/cart"
              >
                <SidebarIcon name="cart" />
                Cart
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/user/wishlist"
              >
                <SidebarIcon name="heart" />
                Wishlist
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/user/orders"
              >
                <SidebarIcon name="orders" />
                My Orders
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/user/profile"
              >
                <SidebarIcon name="user" />
                Profile
              </NavLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/vendors"
              >
                <SidebarIcon name="vendors" />
                <span>Vendors</span>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 ${
                    isActive ? "bg-primary text-white" : "text-white"
                  }`
                }
                to="/categories"
              >
                <SidebarIcon name="categories" />
                <span>Category</span>
              </NavLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NavLink className="nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 text-white">
                <SidebarIcon name="help" />
                <span>Help &amp; Center</span>
              </NavLink>

              <NavLink className="nav-link d-flex align-items-center gap-3 px-2 py-2 rounded-2 text-white">
                <SidebarIcon name="settings" />
                <span>Settings</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto sidebar-profile-footer">
          <div className="sidebar-user-box">
            <img src={avatarSrc} alt={user?.name || "Admin User"} className="sidebar-user-avatar" />
            <div className="sidebar-user-meta">
              <strong>{user?.name || "Admin User"}</strong>
              <small>{user?.email || "admin@producthub.com"}</small>
            </div>
            <button 
              className="sidebar-logout-icon" 
              type="button" 
              onClick={handleLogoutClick} 
              aria-label="Logout"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal with Inline Styles */}
      {showLogoutModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "28px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "360px",
            textAlign: "center",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
          }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#333", fontSize: "1.4rem" }}>
              Confirm Logout
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#666", fontSize: "1rem" }}>
              Are you sure you want to logout?
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={cancelLogout}
                style={{
                  padding: "10px 24px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: "10px 24px",
                  border: "none",
                  backgroundColor: "#dc3545",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;