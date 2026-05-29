import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import StatCard from "../Components/StatCard";
import {
  createCategory,
  createVendor,
  deleteCategory,
  deleteUser,
  getCategories,
  getCategoryProducts,
  getProducts,
  getUsers,
  updateCategory,
} from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [categoryStats, setCategoryStats] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
  });
  const [categoryName, setCategoryName] = useState("");
  const [vendorForm, setVendorForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingVendor, setSavingVendor] = useState(false);
  const [error, setError] = useState("");

  const vendors = useMemo(
    () => users.filter((user) => user.role === "VENDOR"),
    [users],
  );
  const customers = useMemo(
    () => users.filter((user) => user.role === "USER"),
    [users],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        usersResponse,
        productsResponse,
        activeProductsResponse,
        outOfStockProductsResponse,
        categoriesResponse,
      ] = await Promise.all([
        getUsers(),
        getProducts({ page: 1, limit: 100, sort: "latest" }),
        getProducts({ page: 1, limit: 1, status: "ACTIVE" }),
        getProducts({ page: 1, limit: 1, status: "OUT_OF_STOCK" }),
        getCategories(),
      ]);

      const categoryProductResponses = await Promise.all(
        categoriesResponse.data.map((category) =>
          getCategoryProducts(category.id),
        ),
      );

      setUsers(usersResponse.data);
      setProducts(productsResponse.data.products);
      setCategories(categoriesResponse.data);
      setStats({
        totalProducts: productsResponse.data.totalProducts,
        activeProducts: activeProductsResponse.data.totalProducts,
        outOfStockProducts: outOfStockProductsResponse.data.totalProducts,
      });
      // setCategoryStats(
      //   categoryProductResponses.map((response) => ({
      //     id: response.data.id,
      //     name: response.data.name,
      //     totalProducts: response.data.products.length
      //   }))
      // );
    } catch (apiError) {
      setError(
        apiError.response?.data?.error || "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const resetCategoryForm = () => {
    setCategoryName("");
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading admin dashboard..." />
      </div>
    );
  }

  const totalProducts = stats.totalProducts || 0;
  const activePct = totalProducts
    ? (stats.activeProducts / totalProducts) * 100
    : 0;
  const outOfStockPct = totalProducts
    ? (stats.outOfStockProducts / totalProducts) * 100
    : 0;

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Admin Dashboard</h2>
            <p className="text-muted mb-0">
              Monitor products, vendors and catalog health.
            </p>
          </div>
        </div>

        <ErrorAlert message={error} />

        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-3 mb-4">
          <div className="col">
            <StatCard label="Users" value={customers.length} tone="primary" />
          </div>
          <div className="col">
            <StatCard label="Vendors" value={vendors.length} tone="success" />
          </div>
          <div className="col">
            <StatCard
              label="Products"
              value={stats.totalProducts}
              tone="dark"
            />
          </div>
          <div className="col">
            <StatCard label="Active" value={stats.activeProducts} tone="info" />
          </div>
          <div className="col">
            <StatCard
              label="Out Of Stock"
              value={stats.outOfStockProducts}
              tone="warning"
            />
          </div>
          <div className="col">
            <StatCard
              label="Categories"
              value={categories.length}
              tone="secondary"
            />
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Product Status */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 admin-dashboard-card">
              <div className="card-body">
                <h5 className="mb-4">Product Status</h5>

                <div className="admin-kpi-block mb-3">
                  <div className="admin-kpi-row">
                    <span>Active Products</span>
                    <strong className="admin-kpi-number">
                      {stats.activeProducts}
                    </strong>
                  </div>
                  <div className="progress mt-2" style={{ height: "10px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${activePct}%` }}
                      aria-label="Active products percentage"
                    />
                  </div>
                </div>

                <div className="admin-kpi-block">
                  <div className="admin-kpi-row">
                    <span>Out Of Stock</span>
                    <strong className="admin-kpi-number">
                      {stats.outOfStockProducts}
                    </strong>
                  </div>
                  <div className="progress mt-2" style={{ height: "10px" }}>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: `${outOfStockPct}%` }}
                      aria-label="Out of stock percentage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Selling Product */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 admin-dashboard-card">
              <div className="card-body">
                <h5 className="mb-4">Most Selling Products</h5>

                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="admin-kpi-row mb-3">
                    <span className="admin-kpi-label">{product.name}</span>
                    <strong className="admin-kpi-number">
                      {product.stock} Sold
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Vendor */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 admin-dashboard-card">
              <div className="card-body">
                <h5 className="mb-4">Highest Selling Vendor</h5>

                {vendors.slice(0, 5).map((vendor) => (
                  <div key={vendor.id} className="admin-kpi-row mb-3">
                    <span className="admin-kpi-label">{vendor.name}</span>
                    <strong className="admin-kpi-number">
                      {vendor.products?.length || 0} Products
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
