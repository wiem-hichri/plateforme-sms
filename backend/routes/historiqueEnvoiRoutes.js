const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/historiqueEnvoiController');



router.get('/historique', historiqueController.getHistorique);

module.exports = router;
