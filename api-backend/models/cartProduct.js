const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CartProduct = sequelize.define('CartProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cartId: {
    type: DataTypes.INTEGER,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { timestamps: false });

module.exports = CartProduct;
