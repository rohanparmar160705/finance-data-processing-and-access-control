const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const validate = require('../validations/validate');
const { registerSchema, loginSchema } = require('../validations/auth.schema');
const { authLimiter } = require('../middlewares');

// register a new user - rate limited 
router.post('/register', authLimiter, validate(registerSchema), controller.register);
// login user and get token 
router.post('/login', authLimiter, validate(loginSchema), controller.login);

module.exports = router;