import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import { useUserData } from "../../context/UserDataContext";

const Orders = () => {
  const { orders, loading, error } = useUserData();

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">My Orders</h2>
            <p className="text-muted mb-0">Review recent purchases and order status.</p>
          </div>
        </div>

        <ErrorAlert message={error} />

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingState label="Loading orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="card shadow-sm rounded-4 border-0 py-5">
            <div className="card-body text-center">
              <h3>No orders yet</h3>
              <p className="text-muted">Place an order from the cart to see it here.</p>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card shadow-sm rounded-4 border-0 mb-4">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-3">
                  <div>
                    <h5 className="mb-1">Order {order.id}</h5>
                    <p className="text-muted mb-0">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${order.status === "Delivered" ? "bg-success" : "bg-warning text-dark"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="row g-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="col-12 col-md-6">
                      <div className="border rounded-4 p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1">{item.product.name}</h6>
                          <span className="text-muted small">Qty {item.quantity}</span>
                        </div>
                        <p className="text-muted small mb-1">{item.product.category?.name || "Unassigned"}</p>
                        <p className="mb-0 fw-semibold">${(Number(item.product.price || 0) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end mt-3 gap-3">
                  <strong>Total: ${Number(order.total || 0).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
