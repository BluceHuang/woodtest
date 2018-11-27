/**
 * Wood Plugin Module.
 * redis queue
 * by jlego on 2018-11-20
 */
const Queue = require('./src/queue');

module.exports = (app = {}, config = {}) => {
  let _queues = new Map();
  app.Queue = function(queueName, options = {}) {
    let { Redis } = app.Plugin('redis'),
      redisDb = new Redis(queueName, options.db, app);
    if(!_queues.has(queueName)){
      _queues.set(queueName, new Queue({redis: redisDb.db, ctx: app, options }));
    }
    return _queues.get(queueName);
  }
  if(app.addAppProp) app.addAppProp('Queue', app.Queue);
  return app;
}
