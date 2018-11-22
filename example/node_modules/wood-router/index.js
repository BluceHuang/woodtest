/**
 * Wood Plugin Module.
 * by jlego on 2018-11-17
 */
const Router = require('./src/router');

module.exports = (app, config = {}) => {
  const _routers = new Map();
  let _controllers = app.Plugin('controller')._controllers;
  app.Router = function(controllerName){
    if(_routers.has(controllerName)){
      return _routers.get(controllerName);
    } else {
      let _router = new Router(controllerName, _controllers);
      if(controllerName) _routers.set(controllerName, _router);
      return _router;
    }
  }
  app.application.use('/', app.Router().getRouter());
  if(app.addAppProp) app.addAppProp('Router', app.Router);
  return app;
}
