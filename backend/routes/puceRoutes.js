const express = require('express');
const router = express.Router();
const { isAuthentificated, checkRole } = require('../middlewares/authMiddleware');
const {
  createPuce,
  getPuces,
  getPuceById,
  updatePuce,
  deletePuce,
  assignPuceToContact,
  assignPuceToMission,
  unassignPuceFromContact,
  unassignPuceFromMission,
  getContacts,  
  getMissions    
} = require('../controllers/puceController');


router.post('/addpuce', isAuthentificated, checkRole('super-administrateur', 'administrateur'), createPuce);
router.get('/puces', isAuthentificated, checkRole('super-administrateur', 'administrateur'), getPuces);
router.get('/puces/:id', isAuthentificated,checkRole('super-administrateur', 'administrateur'), getPuceById);
router.put('/puces/:id', isAuthentificated, checkRole('super-administrateur', 'administrateur'), updatePuce);
router.delete('/puces/:id', isAuthentificated, checkRole('super-administrateur', 'administrateur'), deletePuce);
router.post('/assign-puceToContact', isAuthentificated, checkRole('super-administrateur', 'administrateur'), assignPuceToContact);
router.post('/unassign-puceFromContact', isAuthentificated, checkRole('super-administrateur', 'administrateur'), unassignPuceFromContact);
router.post('/assign-puceToMission', isAuthentificated, checkRole('super-administrateur', 'administrateur'), assignPuceToMission);
router.post('/unassign-puceFromMission', isAuthentificated, checkRole('super-administrateur', 'administrateur'), unassignPuceFromMission);

router.get('/contacts', isAuthentificated, checkRole('super-administrateur', 'administrateur'), getContacts);
router.get('/missions', isAuthentificated, checkRole('super-administrateur', 'administrateur'), getMissions);

module.exports = router;
