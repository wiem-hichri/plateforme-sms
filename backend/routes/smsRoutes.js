const express = require('express');
const router = express.Router();
const { smsCount,
    insertSMS,
    getSMS,
    deleteSMS,
    smsSent} = require('../controllers/smsController');

router.get('/count', smsCount);
router.post('/insert', insertSMS);
router.get('/recent', getSMS);
router.delete('/delete', deleteSMS);
router.post('/sent',smsSent)

module.exports = router;
