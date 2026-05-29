import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import { createVendor, getUsers, updateUser } from "../services/api";

const AddEditVendor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendorForm, setVendorForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadVendor = useCallback(async () => {
    if (!isEdit) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getUsers();
      const vendor = response.data.find((item) => String(item.id) === String(id));

      if (!vendor) {
        setError("Vendor not found");
        return;
      }

      setVendorForm({
        name: vendor.name,
        email: vendor.email,
        password: ""
      });
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  const handleChange = (event) => {
    setVendorForm({
      ...vendorForm,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (isEdit) {
        const payload = {
          name: vendorForm.name,
          email: vendorForm.email
        };

        if (vendorForm.password.trim()) {
          payload.password = vendorForm.password;
        }

        await updateUser(id, payload);
      } else {
        await createVendor(vendorForm);
      }

      navigate("/vendors");
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to save vendor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingState label={isEdit ? "Loading vendor details..." : "Preparing form..."} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">{isEdit ? "Edit Vendor" : "Add Vendor"}</h2>
            <p className="text-muted mb-0">
              {isEdit
                ? "Update the vendor account details. Leave password blank to keep the current password."
                : "Create a new vendor account for your store."}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => navigate("/vendors")}
          >
            Back to Vendors
          </button>
        </div>

        <ErrorAlert message={error} />

        <div className="card shadow-sm rounded-4 border-0">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <label htmlFor="vendorName" className="form-label">
                  Name
                </label>
                <input
                  id="vendorName"
                  name="name"
                  type="text"
                  className="form-control"
                  value={vendorForm.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label htmlFor="vendorEmail" className="form-label">
                  Email
                </label>
                <input
                  id="vendorEmail"
                  name="email"
                  type="email"
                  className="form-control"
                  value={vendorForm.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="vendorPassword" className="form-label">
                  Password
                </label>
                <input
                  id="vendorPassword"
                  name="password"
                  type="password"
                  className="form-control"
                  value={vendorForm.password}
                  onChange={handleChange}
                  minLength={6}
                  {...(isEdit ? {} : { required: true })}
                />
                {isEdit && (
                  <small className="form-text text-muted">
                    Leave blank to keep the current password.
                  </small>
                )}
              </div>

              <div className="d-flex gap-2 flex-column flex-sm-row">
                <button type="submit" className="btn btn-dark rounded-pill px-4" disabled={saving}>
                  {saving ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Vendor" : "Create Vendor"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => navigate("/vendors")}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditVendor;
