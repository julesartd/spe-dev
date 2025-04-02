const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');

const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' }
    }
}, { timestamps: true });

module.exports = Cart;
