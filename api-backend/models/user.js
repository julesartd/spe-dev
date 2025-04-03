const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const passwordValidator = require('owasp-password-strength-test');

passwordValidator.config({
    minLength: 12,
    maxLength: 128,
    minOptionalTestsToPass: 3
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'L\'email doit être valide'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [12, 128],
                msg: 'Le mot de passe doit contenir entre 12 et 128 caractères'
            },

            strongPassword(value) {
                const result = passwordValidator.test(value);
                if (result.errors.length > 0) {
                    throw new Error(`Mot de passe trop faible : ${result.errors.join(', ')}`);
                }
            }
        }
    }
});


User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

module.exports = User;
