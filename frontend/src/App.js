import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import AdminDashboard from "./Pages/AdminDashboard";
import AddEditVendor from "./Pages/AddEditVendor";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ManageCategories from "./Pages/ManageCategories";
import ProductDetails from "./Pages/ProductDetails";
import Register from "./Pages/Register";
import UserHome from "./Pages/user/Home";
import Cart from "./Pages/user/Cart";
import Wishlist from "./Pages/user/Wishlist";
import Orders from "./Pages/user/Orders";
import Profile from "./Pages/user/Profile";
import VendorDashboard from "./Pages/VendorDashboard";
import VendorProducts from "./Pages/VendorProducts";
import VendorStock from "./Pages/VendorStock";
import Vendors from "./Pages/Vendors";

const AuthLayout = () => (
  <div className="app-shell bg-soft-beige min-vh-100">
    <Sidebar />
    <div className="app-content">
      <Navbar />
      <main className="content-wrapper py-4 px-3 px-lg-4">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/vendors/add" element={<AddEditVendor />} />
                <Route path="/vendors/edit/:id" element={<AddEditVendor />} />
                <Route path="/categories" element={<ManageCategories />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["VENDOR"]} />}>
                <Route
                  path="/vendor"
                  element={<Navigate to="/vendor/dashboard" replace />}
                />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/products" element={<VendorProducts />} />
                <Route path="/vendor/stock" element={<VendorStock />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
                <Route
                  path="/user"
                  element={<Navigate to="/user/dashboard" replace />}
                />
                <Route path="/user/dashboard" element={<UserHome />} />
                <Route path="/user/cart" element={<Cart />} />
                <Route path="/user/wishlist" element={<Wishlist />} />
                <Route path="/user/orders" element={<Orders />} />
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/products/:id" element={<ProductDetails />} />
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
