const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getUserProfile, searchUsers, getLeaderboard } = require('../controllers/userController');

router.get('/search', auth, searchUsers);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/:id', auth, getUserProfile);

module.exports = router;
