const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const product = item.product;

  const imageUrl =
    product?.imageUrl ||
    product?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(product?.name || "Product")}&background=0D8ABC&color=fff&size=128`;

  return (
    <div className="card shadow-sm rounded-4 border-0 mb-3">
      <div className="row g-0 align-items-center p-3 gap-3">
        <div className="col-auto">
          <img
            src={imageUrl}
            alt={product.name}
            className="rounded-4"
            style={{ width: 110, height: 110, objectFit: "cover" }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product?.name || "Product")}&background=0D8ABC&color=fff&size=128`;
            }}
          />
        </div>
        <div className="col">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
            <div>
              <h5 className="mb-1">{product.name}</h5>
              <p className="text-muted small mb-1">
                {product.category?.name || "Unassigned"}
              </p>
              <p className="text-muted small mb-0">
                Rs.{Number(product.price || 0).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(product.id)}
            >
              Remove
            </button>
          </div>

          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="input-group input-group-sm" style={{ width: 140 }}>
              <span className="input-group-text">Qty</span>
              <input
                type="number"
                min="1"
                className="form-control"
                value={item.quantity}
                onChange={(event) =>
                  onQuantityChange(product.id, Number(event.target.value))
                }
              />
            </div>
            <div className="text-muted small">
              Status:{" "}
              {product.status === "ACTIVE" ? "Available" : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
