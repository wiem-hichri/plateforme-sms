const express = require('express');
const { createModel, getAllModels, getModelById, updateModel, deleteModel, generateSMS, sendMessageToGroup, sendConfidentialMessage } = require('../controllers/modelController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/models/', createModel);
router.get('/models/', getAllModels);
router.get('/models/:id', getModelById);
router.put('/models/:id', updateModel);
router.delete('/models/:id', deleteModel);
router.post("/models/generate-sms", generateSMS);
router.post("/models/group/:groupId", sendMessageToGroup);
router.post("/models/messageConfidentiel/:modeleId", upload.single('file'), sendConfidentialMessage);





module.exports = router;
