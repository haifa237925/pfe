const UserModel = require('../models/user.model');
const ReadingProgressModel = require('../models/reading-progress.model');

// Get user purchases
const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await UserModel.getUserPurchases(userId);
    res.json({ purchases });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({ message: 'Error fetching purchases' });
  }
};

// Get user reading progress
const getUserReadingProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await UserModel.getUserReadingProgress(userId);
    res.json({ progress });
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    res.status(500).json({ message: 'Error fetching reading progress' });
  }
};

// Update user reading progress
const updateReadingProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, lastPosition, completionPercentage } = req.body;
    
    if (!bookId || lastPosition === undefined || completionPercentage === undefined) {
      return res.status(400).json({ message: 'Required data missing' });
    }
    
    await ReadingProgressModel.updateProgress({
      userId,
      bookId,
      lastPosition,
      completionPercentage
    });
    
    res.json({ message: 'Reading progress updated' });
  } catch (error) {
    console.error('Error updating reading progress:', error);
    res.status(500).json({ message: 'Error updating reading progress' });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Admin: Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, active } = req.body;
    
    const updatedUser = await UserModel.update(id, {
      name,
      email,
      role,
      active
    });
    
    res.json({ 
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

module.exports = {
  getUserPurchases,
  getUserReadingProgress,
  updateReadingProgress,
  getAllUsers,
  updateUser
};