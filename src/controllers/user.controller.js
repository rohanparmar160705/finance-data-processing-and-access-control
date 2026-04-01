const userService = require('../services/user.service');

// list all users for admin dashboard 
const listUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

// get profile for the logged in user 
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

// update user role or status - admin only 
const updateUserDetails = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  getProfile,
  updateUserDetails,
};
