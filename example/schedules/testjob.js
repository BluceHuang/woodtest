
const {Model, error, email, DataTypes, catchErr} = require('../../index')

exports.schedule = {
  //start: 
  //end:
  rule: '*/5 * * * * *',
  // interval: '1h',
  // immediate: true,
};

exports.task = async function (ctx) {
  console.log("this is a timer schedule");
  let result = await catchErr(Model('test.pub').findOne());
  console.log(result.data);
};