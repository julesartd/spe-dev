const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 50],
        msg: 'Le libellé doit contenir entre 3 et 50 caractères',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Les images doivent être un tableau');
        }
      },
      isUrl(value) {
        value.forEach((url) => {
          if (typeof url !== 'string' || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(url)) {
            throw new Error('Chaque image doit être une URL valide');
          }
        });
      },
    },
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Le prix doit être un nombre valide',
      },
      min: {
        args: [0],
        msg: 'Le prix doit être supérieur ou égal à 0',
      },
    },
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: 'La catégorie doit contenir entre 3 et 30 caractères',
      },
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Product;
