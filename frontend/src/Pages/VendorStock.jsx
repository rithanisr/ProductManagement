import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import { getVendorProducts, updateVendorProduct } from "../services/api";

const VendorStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stockValues, setStockValues] = useState({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getVendorProducts({ page: 1, limit: 100, sort: "latest" });
      setProducts(response.data.products);
      setStockValues(
        response.data.products.reduce((acc, product) => {
          acc[product.id] = String(product.stock || 0);
          return acc;
        }, {})
      );
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
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter ? product.status === statusFilter : true;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const handleStockChange = (productId, value) => {
    setStockValues({
      ...stockValues,
      [productId]: value
    });
  };

  const handleUpdateStock = async (productId) => {
    const raw = stockValues[productId];
    const nextStock = Number(raw);

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      setError("Stock must be a non-negative integer");
      return;
    }

    setError("");

    try {
      await updateVendorProduct(productId, { stock: nextStock });
      await loadProducts();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to update stock");
    }
  };

  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const lowStockCount = products.filter((product) => product.stock <= 10 && product.stock > 0).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;

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
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Stock Items</h2>
            <p className="text-muted mb-0">Update quantities, track low stock, and keep your catalog fresh.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="search"
              className="form-control search-input"
              placeholder="Search stock items"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>
        </div>

        <ErrorAlert message={error} />


        <div className="card shadow-sm rounded-4 border-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-end">Current Stock</th>
                  <th className="text-end">Update</th>
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
                          <div className="small text-muted">{product.description}</div>
                        </td>
                        <td>{product.category?.name || "Unassigned"}</td>
                        <td>
                          <span className={`badge ${product.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark"}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <span className={isOut ? "text-danger" : isLow ? "text-warning" : "text-muted"}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end align-items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              style={{ width: "5.5rem" }}
                              value={stockValues[product.id] ?? ""}
                              onChange={(event) => handleStockChange(product.id, event.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-dark"
                              onClick={() => handleUpdateStock(product.id)}
                            >
                              Save
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
    </div>
  );
};

export default VendorStock;
