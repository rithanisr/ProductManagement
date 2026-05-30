import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  if (user?.role === "VENDOR") {
    return <Navigate to="/vendor/dashboard" replace />;
  }
  if (user?.role === "USER") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Home;