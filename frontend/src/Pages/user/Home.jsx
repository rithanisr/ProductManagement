import { useCallback, useEffect, useState } from "react";
import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import ProductCard from "../../Components/ProductCard";
import UserNavbar from "../../Components/UserNavbar";
import { useUserData } from "../../context/UserDataContext";
import { getCategories, getProducts } from "../../services/api";

const Home = () => {
  const { cart, wishlist, addToCart, addToWishlist, loading: userLoading, toggleWishlist } = useUserData();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Unable to load categories.");
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        search: search || undefined,
        category: category || undefined,
        status: status || undefined
      };
      const response = await getProducts(params);
      setProducts(response.data.products || []);
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const cartIds = cart.map((item) => item.product.id);
  const wishlistIds = wishlist.map((item) => item.id);

  return (
    <div className="container-fluid">
      <div className="container">
        <UserNavbar
          search={search}
          onSearch={setSearch}
          categories={categories}
          category={category}
          onCategory={setCategory}
          status={status}
          onStatus={setStatus}
        />

        <ErrorAlert message={error} />

        {(loading || userLoading) ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingState label="Loading products..." />
          </div>
        ) : products.length === 0 ? (
          <div className="card shadow-sm rounded-4 border-0 py-5">
            <div className="card-body text-center">
              <h3>No products found</h3>
              <p className="text-muted">Try a different search or adjust your filters.</p>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {products.map((product) => (
              <div key={product.id} className="col">
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onAddToWishlist={addToWishlist}
                  inCart={cartIds.includes(product.id)}
                  inWishlist={wishlistIds.includes(product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
