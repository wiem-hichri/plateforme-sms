// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats,getTauxStats, getPucesAffectationStats } = require('../controllers/dashboardController');



router.get('/stats', getDashboardStats);
router.get('/taux-mensuels', getTauxStats);
router.get('/puces-stats', getPucesAffectationStats);



module.exports = router;
