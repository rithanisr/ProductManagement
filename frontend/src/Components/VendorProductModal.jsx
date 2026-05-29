import ProductForm from "./ProductForm";

const VendorProductModal = ({
  show,
  title,
  form,
  categories,
  editingProduct,
  saving,
  viewOnly,
  onChange,
  onFileChange,
  imagePreview,
  onSubmit,
  onClose
}) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg">
          <div className="modal-header border-0">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body py-4">
            <ProductForm
              form={form}
              categories={categories}
              editingProduct={editingProduct}
              saving={saving}
              onChange={onChange}
              onFileChange={onFileChange}
              imagePreview={imagePreview}
              onSubmit={onSubmit}
              onCancel={onClose}
              viewOnly={viewOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductModal;
