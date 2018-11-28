// by YuRonghui 2018-10-19
const { Model, error, DataTypes } = require('../../index')

let pub = Model('test.pub', {
  name: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  latitude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 }
  },
});


module.exports = pub;