const { Notification } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    const unreadCount = await Notification.count({
      where: { userId: req.userId, isRead: false },
    });
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('GetNotifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.userId, id: req.params.id } });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.userId } });
    res.json({ message: 'All marked as read' });
  } catch (error) {
    console.error('MarkAllAsRead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
