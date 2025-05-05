const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../middlewares/authMiddleware');
const { smsCount,
    insertSMS,
    getSMSFloat,
    getSMSORFloat,
    deleteSMS,
    smsSent} = require('../controllers/smsController');

router.get('/count', smsCount);
router.post('/insert',  insertSMS);
router.get('/recentFloat', getSMSFloat);
router.get('/recentORFloat', getSMSORFloat);
router.delete('/delete', deleteSMS);
router.post('/sent', smsSent)

module.exports = router;
