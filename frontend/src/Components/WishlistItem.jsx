import { Link } from "react-router-dom";

const WishlistItem = ({ item, onRemove, onMoveToCart }) => {
  const imageUrl =
    item?.imageUrl ||
    item?.image ||
    item?.product?.imageUrl ||
    item?.product?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.name || item?.product?.name || "Product")}&background=0D8ABC&color=fff&size=128`;

  const productName = item?.name || item?.product?.name || "Unnamed Product";
  const productPrice = item?.price || item?.product?.price || 0;
  const productCategory =
    item?.category?.name || item?.product?.category?.name || "Unassigned";
  const productId = item?.id || item?.product?.id;

  return (
    <div className="card shadow-sm rounded-4 border-0 mb-3">
      <div className="row g-0 align-items-center p-3 gap-4">
        <div className="col-auto">
          <img
            src={imageUrl}
            alt={productName}
            className="rounded-4"
            style={{ width: 110, height: 110, objectFit: "cover" }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(productName)}&background=0D8ABC&color=fff&size=128`;
            }}
          />
        </div>
        <div className="col">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
            <div>
              <h5 className="mb-1">{productName}</h5>
              <p className="text-muted small mb-1">{productCategory}</p>
              <p className="text-muted small mb-0">
                Rs.{Number(productPrice || 0).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(productId)}
            >
              Remove
            </button>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Link
              to={`/user/products/${productId}`}
              className="btn btn-outline-dark btn-sm"
            >
              View
            </Link>
            <button
              type="button"
              className="btn btn-dark btn-sm"
              onClick={() => onMoveToCart(item)}
            >
              Move to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
