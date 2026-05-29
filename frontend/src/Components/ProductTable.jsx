const ProductTable = ({ products, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="lux-card table-card">
      <div className="table-responsive">
        <table className="table luxury-table align-middle mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Status</th>
              <th className="text-end">Stock</th>
              <th className="text-end">Price</th>
              {showActions && <th className="text-end">Action</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <span className="product-avatar">{product.name?.slice(0, 1)}</span>
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.description}</small>
                    </div>
                  </div>
                </td>
                <td>{product.category?.name || "Unassigned"}</td>
                <td>{product.vendor?.name || "No vendor"}</td>
                <td>
                  <span className={`status-pill ${product.status === "ACTIVE" ? "active" : "warning"}`}>
                    {product.status}
                  </span>
                </td>
                <td className="text-end">{product.stock}</td>
                <td className="text-end">{Number(product.price).toLocaleString()}</td>
                {showActions && (
                  <td className="text-end">
                    <div className="table-actions">
                      <button className="icon-btn edit" type="button" onClick={() => onEdit(product)}>
                        Edit
                      </button>
                      <button className="icon-btn danger" type="button" onClick={() => onDelete(product.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="empty-cell" colSpan={showActions ? "7" : "6"}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
