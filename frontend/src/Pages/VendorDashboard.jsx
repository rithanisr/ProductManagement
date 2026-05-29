import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import StatCard from "../Components/StatCard";
import { getVendorAnalytics } from "../services/api";

const chartColors = ["#1d4ed8", "#0ea5e9", "#14b8a6", "#f59e0b"];

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getVendorAnalytics({ page: 1, limit: 100, sort: "latest" });
      setProducts(response.data.products);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const activeProducts = products.filter((product) => product.status === "ACTIVE").length;
  const outOfStockProducts = products.filter((product) => product.status === "OUT_OF_STOCK").length;

  const statusChartData = useMemo(
    () => [
      { name: "Active", value: activeProducts },
      { name: "Out of Stock", value: outOfStockProducts }
    ],
    [activeProducts, outOfStockProducts]
  );

  const categoryChartData = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      const category = product.category?.name || "Unassigned";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const recentProducts = useMemo(
    () => products.slice(0, 5),
    [products]
  );

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading vendor dashboard..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Vendor Dashboard</h2>
            <p className="text-muted mb-0">Track your product health, stock levels, and analytics.</p>
          </div>
          <button className="btn btn-dark rounded-pill px-4" type="button" onClick={() => navigate("/vendor/products")}>Manage Products</button>
        </div>

        <ErrorAlert message={error} />

        <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
          <div className="col">
            <StatCard label="Total Products" value={totalProducts} tone="primary" />
          </div>
          <div className="col">
            <StatCard label="Total Stock" value={totalStock} tone="success" />
          </div>
          <div className="col">
            <StatCard label="Active Products" value={activeProducts} tone="info" />
          </div>
          <div className="col">
            <StatCard label="Out of Stock" value={outOfStockProducts} tone="warning" />
          </div>
        </div>

        <div className="row g-4 align-items-stretch mb-4">
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-4 border-0 p-3 h-100 metric-card">
              <h6 className="mb-3">Status Breakdown</h6>
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusChartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {statusChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm rounded-4 border-0 p-3 h-100 metric-card">
              <h6 className="mb-3">Category Distribution</h6>
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} dataKey="value" nameKey="name" outerRadius={90} label />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm rounded-4 border-0">
          <div className="card-body">
            <h5 className="mb-3">Recently Added Products</h5>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th className="text-end">Stock</th>
                    <th>Status</th>
                    <th className="text-end">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No recent products available.
                      </td>
                    </tr>
                  ) : (
                    recentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="product-avatar bg-secondary text-white d-flex align-items-center justify-content-center">
                              {product.name?.slice(0, 1)}
                            </div>
                            <div>
                              <strong>{product.name}</strong>
                              <div className="small text-muted">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td>{product.category?.name || "Unassigned"}</td>
                        <td className="text-end">{product.stock}</td>
                        <td>
                          <span className={`badge ${product.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark"}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="text-end">{Number(product.price).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
