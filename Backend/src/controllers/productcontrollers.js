const prisma = require("../config/prisma");
const uploadImage = require("../utils/uploadImage");
const {
  getProductsWithQuery,
  updateProductById,
  deleteProductById,
} = require("../services/productservice");

const getProducts = async (req, res) => {
  try {
    const result = await getProductsWithQuery(req.query, req.user);

    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    req.body = req.body || {};
    const { name, price, stock, description, status, categoryName, vendorId } =
      req.body;

    if (!name || !description || !status || !categoryName) {
      return res.status(400).json({
        error: "name, description, status and categoryName are required",
      });
    }

    if (!["ACTIVE", "OUT_OF_STOCK"].includes(status)) {
      return res.status(400).json({
        error: "status must be ACTIVE or OUT_OF_STOCK",
      });
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        error: "price must be a valid number",
      });
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        error: "stock must be a valid integer",
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        name: categoryName.trim(),
      },
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    let productVendorId = null;

    if (req.user.role === "VENDOR") {
      productVendorId = req.user.id;
    }

    if (req.user.role === "ADMIN" && vendorId) {
      const vendor = await prisma.user.findUnique({
        where: {
          id: Number(vendorId),
        },
      });

      if (!vendor) {
        return res.status(404).json({
          error: "Vendor not found",
        });
      }

      if (vendor.role !== "VENDOR") {
        return res.status(400).json({
          error: "vendorId must belong to a VENDOR user",
        });
      }

      productVendorId = vendor.id;
    }

    let imageUrl = null;

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer);
        imageUrl = uploadResult.secure_url || uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Image upload failed",
          details: uploadError.message,
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        stock: parsedStock,
        description,
        status,
        imageUrl,
        vendorId: productVendorId,
        categoryId: category.id,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    req.body = req.body || {};
    const productId = Number(req.params.id);

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer);
        req.body.imageUrl = uploadResult.secure_url || uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Image upload failed",
          details: uploadError.message,
        });
      }
    }

    const product = await updateProductById(productId, req.body, req.user);

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    await deleteProductById(productId, req.user);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
