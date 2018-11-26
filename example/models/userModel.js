// by YuRonghui 2018-10-19
const {Model, error, email, DataTypes} = require('../../index')

//const { DataTypes, Op, Validator } = WOOD.Plugin('model');

module.exports = Model('test.user', {
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
});
