// by YuRonghui 2018-10-19
const {Model,  error} = require('../../index');


module.exports = Model('test.user', {
  username: Model.STRING,
  birthday: Model.DATE
});

