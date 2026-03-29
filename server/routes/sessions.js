const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  createRequest, getRequests, acceptRequest, rejectRequest,
  getSession, getUserSessions, startSession, completeSession,
} = require('../controllers/sessionController');

router.post('/request', auth, createRequest);
router.get('/requests', auth, getRequests);
router.put('/request/:id/accept', auth, acceptRequest);
router.put('/request/:id/reject', auth, rejectRequest);
router.get('/my', auth, getUserSessions);
router.get('/:id', auth, getSession);
router.put('/:id/start', auth, startSession);
router.put('/:id/complete', auth, completeSession);

module.exports = router;
