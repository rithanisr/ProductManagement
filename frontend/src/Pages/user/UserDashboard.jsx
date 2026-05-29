import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorAlert from "../../Components/ErrorAlert";
import LoadingState from "../../Components/LoadingState";
import UserProductCard from "../../Components/UserProductCard";
import UserNavbar from "../../Components/UserNavbar";
import { useUserData } from "../../context/UserDataContext";
import { getCategories, getProducts } from "../../services/api";

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const { cart, wishlist, addToCart, addToWishlist } = useUserData();

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

  const filteredProducts = useMemo(() => {
    if (!status) {
      return products;
    }

    return products.filter((product) => product.status === status);
  }, [products, status]);

  const cartIds = useMemo(() => cart.map((item) => item.product.id), [cart]);
  const wishlistIds = useMemo(() => wishlist.map((item) => item.id), [wishlist]);

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

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingState label="Loading products..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card shadow-sm rounded-4 border-0 py-5">
            <div className="card-body text-center">
              <h3>No products found</h3>
              <p className="text-muted">Try a different search term or clear your filters.</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-6 col-xl-4">
                <UserProductCard
                  product={product}
                  onAddToCart={addToCart}
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

export default UserDashboard;
