import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4">Dashboard</h1>
              <span className="badge text-bg-primary">{user?.role}</span>
              {user?.role === "ADMIN" && (
                <div className="mt-3">
                  <AdminDashboard/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
