const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { getPublicUser, registerUser } = require("../services/authservice");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        products: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const result = await registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "USER",
    });

    res.status(201).json({
      message: "User created successfully",
      user: result.user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
};

const createVendor = async (req, res) => {
  try {
    const result = await registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "VENDOR",
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor: result.user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    const updateData = {
      name: name.trim(),
      email: normalizedEmail,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    res.json({
      message: "User updated successfully",
      user: getPublicUser(updatedUser),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    if (req.user.id === userId) {
      return res.status(400).json({
        error: "You cannot delete your own account",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  createVendor,
  updateUser,
  deleteUser,
};
