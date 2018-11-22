/**
 * Wood Plugin Module.
 * token
 * by jlego on 2018-11-18
 */
const Token = require('./src/token');

module.exports = (app = {}, config = {}) => {
  app.Token = Token;
  if(app.addAppProp) app.addAppProp('Token', app.Token);
  return app;
}
