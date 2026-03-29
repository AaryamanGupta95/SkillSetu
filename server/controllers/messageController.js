const { Message, Session, User } = require('../models');

const getMessages = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.mentorId !== req.userId && session.learnerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.findAll({
      where: { sessionId: req.params.sessionId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'fullName', 'profilePicture'], required: false }],
      order: [['createdAt', 'ASC']],
    });
    res.json({ messages });
  } catch (error) {
    console.error('GetMessages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sessionId, content, type, fileUrl } = req.body;
    const session = await Session.findByPk(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.mentorId !== req.userId && session.learnerId !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    const message = await Message.create({
      sessionId, senderId: req.userId, content, type: type || 'text', fileUrl: fileUrl || null,
    });
    const sender = await User.findByPk(req.userId, { attributes: ['id', 'fullName', 'profilePicture'] });
    res.status(201).json({ message: { ...message.toJSON(), sender } });
  } catch (error) {
    console.error('SendMessage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, sendMessage };
