const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getWallet, spendCredits } = require('../controllers/creditController');

router.get('/', auth, getWallet);
router.post('/spend', auth, spendCredits);

module.exports = router;
