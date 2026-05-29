const prisma = require("../config/prisma");

const allowedStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const normalizeOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Order items are required");
    error.statusCode = 400;
    throw error;
  }

  const quantityByProductId = {};

  items.forEach((item) => {
    const productId = item.productId || item.product?.id;
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      const error = new Error("Each order item must include a valid productId");
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error(
        "Each order item must include a valid quantity greater than 0",
      );
      error.statusCode = 400;
      throw error;
    }

    quantityByProductId[productId] =
      (quantityByProductId[productId] || 0) + quantity;
  });

  return Object.entries(quantityByProductId).map(([productId, quantity]) => ({
    productId: Number(productId),
    quantity,
  }));
};

const getOrderStatusLabel = (status) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const createOrderForUser = async (userId, items) => {
  const normalizedItems = normalizeOrderItems(items);
  const productIds = normalizedItems.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    const missingIds = productIds.filter(
      (id) => !products.some((product) => product.id === id),
    );
    const error = new Error(`Product(s) not found: ${missingIds.join(", ")}`);
    error.statusCode = 404;
    throw error;
  }

  const productById = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  normalizedItems.forEach((item) => {
    const product = productById[item.productId];

    if (!product) {
      const error = new Error(`Product not found: ${item.productId}`);
      error.statusCode = 404;
      throw error;
    }

    if (product.status !== "ACTIVE") {
      const error = new Error(
        `Product ${product.name} is not available for purchase`,
      );
      error.statusCode = 400;
      throw error;
    }

    if (item.quantity > product.stock) {
      const error = new Error(
        `Not enough stock for ${product.name}. Available: ${product.stock}`,
      );
      error.statusCode = 400;
      throw error;
    }
  });

  const orderItemsData = normalizedItems.map((item) => {
    const product = productById[item.productId];
    return {
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const total = orderItemsData.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const orderCreate = prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  });

  const productUpdates = normalizedItems.map((item) => {
    const product = productById[item.productId];
    const newStock = product.stock - item.quantity;
    const updateData = {
      stock: newStock,
    };

    if (newStock <= 0) {
      updateData.status = "OUT_OF_STOCK";
    }

    return prisma.product.update({
      where: {
        id: item.productId,
      },
      data: updateData,
    });
  });

  const [order] = await prisma.$transaction([orderCreate, ...productUpdates]);

  return {
    id: order.id,
    total: order.total,
    status: getOrderStatusLabel(order.status),
    date: order.createdAt,
    items: order.items.map((item) => ({
      product: {
        id: item.productId,
        name: item.productName,
      },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
};

const mapOrderResponse = (order) => ({
  id: order.id,
  total: order.total,
  status: getOrderStatusLabel(order.status),
  date: order.createdAt,
  items: order.items.map((item) => ({
    product: {
      id: item.productId,
      name: item.productName,
    },
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  })),
});

const getOrdersByUser = async (userId) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  return orders.map(mapOrderResponse);
};

const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    ...mapOrderResponse(order),
    user: order.user,
  }));
};

const updateOrderStatus = async (orderId, status) => {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    const error = new Error("Invalid order id");
    error.statusCode = 400;
    throw error;
  }

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid order status");
    error.statusCode = 400;
    throw error;
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      items: true,
    },
  });

  return mapOrderResponse(updatedOrder);
};

module.exports = {
  createOrderForUser,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
};
