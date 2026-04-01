const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const validate = require('../validations/validate');
const { registerSchema, loginSchema } = require('../validations/auth.schema');
const { authLimiter } = require('../middlewares');

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);

module.exports = router;