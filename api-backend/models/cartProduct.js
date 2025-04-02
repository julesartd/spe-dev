const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Cart = require('./cart');
const Product = require('./product');

const CartProduct = sequelize.define('CartProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Cart, key: 'id' }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: 'id' }
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { timestamps: false });

module.exports = CartProduct;
