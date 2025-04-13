const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/authMiddleware');

// Route pour vérifier l'email

router.post('/check-email', authController.checkEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/update-password', authMiddleware, authController.updatePassword);

module.exports = router;