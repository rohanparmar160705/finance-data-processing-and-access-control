const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

// handle new user registration 
const register = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);

    res.status(201).json({
      message: 'User created',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// handle user login and token generation 
const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);

    // sign jwt with user details 
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};