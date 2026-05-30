const ProductForm = ({
  form,
  categories,
  editingProduct,
  saving,
  onChange,
  onFileChange,
  imagePreview,
  onSubmit,
  onCancel,
  viewOnly = false,
}) => {
  return (
    <div className="lux-card product-editor-card">
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              className="form-control luxury-input"
              name="name"
              value={form.name}
              onChange={onChange}
              disabled={viewOnly}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control luxury-input"
              name="description"
              value={form.description}
              onChange={onChange}
              rows="3"
              disabled={viewOnly}
              required
            />
          </div>

          <div className="col-6">
            <label className="form-label">Price</label>
            <input
              className="form-control luxury-input"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={onChange}
              disabled={viewOnly}
              required
            />
          </div>

          <div className="col-6">
            <label className="form-label">Stock</label>
            <input
              className="form-control luxury-input"
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={onChange}
              disabled={viewOnly}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Category</label>
            <select
              className="form-select luxury-input"
              name="categoryName"
              value={form.categoryName}
              onChange={onChange}
              disabled={viewOnly}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Status</label>
            <select
              className="form-select luxury-input"
              name="status"
              value={form.status}
              onChange={onChange}
              disabled={viewOnly}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>

          {!viewOnly ? (
            <div className="col-12">
              <label className="form-label">Product Image</label>
              <input
                className="form-control luxury-input"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={onFileChange}
                disabled={viewOnly}
              />
            </div>
          ) : null}

          {imagePreview ? (
            <div className="col-12">
              <label className="form-label">Image Preview</label>
              <div
                className="border rounded p-2"
                style={{ maxWidth: "50%", height: "auto" }}
              >
                <img
                  src={imagePreview}
                  alt="Product preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            </div>
          ) : null}
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          {!viewOnly && (
            <button className="btn btn-dark" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
            </button>
          )}

          <button className="btn btn-soft" type="button" onClick={onCancel}>
            {viewOnly ? "Close" : editingProduct ? "Cancel" : "Close"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
