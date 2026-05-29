import { Link } from "react-router-dom";

const WishlistItem = ({ item, onRemove, onMoveToCart }) => {
  const imageUrl =
    item.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Product")}&background=0D8ABC&color=fff&size=128`;

  return (
    <div className="card shadow-sm rounded-4 border-0 mb-3">
      <div className="row g-0 align-items-center p-3">
        <div className="col-auto">
          <img
            src={imageUrl}
            alt={item.name}
            className="rounded-4"
            style={{ width: 110, height: 110, objectFit: "cover" }}
          />
        </div>
        <div className="col">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
            <div>
              <h5 className="mb-1">{item.name}</h5>
              <p className="text-muted small mb-1">{item.category?.name || "Unassigned"}</p>
              <p className="text-muted small mb-0">${Number(item.price || 0).toLocaleString()}</p>
            </div>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Link to={`/user/products/${item.id}`} className="btn btn-outline-dark btn-sm">
              View
            </Link>
            <button type="button" className="btn btn-dark btn-sm" onClick={() => onMoveToCart(item)}>
              Move to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
