const express = require('express');
const router = express.Router();
const {generateSMS} = require('../controllers/aiController');

router.post('/sms/generate', generateSMS);

module.exports = router;