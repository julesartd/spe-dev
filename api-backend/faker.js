const { faker } = require('@faker-js/faker');
const { sequelize } = require('./config/database');
const Product = require('./models/product');

async function generateFakeProducts(numProducts) {
  const fakeProducts = [];

  for (let i = 0; i < numProducts; i++) {
    const product = {
      libelle: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      prix: parseFloat(faker.commerce.price()),
      categorie: faker.commerce.department(),
      images: [
        faker.image.url(),
        faker.image.url(),
        faker.image.url(),
      ],
    };

    fakeProducts.push(product);
  }

  await Product.bulkCreate(fakeProducts);
  console.log(`${numProducts} produits fictifs insérés dans la base de données`);
}

sequelize.sync().then(() => {
  generateFakeProducts(10).catch(error => console.error(error));
});
