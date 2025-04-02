const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Product = require('./product');
const Cart = require('./cart');
const CartProduct = require('./cartProduct');

// Définition des relations
User.hasMany(Product, { foreignKey: 'userId', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.belongsToMany(Product, { through: CartProduct, foreignKey: 'cartId', onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartProduct, foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = {
    sequelize,
    User,
    Product,
    Cart,
    CartProduct
};