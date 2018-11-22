/**
 * Wood Plugin Module.
 * tcp类
 * by jlego on 2018-11-18
 */
const Tcp = require('./src/tcp');

module.exports = (app = {}, config = {}) => {
  app.Tcp = Tcp;
  if(app.addAppProp) app.addAppProp('Tcp', app.Tcp);
  return app;
}
