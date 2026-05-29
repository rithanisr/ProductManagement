import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import CartItem from "../../Components/CartItem";
import { useUserData } from "../../context/UserDataContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    error,
    cartTotal,
    setQuantity,
    removeFromCart,
    placeOrder
  } = useUserData();

  const handlePlaceOrder = async () => {
    const success = await placeOrder();
    if (success) {
      navigate("/user/orders");
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">My Cart</h2>
            <p className="text-muted mb-0">Review your selected products and place your order.</p>
          </div>
        </div>

        <ErrorAlert message={error} />

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingState label="Loading cart items..." />
          </div>
        ) : cart.length === 0 ? (
          <div className="card shadow-sm rounded-4 border-0 py-5">
            <div className="card-body text-center">
              <h3>Your cart is empty</h3>
              <p className="text-muted">Add some products from Home to get started.</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-xl-8">
              {cart.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onQuantityChange={setQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="col-12 col-xl-4">
              <div className="card shadow-sm rounded-4 border-0 p-4">
                <h5 className="mb-3">Order summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items</span>
                  <strong>{cart.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <strong>${cartTotal.toLocaleString()}</strong>
                </div>
                <button type="button" className="btn btn-dark w-100" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
