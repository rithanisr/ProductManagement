import React from "react";

const WishlistButton = ({
  product,
  inWishlist,
  onToggleWishlist,
  size = "sm",
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`btn d-flex align-items-center justify-content-center ${className} ${
        inWishlist ? "btn-danger text-white" : "btn-outline-secondary"
      }`}
      onClick={() => onToggleWishlist(product)}
      disabled={inWishlist === undefined}
      aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      style={
        size === "sm"
          ? { width: "38px", height: "38px" }
          : { width: "48px", height: "48px" }
      }
    >
      <svg
        width={size === "sm" ? "18" : "24"}
        height={size === "sm" ? "18" : "24"}
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
  );
};

export default WishlistButton;
