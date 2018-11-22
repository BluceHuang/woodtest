/**
 * Wood Plugin Module.
 * 跨域处理
 * by jlego on 2018-11-17
 */

module.exports = (app = {}, config = {}) => {
  app.application.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", app.config.crossDomain);
    res.header("Access-Control-Allow-Headers", app.config.verifyLogin ? "Content-Type,token,secretkey" : "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
  return app;
}
