const {
  getAllCategories,
  createCategoryRecord,
  updateCategoryById,
  deleteCategoryById,
  getProductsByCategoryId,
} = require("../services/categoryservice");

const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await createCategoryRecord(req.body);

    res.status(201).json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await updateCategoryById(categoryId, req.body);

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    await deleteCategoryById(categoryId);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getCategoryProducts = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await getProductsByCategoryId(categoryId);

    res.json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
};
