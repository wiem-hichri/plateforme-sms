const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../middlewares/authMiddleware');
const { 
    smsCount,
    insertSMS,
    getSMSFloat,
    getSMSORFloat,
    deleteSMS,
    smsSent,
    insertDirectSent,
    getSMSESP32,
    smsSentESP32
} = require('../controllers/smsController');

router.get('/count', smsCount);
router.post('/insert', insertSMS);
router.get('/recentFloat', getSMSFloat);
router.get('/recentORFloat', getSMSORFloat);
router.post('/delete', deleteSMS);  
router.post('/sent', smsSent);
// *** ESP32****
router.get('/recentESP32',getSMSESP32);
router.post('/sentESP32', smsSentESP32);



module.exports = router;