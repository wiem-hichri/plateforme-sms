const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');



router.post('/devices/addDevice', deviceController.createDevice);
router.get('/devices', deviceController.getDevices);
router.put('/devices/:id', deviceController.updateDevice);
router.delete('/devices/:id', deviceController.deleteDevice);

module.exports = router;
