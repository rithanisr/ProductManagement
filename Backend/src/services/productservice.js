const prisma = require("../config/prisma");

const allowedStatuses = ["ACTIVE", "OUT_OF_STOCK"];
const allowedSorts = ["price", "latest", "stock"];
const allowedOrders = ["asc", "desc"];

const parsePositiveInteger = (value, fieldName, defaultValue, maxValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    const error = new Error(`${fieldName} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }

  if (maxValue && parsedValue > maxValue) {
    const error = new Error(`${fieldName} cannot be greater than ${maxValue}`);
    error.statusCode = 400;
    throw error;
  }

  return parsedValue;
};

const buildProductWhere = (query, user) => {
  const where = {};
  const andFilters = [];

  if (user.role === "USER") {
    where.status = "ACTIVE";
  }

  if (user.role === "VENDOR") {
    where.vendorId = user.id;
  }

  if (query.search !== undefined) {
    const search = String(query.search).trim();

    if (!search) {
      const error = new Error("search must not be empty");
      error.statusCode = 400;
      throw error;
    }

    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (query.category !== undefined) {
    const category = String(query.category).trim();

    if (!category) {
      const error = new Error("category must not be empty");
      error.statusCode = 400;
      throw error;
    }

    where.category = {
      is: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    };
  }

  if (query.status !== undefined) {
    const status = String(query.status).trim();

    if (!allowedStatuses.includes(status)) {
      const error = new Error("status must be ACTIVE or OUT_OF_STOCK");
      error.statusCode = 400;
      throw error;
    }

    if (user.role === "USER" && status !== "ACTIVE") {
      const error = new Error("Users can view only ACTIVE products");
      error.statusCode = 403;
      throw error;
    }

    where.status = status;
  }

  if (query.vendor !== undefined) {
    if (user.role !== "ADMIN") {
      const error = new Error("Only ADMIN can filter products by vendor");
      error.statusCode = 403;
      throw error;
    }

    const vendorId = Number(query.vendor);

    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      const error = new Error("vendor must be a valid vendor id");
      error.statusCode = 400;
      throw error;
    }

    where.vendorId = vendorId;
  }

  if (query.stock !== undefined) {
    const stock = Number(query.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      const error = new Error("stock must be a valid integer");
      error.statusCode = 400;
      throw error;
    }

    where.stock = stock;
  }

  if (query.minStock !== undefined || query.maxStock !== undefined) {
    const stockFilter = {};

    if (query.minStock !== undefined) {
      const minStock = Number(query.minStock);

      if (!Number.isInteger(minStock) || minStock < 0) {
        const error = new Error("minStock must be a valid integer");
        error.statusCode = 400;
        throw error;
      }

      stockFilter.gte = minStock;
    }

    if (query.maxStock !== undefined) {
      const maxStock = Number(query.maxStock);

      if (!Number.isInteger(maxStock) || maxStock < 0) {
        const error = new Error("maxStock must be a valid integer");
        error.statusCode = 400;
        throw error;
      }

      stockFilter.lte = maxStock;
    }

    if (
      stockFilter.gte !== undefined &&
      stockFilter.lte !== undefined &&
      stockFilter.gte > stockFilter.lte
    ) {
      const error = new Error("minStock cannot be greater than maxStock");
      error.statusCode = 400;
      throw error;
    }

    andFilters.push({ stock: stockFilter });
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  return where;
};

const buildProductOrderBy = (query) => {
  const sort = query.sort ? String(query.sort).trim() : "latest";
  const order = query.order ? String(query.order).trim() : undefined;

  if (!allowedSorts.includes(sort)) {
    const error = new Error("sort must be price, latest or stock");
    error.statusCode = 400;
    throw error;
  }

  if (order !== undefined && !allowedOrders.includes(order)) {
    const error = new Error("order must be asc or desc");
    error.statusCode = 400;
    throw error;
  }

  if (sort === "price") {
    return { price: order || "asc" };
  }

  if (sort === "stock") {
    return { stock: order || "asc" };
  }

  return { id: order || "desc" };
};

const getProductsWithQuery = async (query, user) => {
  const page = parsePositiveInteger(query.page, "page", 1);
  const limit = parsePositiveInteger(query.limit, "limit", 10, 100);
  const skip = (page - 1) * limit;
  const where = buildProductWhere(query, user);
  const orderBy = buildProductOrderBy(query);

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    totalProducts,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit) || 1,
  };
};

const getProductById = async (productId) => {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true,
      vendor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const validateProductAccess = (product, user) => {
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "ADMIN") {
    return;
  }

  if (user.role === "VENDOR" && product.vendorId === user.id) {
    return;
  }

  const error = new Error("You can manage only your own products");
  error.statusCode = 403;
  throw error;
};

const buildProductUpdateData = async (body) => {
  const updateData = {};

  if (body.imageUrl !== undefined) {
    if (typeof body.imageUrl !== "string" || !body.imageUrl.trim()) {
      const error = new Error("imageUrl must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }

    updateData.imageUrl = body.imageUrl.trim();
  }

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      const error = new Error("name must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }

    updateData.name = body.name.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string" || !body.description.trim()) {
      const error = new Error("description must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }

    updateData.description = body.description.trim();
  }

  if (body.price !== undefined) {
    const parsedPrice = Number(body.price);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      const error = new Error("price must be a valid number");
      error.statusCode = 400;
      throw error;
    }

    updateData.price = parsedPrice;
  }

  if (body.stock !== undefined) {
    const parsedStock = Number(body.stock);

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      const error = new Error("stock must be a valid integer");
      error.statusCode = 400;
      throw error;
    }

    updateData.stock = parsedStock;
  }

  if (body.status !== undefined) {
    if (!allowedStatuses.includes(body.status)) {
      const error = new Error("status must be ACTIVE or OUT_OF_STOCK");
      error.statusCode = 400;
      throw error;
    }

    updateData.status = body.status;
  }

  if (body.categoryName !== undefined) {
    if (typeof body.categoryName !== "string" || !body.categoryName.trim()) {
      const error = new Error("categoryName must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }

    const category = await prisma.category.findUnique({
      where: {
        name: body.categoryName.trim(),
      },
    });

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    updateData.categoryId = category.id;
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error("At least one product field is required to update");
    error.statusCode = 400;
    throw error;
  }

  return updateData;
};

const updateProductById = async (productId, body, user) => {
  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("Invalid product id");
    error.statusCode = 400;
    throw error;
  }

  const product = await getProductById(productId);
  validateProductAccess(product, user);

  const updateData = await buildProductUpdateData(body);

  return prisma.product.update({
    where: {
      id: productId,
    },
    data: updateData,
    include: {
      category: true,
      vendor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const deleteProductById = async (productId, user) => {
  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("Invalid product id");
    error.statusCode = 400;
    throw error;
  }

  const product = await getProductById(productId);
  validateProductAccess(product, user);

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });
};

module.exports = {
  getProductsWithQuery,
  updateProductById,
  deleteProductById,
};
