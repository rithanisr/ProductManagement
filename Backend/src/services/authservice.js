const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const allowedRoles = ["USER", "VENDOR"];

const getPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

const validateRegistrationInput = ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    return "name, email and password are required";
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Please enter a valid email";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (role && !allowedRoles.includes(role)) {
    return "role must be USER or VENDOR";
  }

  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "email and password are required";
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Please enter a valid email";
  }

  return null;
};

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

const registerUser = async ({ name, email, password, role = "USER" }) => {
  const validationError = validateRegistrationInput({ name, email, password, role });

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role
    }
  });

  const token = generateToken(user);

  return {
    user: getPublicUser(user),
    token
  };
};

const loginUser = async ({ email, password }) => {
  const validationError = validateLoginInput({ email, password });

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim()
    }
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: getPublicUser(user),
    token
  };
};

module.exports = {
  registerUser,
  loginUser,
  getPublicUser
};
