// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats,getTauxStats } = require('../controllers/dashboardController');



router.get('/stats', getDashboardStats);
router.get('/taux-mensuels', getTauxStats);


module.exports = router;
