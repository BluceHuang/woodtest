/**
 * Wood Plugin Module.
 * redis queue
 * by jlego on 2018-11-20
 */
const Queue = require('./src/queue');

module.exports = (app = {}, config = {}) => {
  let redisPlugin = app.Plugin('redis'),
    redisDb = null;
  if(redisPlugin && redisPlugin.Redis && redisPlugin.Redis.db){
    redisDb = redisPlugin.Redis.db;
  }
  app.Queue = new Queue({redis: redisDb });
  if(app.addAppProp) app.addAppProp('Queue', app.Queue);
  return app;
}
