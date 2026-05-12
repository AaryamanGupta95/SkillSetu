const { Op } = require('sequelize');
const {
  Rating, Session, User, Wallet, Transaction, Notification, Badge, UserBadge,
} = require('../models');

const submitRating = async (req, res) => {
  try {
    const { sessionId, teachingQuality, communication, helpfulness, review } = req.body;

    const session = await Session.findByPk(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status !== 'completed') return res.status(400).json({ message: 'Session must be completed before rating' });
    if (session.mentorId !== req.userId && session.learnerId !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    const ratedUserId = req.userId === session.mentorId ? session.learnerId : session.mentorId;

    const existing = await Rating.findOne({ where: { sessionId, raterId: req.userId } });
    if (existing) return res.status(400).json({ message: 'Already rated this session' });

    const overallRating = (teachingQuality + communication + helpfulness) / 3;

    // Determine rating type: mentor rating the learner or learner rating the mentor
    const isMentorRating = req.userId === session.mentorId;
    const ratingType = isMentorRating ? 'mentor_review' : 'learner_review';

    const rating = await Rating.create({
      sessionId,
      raterId: req.userId,
      ratedUserId,
      teachingQuality,
      communication,
      helpfulness,
      overallRating: Math.round(overallRating * 10) / 10,
      review: review || '',
      ratingType,
    });

    if (isMentorRating) {
      session.mentorRated = true;
    } else {
      session.learnerRated = true;
    }
    await session.save();

    // Update rated user's average rating
    const allRatings = await Rating.findAll({ where: { ratedUserId } });
    const avgRating = allRatings.reduce((sum, r) => sum + r.overallRating, 0) / allRatings.length;
    const ratedUser = await User.findByPk(ratedUserId);
    ratedUser.averageRating = Math.round(avgRating * 10) / 10;
    ratedUser.reputationScore = Math.floor(
      ratedUser.sessionsCompleted * 10 + avgRating * 20 + ratedUser.totalHoursTaught * 5
    );
    await ratedUser.save();

    const rater = await User.findByPk(req.userId, { attributes: ['fullName'] });
    await Notification.create({
      userId: ratedUserId,
      type: 'rating_received',
      title: 'New Rating Received',
      message: `${rater.fullName} rated you ${overallRating.toFixed(1)} stars`,
      linkTo: '/profile',
    });

    // ── Only the MENTOR (not the learner/requester) earns credits for rating ──
    if (isMentorRating) {
      const ratingCredits = Math.round(overallRating) * 2; // 1★=2, 2★=4, 3★=6, 4★=8, 5★=10
      let raterWallet = await Wallet.findOne({ where: { userId: req.userId } });
      if (!raterWallet) raterWallet = await Wallet.create({ userId: req.userId, balance: 150 });

      raterWallet.balance += ratingCredits;
      raterWallet.totalEarned += ratingCredits;
      await raterWallet.save();

      await Transaction.create({
        userId: req.userId,
        type: 'earned',
        amount: ratingCredits,
        description: `Feedback reward for rating session: "${session.topic}" (${Math.round(overallRating)}★)`,
        sessionId: session.id,
        balanceAfter: raterWallet.balance,
      });

      await User.increment('credits', { by: ratingCredits, where: { id: req.userId } });

      await Notification.create({
        userId: req.userId,
        type: 'credits_earned',
        title: 'Feedback Reward 💬',
        message: `You earned +${ratingCredits} credits for submitting your feedback!`,
        linkTo: '/wallet',
      });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // If both rated, distribute session credits
    await session.reload();
    if (session.mentorRated && session.learnerRated) {
      await distributeCredits(session);
    }

    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (error) {
    console.error('SubmitRating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const distributeCredits = async (session) => {
  try {
    const ratings = await Rating.findAll({ where: { sessionId: session.id } });
    const mentorRating = ratings.find(r => r.ratedUserId === session.mentorId);
    const baseCredits = Math.ceil(session.duration / 15);

    if (session.isMentorSession) {
      const mentorWallet = await Wallet.findOne({ where: { userId: session.mentorId } });
      const learnerWallet = await Wallet.findOne({ where: { userId: session.learnerId } });

      learnerWallet.locked -= session.creditsLocked;
      await learnerWallet.save();

      const mentorBonus = mentorRating && mentorRating.overallRating >= 4.5 ? Math.ceil(baseCredits * 0.25) : 0;
      const mentorEarnings = session.creditsLocked + mentorBonus;

      mentorWallet.balance += mentorEarnings;
      mentorWallet.totalEarned += mentorEarnings;
      await mentorWallet.save();

      await Transaction.create({ userId: session.mentorId, type: 'earned', amount: mentorEarnings, description: `Earned from session: ${session.topic}${mentorBonus > 0 ? ` (+${mentorBonus} bonus)` : ''}`, sessionId: session.id, balanceAfter: mentorWallet.balance });

      const learnerCredits = Math.ceil(baseCredits * 0.5);
      learnerWallet.balance += learnerCredits;
      learnerWallet.totalEarned += learnerCredits;
      await learnerWallet.save();

      await Transaction.create({ userId: session.learnerId, type: 'earned', amount: learnerCredits, description: `Participation credits for: ${session.topic}`, sessionId: session.id, balanceAfter: learnerWallet.balance });

      // Also update User.credits field
      await User.increment('credits', { by: mentorEarnings, where: { id: session.mentorId } });
      await User.increment('credits', { by: learnerCredits, where: { id: session.learnerId } });

      await Notification.bulkCreate([
        { userId: session.mentorId, type: 'credits_earned', title: 'Credits Earned!', message: `You earned ${mentorEarnings} credits from ${session.topic}`, linkTo: '/wallet' },
        { userId: session.learnerId, type: 'credits_earned', title: 'Credits Earned!', message: `You earned ${learnerCredits} participation credits`, linkTo: '/wallet' },
      ]);
    } else {
      const peerCredits = baseCredits;
      for (const userId of [session.mentorId, session.learnerId]) {
        const wallet = await Wallet.findOne({ where: { userId } });
        wallet.balance += peerCredits;
        wallet.totalEarned += peerCredits;
        await wallet.save();

        await Transaction.create({ userId, type: 'earned', amount: peerCredits, description: `Peer session credits: ${session.topic}`, sessionId: session.id, balanceAfter: wallet.balance });
        await User.increment('credits', { by: peerCredits, where: { id: userId } });
        await Notification.create({ userId, type: 'credits_earned', title: 'Credits Earned!', message: `You earned ${peerCredits} credits from peer session on ${session.topic}`, linkTo: '/wallet' });
      }
    }

    await checkBadges(session.mentorId);
    await checkBadges(session.learnerId);
    await updateStreak(session.mentorId);
    await updateStreak(session.learnerId);
  } catch (error) {
    console.error('DistributeCredits error:', error);
  }
};

const checkBadges = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    const badges = await Badge.findAll();
    for (const badge of badges) {
      const existing = await UserBadge.findOne({ where: { userId, badgeId: badge.id } });
      if (existing) continue;
      let earned = false;
      switch (badge.criteria) {
        case 'sessions_completed': earned = user.sessionsCompleted >= badge.threshold; break;
        case 'average_rating': earned = user.averageRating >= badge.threshold; break;
        case 'hours_taught': earned = user.totalHoursTaught >= badge.threshold; break;
        case 'streak': earned = user.streak >= badge.threshold; break;
        case 'reputation': earned = user.reputationScore >= badge.threshold; break;
      }
      if (earned) {
        await UserBadge.create({ userId, badgeId: badge.id });
        await Notification.create({ userId, type: 'badge_earned', title: 'Badge Earned! 🏆', message: `You earned the "${badge.name}" badge!`, linkTo: '/profile' });
      }
    }
  } catch (error) {
    console.error('CheckBadges error:', error);
  }
};

const updateStreak = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate) {
      const diffDays = Math.floor((new Date(today) - new Date(user.lastActiveDate)) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.streak += 1;
      else if (diffDays > 1) user.streak = 1;
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = today;
    user.level = Math.max(1, Math.floor(user.reputationScore / 50) + 1);
    await user.save();
  } catch (error) {
    console.error('UpdateStreak error:', error);
  }
};

const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { ratedUserId: req.params.userId },
      include: [
        { model: User, as: 'rater', attributes: ['id', 'fullName', 'profilePicture'] },
        { model: Session, attributes: ['topic'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ ratings });
  } catch (error) {
    console.error('GetUserRatings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitRating, getUserRatings };
