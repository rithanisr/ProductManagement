import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import ProductForm from "../Components/ProductForm";
import VendorProductModal from "../Components/VendorProductModal";
import {
  createVendorProduct,
  deleteVendorProduct,
  getCategories,
  getVendorProducts,
  updateVendorProduct
} from "../services/api";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryName: "",
  status: "ACTIVE"
};

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getVendorProducts({
        page: 1,
        limit: 100,
        sort: "latest",
        search: search || undefined,
        status: statusFilter || undefined
      });
      setProducts(response.data.products);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load categories");
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openAddModal = () => {
    setError("");
    setForm(initialFormState);
    setImageFile(null);
    setImagePreview("");
    setEditingProduct(null);
    setViewOnly(false);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price || ""),
      stock: String(product.stock || ""),
      categoryName: product.category?.name || "",
      status: product.status || "ACTIVE"
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || "");
    setEditingProduct(product);
    setViewOnly(false);
    setShowModal(true);
  };

  const openViewModal = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price || ""),
      stock: String(product.stock || ""),
      categoryName: product.category?.name || "",
      status: product.status || "ACTIVE"
    });
    setImagePreview(product.imageUrl || "");
    setEditingProduct(product);
    setViewOnly(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setViewOnly(false);
    setForm(initialFormState);
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("price", form.price);
      payload.append("stock", form.stock);
      payload.append("categoryName", form.categoryName);
      payload.append("status", form.status);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editingProduct) {
        await updateVendorProduct(editingProduct.id, payload);
      } else {
        await createVendorProduct(payload);
      }

      await loadProducts();
      closeModal();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteVendorProduct(productId);
      await loadProducts();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to delete product");
    }
  };

  const productCount = products.length;

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading your products..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Products</h2>
            <p className="text-muted mb-0">Manage products that belong to your vendor account.</p>
          </div>
          <button className="btn btn-dark rounded-pill px-4" type="button" onClick={openAddModal}>
            <span className="me-2">+</span>
            Add Product
          </button>
        </div>

        <ErrorAlert message={error} />

        <div className="card shadow-sm rounded-4 border-0 mb-4">
          <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            
            <div className="d-flex gap-2 flex-wrap">
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card shadow-sm rounded-4 border-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Stock</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="product-avatar bg-secondary text-white d-flex align-items-center justify-content-center overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              product.name?.slice(0, 1)
                            )}
                          </div>
                          <div>
                            <strong>{product.name}</strong>
                            <small className="d-block text-muted">{product.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>{product.category?.name || "Unassigned"}</td>
                      <td className="text-end">{Number(product.price).toLocaleString()}</td>
                      <td className="text-end">{product.stock}</td>
                      <td>
                        <span className={`badge ${product.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark"}`}>
                          {product.status}
                        </span>
                      </td>
                    
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => openViewModal(product)}>
                            View
                          </button>
                          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => openEditModal(product)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <VendorProductModal
          show={showModal}
          title={viewOnly ? "View Product" : editingProduct ? "Edit Product" : "Add Product"}
          form={form}
          categories={categories}
          editingProduct={editingProduct}
          saving={saving}
          viewOnly={viewOnly}
          onChange={handleChange}
          onFileChange={handleFileChange}
          imagePreview={imagePreview}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default VendorProducts;
