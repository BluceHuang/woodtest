const {
  Controller,
  Model,
  catchErr,
  Util,
  error
} = require('../../index');

//const {error, catchErr} = Util;

const controller = Controller();

class PubController extends controller {
  // 添加用户
  async add(req, res, next) {
    let params = Util.getParams(req);
    if (!params.data.uid) {
      res.print('uid不能为空');
      return;
    }
    let Pub = Model('test.pub');
    const hasOne = await catchErr(Model('test.pub').findOne({ name: params.data.name }));
    if (hasOne.err) {
      res.print(hasOne);
    } else {
      let oper = !hasOne.data || Util.isEmpty(hasOne.data) ? 'create' : 'update',
        data = params.data;
      if (hasOne.data && !Util.isEmpty(hasOne.data)) {
        data = Object.assign(hasOne.data, params.data);
      }
      const result = await catchErr(Model('test.pub')[oper](data));
      res.print(result);
    }
  }
}

module.exports = new PubController({
  defaultModel: 'pub'
});
