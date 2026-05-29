import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "../Components/ErrorAlert";
import LoadingState from "../Components/LoadingState";
import { getProductById } from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getProductById(id);
        if (!response.data) {
          setError("Product not found.");
        } else {
          setProduct(response.data);
        }
      } catch (apiError) {
        setError(apiError.response?.data?.error || "Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const imageUrl = useMemo(() => {
    if (!product) return "";
    return (
      product.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || "Product")}&background=0D8ABC&color=fff&size=512`
    );
  }, [product]);

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingState label="Loading product details..." />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <button type="button" className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
          &larr; Back to products
        </button>

        <ErrorAlert message={error} />

        {!error && product && (
          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <div className="card shadow-sm rounded-4 border-0 overflow-hidden h-100">
                <img src={imageUrl} alt={product.name} className="img-fluid w-100" />
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="card shadow-sm rounded-4 border-0 p-4">
                <h1 className="h4 mb-3">{product.name}</h1>
                <p className="text-muted mb-4">{product.description || "No description available."}</p>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="text-uppercase text-muted small mb-1">Price</div>
                    <div className="fw-semibold text-dark">${Number(product.price || 0).toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-uppercase text-muted small mb-1">Category</div>
                    <div className="fw-semibold text-dark">{product.category?.name || "Unassigned"}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-uppercase text-muted small mb-1">Stock</div>
                    <div className={product.stock === 0 ? "text-danger fw-semibold" : "text-success fw-semibold"}>
                      {product.stock === 0 ? "Out of stock" : `${product.stock} available`}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-uppercase text-muted small mb-1">Vendor</div>
                    <div className="fw-semibold text-dark">{product.vendor?.name || "Unknown vendor"}</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <span className={`badge ${product.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark"}`}>
                    {product.status}
                  </span>
                  <span className="badge bg-light text-dark">{product.category?.name || "Unassigned"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
