const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import ajouté
const {
  saveHealthData,
  getHealthData,
  getHealthDataById,
} = require('../controllers/userDataControllers');

// Appliquer le middleware d'authentification
router.post('/', authMiddleware, saveHealthData);

router.get('/:id', authMiddleware, getHealthDataById);

router.get('/:userId', authMiddleware, getHealthData);

module.exports = router;