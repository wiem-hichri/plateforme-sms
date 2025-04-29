const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');






router.post('/sites/addSite', siteController.createSite);
router.get('/sites', siteController.getSites);
router.put('/sites/:id', siteController.updateSite);
router.delete('/sites/:id', siteController.deleteSite);

module.exports = router;
