/**
 * Wood Plugin Module.
 * 格式化输出结果中间件
 * by jlego on 2018-11-17
 */

module.exports = (app = {}, config = {}) => {
  app.requestbody = function(req, res, next){
    if (req.method == 'PUT') {
      if (req.body) {
        if (!req.body.data) {
          res.print(app.config.errorCode.error_body_data);
          return;
        }
      } else {
        res.print(app.config.errorCode.error_body);
        return;
      }
    }
    next();
  };
  app.application.use(app.requestbody);
  return app;
}
