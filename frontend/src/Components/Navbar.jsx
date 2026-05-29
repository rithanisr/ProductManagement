import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const getAvatar = () =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin User")}&background=0D8ABC&color=fff`;

  return (
    <header className="topbar bg-white border-bottom position-sticky top-0 z-3">
      <div className="topbar-inner d-flex align-items-center justify-content-between gap-3 px-4 py-3">
       

        <div className="d-flex align-items-center gap-3 ms-auto">
          
        
          {isAuthenticated && (
            <button
              className="topbar-profile"
              type="button"
              onClick={() =>
                navigate(
                  user?.role === "ADMIN"
                    ? "/admin"
                    : user?.role === "VENDOR"
                    ? "/vendor/dashboard"
                    : "/user/dashboard"
                )
              }>

              <img src={getAvatar()} alt={user?.name || "User"} />
              <span>{user?.name || "Admin"}</span>
            </button>
          )}
          {!isAuthenticated && (
            <button className="btn btn-dark btn-sm" type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;