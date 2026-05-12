const { Op } = require('sequelize');
const { User, Achievement, Rating, Wallet, Badge, UserBadge, Certificate } = require('../models');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Achievement, as: 'achievements' },
        { model: Certificate, as: 'certificates' },
        { model: Wallet, as: 'wallet', attributes: ['balance', 'totalEarned', 'totalSpent'] },
        { model: Badge, as: 'badges', through: { attributes: [] } },
      ],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ratings = await Rating.findAll({
      where: { ratedUserId: req.params.id },
      include: [{ model: User, as: 'rater', attributes: ['id', 'fullName', 'profilePicture'] }],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });

    res.json({ user, ratings });
  } catch (error) {
    console.error('GetUserProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { skill, category, verified, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    let where = { id: { [Op.ne]: req.userId } };
    if (verified === 'true') where.isVerified = true;
    if (skill) {
      where[Op.or] = [
        { skillsOffered: { [Op.like]: `%${skill}%` } },
        { fullName: { [Op.like]: `%${skill}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['reputationScore', 'DESC'], ['averageRating', 'DESC']],
      distinct: true,
    });

    res.json({
      users: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('SearchUsers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: { role: { [Op.ne]: 'admin' } },
      order: [['reputationScore', 'DESC']],
      limit: 50,
      include: [
        { model: Badge, as: 'badges', through: { attributes: [] } },
      ],
    });
    res.json({ users });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    res.json({ totalUsers, activeProjects: 0 }); // Mocking active projects for now
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile, searchUsers, getLeaderboard, getStats };
