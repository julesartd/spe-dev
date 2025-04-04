const { sequelize } = require('../config/database');

before(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    await sequelize.sync({ force: true });
});

after(async () => {
    await sequelize.close();
});