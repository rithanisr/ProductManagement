import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import { deleteUser, getUsers } from "../services/api";

const Vendors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVendors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const vendors = useMemo(
    () => users.filter((userItem) => userItem.role === "VENDOR"),
    [users]
  );

  const handleDeleteVendor = async (vendorId) => {
    const confirmed = window.confirm("Delete this vendor?");

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteUser(vendorId);
      await loadVendors();
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to delete vendor");
    }
  };

  const handleEditVendor = (vendorId) => {
    navigate(`/vendors/edit/${vendorId}`);
  };

  const handleAddVendor = () => {
    navigate("/vendors/add");
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label="Loading vendors..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Vendors</h2>
            
          </div>

          {user?.role === "ADMIN" && (
            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={handleAddVendor}
            >
              <span className="me-2">+</span>
              Add Vendor
            </button>
          )}
        </div>

        <ErrorAlert message={error} />

        {/* <div className="card shadow-sm rounded-4 border-0 mb-4">
          <div className="card-body py-3 px-4 d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start align-items-md-center">
            <div>
              <h6 className="mb-1">Vendor count</h6>
              <p className="mb-0 text-muted">{vendors.length} vendor{vendors.length === 1 ? "" : "s"} available</p>
            </div>
            <div className="text-muted small">
              Admin-only actions are available in the table when signed in as an administrator.
            </div>
          </div>
        </div> */}

       <div className="card shadow-sm rounded-4 border-0 overflow-hidden">
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th className="ps-4">Name</th>
          <th>Email</th>
          <th>Created Date</th>

          {user?.role === "ADMIN" && (
            <th className="text-center" style={{ width: "140px" }}>
              Actions
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {vendors.length === 0 ? (
          <tr>
            <td
              colSpan={user?.role === "ADMIN" ? 4 : 3}
              className="text-center py-5 text-muted"
            >
              No vendors found.
            </td>
          </tr>
        ) : (
          vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td className="ps-4 fw-medium">{vendor.name}</td>

              <td>{vendor.email}</td>

              <td>
                {new Date(vendor.createdAt).toLocaleDateString()}
              </td>

              {user?.role === "ADMIN" && (
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px" }}
                      onClick={() => handleEditVendor(vendor.id)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px" }}
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
      </div>
    </div>
  );
};

export default Vendors;
