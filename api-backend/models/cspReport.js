const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CspReport = sequelize.define('CspReport', {
  report: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = CspReport;