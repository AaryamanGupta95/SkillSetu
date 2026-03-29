const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { submitRating, getUserRatings } = require('../controllers/ratingController');

router.post('/', auth, submitRating);
router.get('/user/:userId', auth, getUserRatings);

module.exports = router;
