const { faker } = require('@faker-js/faker');
const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');
const Product = require('./models/product');
const User = require('./models/user');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const createUsers = async () => [
  {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: "user1@mail.com",
    password: await hashPassword('password123'),
  },
  {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: "user2@mail.com",
    password: await hashPassword('password123'),
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

const insertUsersAndProducts = async () => {
  const users = await User.bulkCreate(await createUsers());
  console.log('2 utilisateurs fictifs insérés dans la base de données');

  const productPromises = users.map((user) =>
    Product.bulkCreate(createProductsForUser(user.id))
  );

  await Promise.all(productPromises);
  users.forEach((user) =>
    console.log(`5 produits fictifs insérés pour l'utilisateur avec l'ID ${user.id}`)
  );
};

sequelize.sync({ force: true }).then(() => {
  insertUsersAndProducts().catch((error) => console.error(error));
});
