const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données de test réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données de test:', error);
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
};