import { Link } from "react-router-dom";

const UserProductCard = ({
  product,
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  inCart = false,
  inWishlist = false,
}) => {
  const imageUrl =
    product.imageUrl ||
    product.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || "Product")}&background=0D8ABC&color=fff&size=256`;

  const statusClass = product.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark";
  const statusLabel = product.status === "ACTIVE" ? "Available" : "Out of stock";

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="ratio ratio-4x3 overflow-hidden rounded-top">
        <img src={imageUrl} alt={product.name} className="card-img-top object-fit-cover" />
      </div>
      <div className="card-body d-flex flex-column gap-3">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className={`badge ${statusClass}`}>{statusLabel}</span>
           
          </div>
          <h5 className="card-title mb-2">{product.name}</h5>
          <p className="card-text text-muted small">{product.description || "No description available."}</p>
        </div>

        <div className="mt-auto d-flex flex-column gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <strong className="h6 mb-0">${Number(product.price || 0).toLocaleString()}</strong>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-dark btn-sm flex-grow-1"
              onClick={() => onAddToCart(product)}
              disabled={inCart || product.status !== "ACTIVE"}
            >
              {inCart ? "In Cart" : "Add to Cart"}
            </button>
            <button
              type="button"
              className={`btn btn-sm d-flex align-items-center justify-content-center ${
                inWishlist ? "btn-danger text-white" : "btn-outline-secondary"
              }`}
              onClick={() => onAddToWishlist(product)}
              disabled={inWishlist}
              aria-label={inWishlist ? "In Wishlist" : "Add to Wishlist"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={inWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6c-1.5-1.6-4-1.8-5.7-.5L12 6.1l-3.1-2c-1.7-1.3-4.2-1.1-5.7.5-1.8 1.9-1.8 5 0 6.8l8.8 8.9 8.8-8.9c1.8-1.8 1.8-4.9 0-6.8z" />
              </svg>
            </button>
          </div>
          <Link to={`/user/products/${product.id}`} className="btn btn-outline-dark btn-sm w-100">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProductCard;
