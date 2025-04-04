const isTestEnv = process.env.NODE_ENV === 'test';

if (isTestEnv) {
  module.exports = require('./database-test');
} else {
  const { Sequelize } = require('sequelize');
  require('dotenv').config();

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
  });

  const connectToDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données réussie.');
    } catch (error) {
      console.error('Impossible de se connecter à la base de données:', error);
    }
  };

  module.exports = {
    sequelize,
    connectToDatabase,
  };
}