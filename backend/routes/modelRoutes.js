const express = require('express');
const { createModelSMS, getAllModels, getAllModelsByUser, updateModelSMS, deleteModelSMS, generateSMS, sendMessageToGroup, sendConfidentialMessage } = require('../controllers/modelController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');

// Standard SMS model routes
router.post('/models', isAuthentificated, checkRole('super-administrateur', 'administrateur', 'utilisateur'), createModelSMS);
router.get('/models', isAuthentificated, checkRole('super-administrateur', 'administrateur', 'utilisateur'), getAllModels);
router.put('/models/:id', isAuthentificated, checkRole('super-administrateur', 'administrateur', 'utilisateur'), updateModelSMS);
router.delete('/models/:id', isAuthentificated, checkRole('super-administrateur', 'administrateur', 'utilisateur'), deleteModelSMS);
router.post("/models/generate-sms", checkRole('super-administrateur', 'administrateur', 'utilisateur'), generateSMS);
router.post("/models/group/:groupId", checkRole('super-administrateur', 'administrateur', 'utilisateur'), sendMessageToGroup);

// Confidential SMS routes - Fixed the route with missing forward slash
router.post("/models/messageConfidentiel/:modeleId/:groupId", upload.single('file'), sendConfidentialMessage);
router.post("/models/messageConfidentiel/:modeleId", upload.single('file'), sendConfidentialMessage);

module.exports = router;