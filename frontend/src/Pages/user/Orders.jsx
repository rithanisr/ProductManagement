import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import { useUserData } from "../../context/UserDataContext";
import { Link } from "react-router-dom";

const Orders = () => {
  const { orders, loading, error } = useUserData();

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">My Orders</h2>
            <p className="text-muted mb-0">
              Review recent purchases and order status.
            </p>
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
              <p className="text-muted">
                Place an order from the cart to see it here.
              </p>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="card shadow-sm rounded-4 border-0 mb-4"
            >
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
                  <div>
                    <h5 className="mb-1">Order #{order.id}</h5>
                    <p className="text-muted mb-0">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`badge px-3 py-2 fs-6 ${
                      order.status === "Delivered"
                        ? "bg-success"
                        : order.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-info"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="row g-3">
                  {order.items.map((item, index) => {
                    const productData = item?.product || item || {};

                    const product = {
                      id: productData.id || item.productId || item.id,
                      name: productData.name || "Unnamed Product",
                      price: Number(
                        productData.price || productData.Price || 0,
                      ),
                      category:
                        productData.category?.name ||
                        productData.category ||
                        " ",
                      description:
                        productData.description || productData.desc || "",
                    };

                    return (
                      <div key={product.id || index} className="col-12">
                        <div className="card border rounded-4 p-3">
                          <div className="row g-0 align-items-center">
                            <div className="col">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="flex-grow-1">
                                  <h5 className="mb-1">{product.name}</h5>
                                  <p className="text-muted small mb-1">
                                    {product.category}
                                  </p>
                                </div>
                              </div>

                              <div className="d-flex gap-2">
                                <Link
                                  to={`/user/products/${product.id}`}
                                  className="btn btn-outline-dark btn-sm"
                                >
                                  View Product
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                  <div className="text-end">
                    <p className="text-muted mb-1 small">Total Amount</p>
                    <strong className="fs-4">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
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
