import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import WishlistItem from "../../Components/WishlistItem";
import { useUserData } from "../../context/UserDataContext";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, moveWishlistToCart } = useUserData();

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">Wishlist</h2>
            <p className="text-muted mb-0">Save favorites to come back to later.</p>
          </div>
        </div>

        <ErrorAlert message={error} />

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingState label="Loading wishlist..." />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="card shadow-sm rounded-4 border-0 py-5">
            <div className="card-body text-center">
              <h3>Your wishlist is empty</h3>
              <p className="text-muted">Add products from the Home page to save them here.</p>
            </div>
          </div>
        ) : (
          wishlist.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onRemove={removeFromWishlist}
              onMoveToCart={moveWishlistToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
