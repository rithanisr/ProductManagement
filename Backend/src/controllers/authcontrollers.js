const { registerUser, loginUser, getPublicUser } = require("../services/authservice");

const register = async (req, res) => {
  try {
    const result = await registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "USER"
    });

    res.status(201).json({
      message: "User registered successfully",
      ...result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      message: "Login successful",
      ...result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  res.json({
    user: getPublicUser(req.user)
  });
};

module.exports = {
  register,
  login,
  getProfile
};
