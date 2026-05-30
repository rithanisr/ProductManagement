import { Link } from "react-router-dom";
import WishlistButton from "./wishlisttoogle";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onToggleWishlist,
  inCart,
  inWishlist,
}) => {
  const imageUrl =
    product.imageUrl ||
    product.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || "Product")}&background=0D8ABC&color=fff&size=256`;

  const stock = Number(product.stock ?? 0);
  let stockDisplay = "";
  let stockClass = "";

  if (stock === 0) {
    stockDisplay = "Out of Stock";
    stockClass = "text-danger fw-semibold";
  } else if (stock < 10) {
    stockDisplay = "Limited Stock";
    stockClass = "text-warning fw-semibold";
  } else {
    stockDisplay = `Stock ${stock}`;
    stockClass = "text-muted";
  }

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="ratio ratio-4x3 overflow-hidden rounded-top">
        <img
          src={imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="card-body d-flex flex-column gap-3">
        <div>
          <h5 className="card-title mb-2">{product.name}</h5>
          <p className="card-text text-muted small mb-0">
            {product.description || "No description available."}
          </p>
        </div>

        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <strong className="h6 mb-0">
              Rs.{Number(product.price || 0).toLocaleString()}
            </strong>
            <span className={`small ${stockClass}`}>{stockDisplay}</span>
          </div>

          <div className="d-grid gap-2">
            <Link
              to={`/user/products/${product.id}`}
              className="btn btn-outline-dark btn-sm"
            >
              View Product
            </Link>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-dark btn-sm flex-grow-1"
                onClick={() => onAddToCart(product)}
                disabled={inCart || stock === 0 || product.status !== "ACTIVE"}
              >
                {inCart
                  ? "In Cart"
                  : stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>

              <WishlistButton
                product={product}
                inWishlist={inWishlist}
                onToggleWishlist={onToggleWishlist}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
