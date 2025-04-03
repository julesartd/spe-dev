const { faker } = require('@faker-js/faker');
const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');
const Product = require('./models/product');
const User = require('./models/user');


const createUsers = async () => [
  {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: "user1@mail.com",
    password: "Password123*",
  },
  {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: "user2@mail.com",
    password: "Password123*",
  },
];

const createProductsForUser = (userId) =>
  Array.from({ length: 5 }).map(() => ({
    libelle: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    prix: parseFloat(faker.commerce.price()),
    categorie: faker.commerce.department(),
    images: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
    ],
    userId,
  }));

const resetDatabaseAndInsertData = async () => {
  try {
  
    console.log('Suppression de toutes les tables...');
    await sequelize.drop();
    console.log('Toutes les tables ont été supprimées.');

    console.log('Synchronisation des modèles...');
    await sequelize.sync({ force: true });
    console.log('Les modèles ont été synchronisés.');

    const users = await User.bulkCreate(await createUsers(), {
      validate: true,
      individualHooks: true
    });
    
    console.log('2 utilisateurs fictifs insérés dans la base de données');

    const productPromises = users.map((user) =>
      Product.bulkCreate(createProductsForUser(user.id))
    );

    await Promise.all(productPromises);
    users.forEach((user) =>
      console.log(`5 produits fictifs insérés pour l'utilisateur avec l'ID ${user.id}`)
    );

    console.log('Réinitialisation et insertion des données terminées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la base de données :', error);
  }
};

resetDatabaseAndInsertData();