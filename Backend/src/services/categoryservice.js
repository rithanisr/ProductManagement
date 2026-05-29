const prisma = require("../config/prisma");

const validateCategoryName = (name) => {
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (!trimmedName) {
    const error = new Error("name is required");
    error.statusCode = 400;
    throw error;
  }

  return trimmedName;
};

const validateCategoryId = (categoryId) => {
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    const error = new Error("Invalid category id");
    error.statusCode = 400;
    throw error;
  }
};

const findCategoryById = async (categoryId) => {
  validateCategoryId(categoryId);

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

const ensureCategoryNameIsUnique = async (name, ignoredCategoryId) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name
    }
  });

  if (existingCategory && existingCategory.id !== ignoredCategoryId) {
    const error = new Error("Category name already exists");
    error.statusCode = 409;
    throw error;
  }
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      id: "asc"
    }
  });
};

const createCategoryRecord = async ({ name }) => {
  const trimmedName = validateCategoryName(name);

  await ensureCategoryNameIsUnique(trimmedName);

  return prisma.category.create({
    data: {
      name: trimmedName
    }
  });
};

const updateCategoryById = async (categoryId, { name }) => {
  await findCategoryById(categoryId);

  const trimmedName = validateCategoryName(name);
  await ensureCategoryNameIsUnique(trimmedName, categoryId);

  return prisma.category.update({
    where: {
      id: categoryId
    },
    data: {
      name: trimmedName
    }
  });
};

const deleteCategoryById = async (categoryId) => {
  await findCategoryById(categoryId);

  return prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};

const getProductsByCategoryId = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    },
    include: {
      products: {
        include: {
          category: true,
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          id: "asc"
        }
      }
    }
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

module.exports = {
  getAllCategories,
  createCategoryRecord,
  updateCategoryById,
  deleteCategoryById,
  getProductsByCategoryId
};
