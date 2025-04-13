const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.Controllers');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques
router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);


// Routes protégées
router.post('/logout', authMiddleware, UserController.logoutUser);
router.get('/users', authMiddleware, UserController.getUsers);
router.get('/user/:id', authMiddleware, UserController.getUserById);
router.get('/me', authMiddleware, UserController.getMe); // Route pour /api/users/me
router.put('/profile/:id', authMiddleware, UserController.uploadProfileImage, UserController.updateProfile);
router.delete('/user/:id', authMiddleware, UserController.deleteUser);

module.exports = router;