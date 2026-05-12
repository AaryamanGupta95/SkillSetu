const sequelize = require('./config/database');
const models = require('./models');

const resetDatabase = async () => {
  try {
    console.log('Dropping all tables and recreating them...');
    await sequelize.sync({ force: true });
    console.log('Database reset complete. All data has been deleted.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
