const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controllers');

router.get('/daily', activityController.getDailyActivities);

// ... autres routes existantes ...

module.exports = router;