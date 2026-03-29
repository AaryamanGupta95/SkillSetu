const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);

module.exports = router;
