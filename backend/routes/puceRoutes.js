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


router.post('/addpuce', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), createPuce);
router.get('/puces', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), getPuces);
router.get('/puces/:id', isAuthentificated,checkRole('super-administrateur', 'Administrateur'), getPuceById);
router.put('/puces/:id', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), updatePuce);
router.delete('/puces/:id', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), deletePuce);
router.post('/assign-puceToContact', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), assignPuceToContact);
router.post('/unassign-puceFromContact', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), unassignPuceFromContact);
router.post('/assign-puceToMission', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), assignPuceToMission);
router.post('/unassign-puceFromMission', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), unassignPuceFromMission);

router.get('/contacts', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), getContacts);
router.get('/missions', isAuthentificated, checkRole('super-administrateur', 'Administrateur'), getMissions);

module.exports = router;
