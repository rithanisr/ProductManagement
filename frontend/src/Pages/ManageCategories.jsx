import { useCallback, useEffect, useState } from "react";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSavingCategory(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: categoryName });
      } else {
        await createCategory({ name: categoryName });
      }

      await loadCategories();
      closeModal();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm("Delete this category?");

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteCategory(categoryId);
      await loadCategories();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Categories</h2>
            <p className="text-muted mb-0">Manage categories, update names, and delete unused categories.</p>
          </div>

          <button className="btn btn-dark rounded-pill px-4" onClick={openAddModal}>
            <span className="me-2">+</span>
            Add Category
          </button>
        </div>

        <ErrorAlert message={error} />

    <div
  className="card shadow-sm rounded-4 border-0 overflow-hidden mx-auto"
  style={{ maxWidth: "850px" }}
>
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th style={{ width: "80px" }} className="ps-4">
            ID
          </th>

          <th>Category Name</th>

          <th
            className="text-center"
            style={{ width: "120px" }}
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.length === 0 ? (
          <tr>
            <td
              colSpan={3}
              className="text-center py-4 text-muted"
            >
              No categories found.
            </td>
          </tr>
        ) : (
          categories.map((category) => (
            <tr key={category.id}>
              <td className="ps-4 fw-medium">
                {category.id}
              </td>

              <td>{category.name}</td>

              <td>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "34px", height: "34px" }}
                    onClick={() => openEditModal(category)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "34px", height: "34px" }}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <i className="bi bi-trash"></i>
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
      </div>

      {showModal && (
        <div className="modal-backdrop fade show d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingCategory ? "Edit Category" : "Add Category"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                      Category Name
                    </label>
                    <input
                      id="categoryName"
                      name="categoryName"
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal} disabled={savingCategory}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-dark" disabled={savingCategory}>
                      {savingCategory ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
