import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "ADMIN":
        return "/admin";
      case "VENDOR":
        return "/vendor/dashboard";
      case "USER":
        return "/user/dashboard";
      default:
        return "/";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);

      const redirectTo =
        location.state?.from?.pathname || getRedirectPath(user?.role);
      navigate(redirectTo, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg, #dadeee 0%, #5c627d 100%)",
      }}
    >
      <div className="container py-5">
        <div className="row g-0 justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div
              className="row g-0 shadow-lg rounded-3 overflow-hidden"
              style={{ minHeight: "620px" }}
            >
              <div
                className="col-lg-5 d-none d-lg-flex flex-column justify-content-center p-5 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #9ba7d6 0%, #3b5ad1 100%)",
                }}
              >
                <div className="mb-auto">
                  <div className="d-flex align-items-center gap-2 mb-5">
                    <div
                      className="bg-white rounded-circle p-2"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <div className="bg-primary rounded-circle w-100 h-100 d-flex align-items-center justify-content-center">
                        <span className="text-white fw-bold fs-4">I</span>
                      </div>
                    </div>
                  </div>

                  <h1 className="display-4 fw-bold mb-2">
                    Inventory
                    <br />
                    Management
                  </h1>
                </div>

                <div
                  className="position-relative mt-auto"
                  style={{ height: "180px" }}
                >
                  <div
                    className="position-absolute bottom-0 start-0"
                    style={{ fontSize: "120px", opacity: "0.1" }}
                  >
                    ✦
                  </div>
                  <div
                    className="position-absolute top-50 end-0"
                    style={{ fontSize: "80px", opacity: "0.1" }}
                  >
                    ◉
                  </div>
                </div>
              </div>

              <div className="col-lg-7 bg-white p-5 d-flex flex-column justify-content-center">
                <div
                  className="mx-auto"
                  style={{ maxWidth: "380px", width: "100%" }}
                >
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto rounded-3 d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        background: "#4a6cf7",
                      }}
                    >
                      <span className="text-white fw-bold fs-2">I</span>
                    </div>
                  </div>

                  <h2 className="text-center mb-4 fw-semibold">
                    Hello! Welcome back
                  </h2>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-muted">Email</label>
                      <input
                        className="form-control form-control-lg"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted">Password</label>
                      <input
                        className="form-control form-control-lg"
                        name="password"
                        type="password"
                        placeholder="••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      className="btn btn-primary btn-lg w-100 mb-4"
                      type="submit"
                      disabled={loading}
                      style={{ background: "#4a6cf7", border: "none" }}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>

                  <p className="text-center text-muted">
                    Don't Have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary fw-medium text-decoration-none"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
