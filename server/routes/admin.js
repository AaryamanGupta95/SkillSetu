const router = require('express').Router();
const { auth, adminAuth, recruiterAuth } = require('../middleware/auth');
const { getAllUsers, getAllSessions, getAnalytics, verifyUser, deleteUser, getTopTalent, createRecruiter } = require('../controllers/adminController');

router.get('/users', auth, adminAuth, getAllUsers);
router.post('/recruiters', auth, adminAuth, createRecruiter);
router.get('/sessions', auth, adminAuth, getAllSessions);
router.get('/analytics', auth, adminAuth, getAnalytics);
router.put('/verify/:id', auth, adminAuth, verifyUser);
router.delete('/users/:id', auth, adminAuth, deleteUser);
router.get('/talent', auth, recruiterAuth, getTopTalent);

module.exports = router;
