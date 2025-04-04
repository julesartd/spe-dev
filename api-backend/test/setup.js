const { sequelize } = require('../config/database-test'); 

before(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    await sequelize.sync({ force: true }); 
});

after(async () => {
    await sequelize.close(); 
});