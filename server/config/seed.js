const bcrypt = require('bcryptjs');
const { User, Skill, UserSkill, Wallet, Badge } = require('../models');

const seedDatabase = async () => {
  try {
    // Seed Skills
    await Skill.bulkCreate([
      { name: 'JavaScript', category: 'Programming', icon: '💛' },
      { name: 'Python', category: 'Programming', icon: '🐍' },
      { name: 'React', category: 'Frontend', icon: '⚛️' },
      { name: 'Node.js', category: 'Backend', icon: '🟢' },
      { name: 'DSA', category: 'Computer Science', icon: '🧮' },
      { name: 'Machine Learning', category: 'AI/ML', icon: '🤖' },
      { name: 'UI/UX Design', category: 'Design', icon: '🎨' },
      { name: 'Database Design', category: 'Backend', icon: '🗄️' },
      { name: 'DevOps', category: 'Infrastructure', icon: '🔧' },
      { name: 'System Design', category: 'Architecture', icon: '🏗️' },
      { name: 'TypeScript', category: 'Programming', icon: '💙' },
      { name: 'Java', category: 'Programming', icon: '☕' },
      { name: 'Cloud Computing', category: 'Infrastructure', icon: '☁️' },
      { name: 'Data Science', category: 'AI/ML', icon: '📊' },
      { name: 'Cybersecurity', category: 'Security', icon: '🔒' },
    ], { ignoreDuplicates: true });

    // Seed Badges
    await Badge.bulkCreate([
      { name: 'First Session', description: 'Complete your first session', icon: '🌟', criteria: 'sessions_completed', threshold: 1 },
      { name: 'Dedicated Learner', description: 'Complete 5 sessions', icon: '📚', criteria: 'sessions_completed', threshold: 5 },
      { name: 'Session Master', description: 'Complete 20 sessions', icon: '🏅', criteria: 'sessions_completed', threshold: 20 },
      { name: 'Rising Star', description: 'Achieve 4.0+ rating', icon: '⭐', criteria: 'average_rating', threshold: 4 },
      { name: 'Top Rated', description: 'Achieve 4.8+ rating', icon: '💫', criteria: 'average_rating', threshold: 5 },
      { name: 'Teacher', description: 'Teach for 10+ hours', icon: '👨‍🏫', criteria: 'hours_taught', threshold: 10 },
      { name: 'Master Teacher', description: 'Teach for 50+ hours', icon: '🎓', criteria: 'hours_taught', threshold: 50 },
      { name: 'On Fire', description: '7-day streak', icon: '🔥', criteria: 'streak', threshold: 7 },
      { name: 'Unstoppable', description: '30-day streak', icon: '💪', criteria: 'streak', threshold: 30 },
      { name: 'Reputation Builder', description: 'Reach 100 reputation', icon: '🏆', criteria: 'reputation', threshold: 100 },
    ], { ignoreDuplicates: true });

    // Seed Admin
    const adminPass = await bcrypt.hash('admin123', 10);
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@skillsetu.com' },
      defaults: {
        fullName: 'Admin',
        email: 'admin@skillsetu.com',
        password: adminPass,
        role: 'admin',
        isVerified: true,
        bio: 'Platform Administrator',
        credits: 9999,
      },
    });
    await Wallet.findOrCreate({ where: { userId: admin.id }, defaults: { balance: 9999 } });

    // Seed Demo Mentor
    const mentorPass = await bcrypt.hash('mentor123', 10);
    const [mentor] = await User.findOrCreate({
      where: { email: 'mentor@skillsetu.com' },
      defaults: {
        fullName: 'Arjun Sharma',
        email: 'mentor@skillsetu.com',
        password: mentorPass,
        role: 'mentor',
        isVerified: true,
        bio: 'Full-stack developer with 5+ years experience. Teaching JavaScript, React, and System Design.',
        averageRating: 4.8,
        reputationScore: 250,
        sessionsCompleted: 25,
        totalHoursTaught: 50,
        level: 6,
        credits: 500,
        skillsOffered: 'JavaScript,React,Node.js,System Design',
        skillsWanted: 'Machine Learning,Data Science',
      },
    });
    await Wallet.findOrCreate({ where: { userId: mentor.id }, defaults: { balance: 500, totalEarned: 400 } });

    // Seed Demo User
    const userPass = await bcrypt.hash('user123', 10);
    const [demoUser] = await User.findOrCreate({
      where: { email: 'user@skillsetu.com' },
      defaults: {
        fullName: 'Priya Patel',
        email: 'user@skillsetu.com',
        password: userPass,
        role: 'user',
        bio: 'CS student eager to learn web development and DSA.',
        averageRating: 4.2,
        reputationScore: 50,
        sessionsCompleted: 3,
        level: 2,
        credits: 100,
        skillsOffered: 'Python',
        skillsWanted: 'React,DSA',
      },
    });
    await Wallet.findOrCreate({ where: { userId: demoUser.id }, defaults: { balance: 100 } });

    // Seed Recruiter
    const recruiterPass = await bcrypt.hash('recruiter123', 10);
    const [recruiter] = await User.findOrCreate({
      where: { email: 'recruiter@skillsetu.com' },
      defaults: {
        fullName: 'HR Manager',
        email: 'recruiter@skillsetu.com',
        password: recruiterPass,
        role: 'recruiter',
        bio: 'Talent acquisition specialist',
        credits: 0,
      },
    });
    await Wallet.findOrCreate({ where: { userId: recruiter.id }, defaults: { balance: 0 } });

    // Additional demo users for marketplace
    const extraPass = await bcrypt.hash('demo123', 10);
    const additionalUsers = [
      { fullName: 'Rahul Kumar', email: 'rahul@example.com', bio: 'Backend developer specializing in Node.js', isVerified: true, role: 'mentor', averageRating: 4.5, reputationScore: 180, sessionsCompleted: 15, level: 4, skillsOffered: 'Node.js,Database Design,Java', skillsWanted: 'React' },
      { fullName: 'Sneha Gupta', email: 'sneha@example.com', bio: 'UI/UX designer with Figma expertise', isVerified: true, role: 'mentor', averageRating: 4.9, reputationScore: 300, sessionsCompleted: 30, level: 7, skillsOffered: 'UI/UX Design,Figma', skillsWanted: 'Python' },
      { fullName: 'Vikram Singh', email: 'vikram@example.com', bio: 'ML engineer exploring deep learning', isVerified: false, role: 'user', averageRating: 3.8, reputationScore: 40, sessionsCompleted: 4, level: 1, skillsOffered: 'Python,Machine Learning', skillsWanted: 'DevOps' },
      { fullName: 'Ananya Reddy', email: 'ananya@example.com', bio: 'DevOps enthusiast', isVerified: false, role: 'user', averageRating: 4.0, reputationScore: 60, sessionsCompleted: 6, level: 2, skillsOffered: 'DevOps,Cloud Computing', skillsWanted: 'JavaScript' },
      { fullName: 'Karthik Nair', email: 'karthik@example.com', bio: 'Cybersecurity analyst', isVerified: true, role: 'mentor', averageRating: 4.7, reputationScore: 220, sessionsCompleted: 22, level: 5, skillsOffered: 'Cybersecurity,System Design', skillsWanted: 'Machine Learning' },
    ];

    for (const userData of additionalUsers) {
      const [user] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: { ...userData, password: extraPass, credits: 100 + (userData.sessionsCompleted || 0) * 10 },
      });
      await Wallet.findOrCreate({
        where: { userId: user.id },
        defaults: { balance: 100 + (userData.sessionsCompleted || 0) * 10 },
      });
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};

module.exports = seedDatabase;
