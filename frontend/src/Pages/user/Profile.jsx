import { useEffect, useState } from "react";
import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import { useAuth } from "../../context/AuthContext";
import { useUserData } from "../../context/UserDataContext";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useUserData();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || user?.name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
  }, [profile, user]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess("");
  };

  const handleCancel = () => {

    if (profile) {
      setForm({
        name: profile.name || user?.name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSuccess("");

    const ok = await updateProfile(form);

    setSaving(false);
    if (ok) {
      setSuccess("Profile updated successfully.");
      setIsEditing(false); 
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Profile</h2>
            <p className="text-muted mb-0">Update your contact details for a better experience.</p>
          </div>

          {!isEditing && !loading && (
            <button className="btn btn-dark" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        <ErrorAlert message={error || success} />

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingState label="Loading profile..." />
          </div>
        ) : (
          <div className="card shadow-sm rounded-4 border-0 p-4">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  readOnly={!isEditing}     
                  disabled={!isEditing}     
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-12 d-flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;