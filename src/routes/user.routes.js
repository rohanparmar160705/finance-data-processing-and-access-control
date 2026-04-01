const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// all routes in this file require valid jwt 
router.use(auth);

// get profile for the logged in user 
router.get('/me', userController.getProfile);

// admin only - list all registered users 
router.get('/', authorize('MANAGE_USERS'), userController.listUsers);

// admin only - update user role or status 
router.patch('/:id', authorize('ASSIGN_ROLES'), userController.updateUserDetails);

module.exports = router;
