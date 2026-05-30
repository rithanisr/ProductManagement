import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import {
  getVendorProducts,
  updateVendorProduct,
  deleteVendorProduct,
} from "../services/api";

const VendorStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getVendorProducts({
        page: 1,
        limit: 100,
        sort: "latest",
      });
      setProducts(response.data.products);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load stock items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter
        ? product.status === statusFilter
        : true;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewStock(String(product.stock || 0));
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewStock("");
  };

  const handleUpdateStock = async () => {
    if (!editingProduct) return;

    const nextStock = Number(newStock);

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      setError("Stock must be a non-negative integer");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateVendorProduct(editingProduct.id, { stock: nextStock });
      await loadProducts();
      closeModal();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    try {
      await deleteVendorProduct(productId);
      await loadProducts();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading stock items..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="mb-4">
          <div className="mb-3">
            <h2 className="h5 mb-1">Stock Items</h2>
            <p className="text-muted mb-0">
              Update quantities, track low stock, and keep your catalog fresh.
            </p>
          </div>

          <div className="card shadow-sm rounded-4 border-0 mb-4">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <input
                  type="search"
                  className="form-control search-input"
                  placeholder="Search stock items"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ maxWidth: "320px", minWidth: "250px" }}
                />
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ maxWidth: "180px" }}
                >
                  <option value="">All statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <ErrorAlert message={error} />

        <div className="card shadow-sm rounded-4 border-0">
          <div className="table-responsive px-3 py-1">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Stock</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No stock items found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLow = product.stock <= 10 && product.stock > 0;
                    const isOut = product.stock === 0;

                    return (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          <div className="small text-muted">
                            {product.description}
                          </div>
                        </td>
                        <td>{product.category?.name || "Unassigned"}</td>
                        <td>
                          <span
                            className={`badge ${product.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark"}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              isOut
                                ? "text-danger fw-bold"
                                : isLow
                                  ? "text-warning fw-bold"
                                  : "text-muted"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditModal(product)}
                              title="Edit Stock"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete Product"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && editingProduct && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Update Stock</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Product Name</label>
                  <p className="mb-0">{editingProduct.name}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Current Stock</label>
                  <p className="mb-0 text-muted">{editingProduct.stock}</p>
                </div>

                <div>
                  <label className="form-label fw-medium">
                    New Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleUpdateStock}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorStock;
