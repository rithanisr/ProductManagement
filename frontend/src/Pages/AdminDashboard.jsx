import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import StatCard from "../Components/StatCard";
import { getCategories, getProducts, getUsers } from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);
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

      setUsers(usersResponse.data);
      setProducts(productsResponse.data.products || []);
      setCategories(categoriesResponse.data);

      setStats({
        totalProducts: productsResponse.data.totalProducts || 0,
        activeProducts: activeProductsResponse.data.totalProducts || 0,
        outOfStockProducts: outOfStockProductsResponse.data.totalProducts || 0,
      });
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

  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.sold || b.stock || 0) - (a.sold || a.stock || 0))
      .slice(0, 8);
  }, [products]);

  const chartData = {
    labels: topProducts.map((p) =>
      p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
    ),
    datasets: [
      {
        label: "Units Sold",
        data: topProducts.map((p) => p.sold || p.stock || 0),
        backgroundColor: "rgba(118, 157, 215, 0.7)",
        borderColor: "#6087c1",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f1f1" },
      },
      x: {
        grid: { display: false },
      },
    },
    barThickness: 55,
    maxBarThickness: 75,
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1">Admin Dashboard</h2>
            <p className="text-muted">Overview of your store</p>
          </div>
        </div>

        <ErrorAlert message={error} />

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mb-5">
          <div className="col">
            <StatCard
              label="Total Users"
              value={customers.length}
              tone="primary"
              icon={<i className="bi bi-people-fill fs-1"></i>}
            />
          </div>
          <div className="col">
            <StatCard
              label="Vendors"
              value={vendors.length}
              tone="success"
              icon={<i className="bi bi-shop fs-1"></i>}
            />
          </div>
          <div className="col">
            <StatCard
              label="Total Products"
              value={stats.totalProducts}
              tone="dark"
              icon={<i className="bi bi-box-seam fs-1"></i>}
            />
          </div>
          <div className="col">
            <StatCard
              label="Categories"
              value={categories.length}
              tone="info"
              icon={<i className="bi bi-tags-fill fs-1"></i>}
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body">
                <h5 className="mb-4">Most Selling Products</h5>
                <div style={{ height: "380px" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body">
                <h5 className="mb-4">Top Vendors</h5>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Vendor Name</th>
                        <th className="text-center">Products</th>
                        <th className="text-center">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors
                        .sort(
                          (a, b) =>
                            (b.products?.length || 0) -
                            (a.products?.length || 0),
                        )
                        .slice(0, 8)
                        .map((vendor) => (
                          <tr key={vendor.id}>
                            <td>
                              <strong>{vendor.name}</strong>
                            </td>
                            <td className="text-center fw-semibold">
                              {vendor.products?.length || 0}
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">VENDOR</span>
                            </td>
                          </tr>
                        ))}
                      {vendors.length === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center text-muted py-4"
                          >
                            No vendors found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
