/**
 * Wood Plugin Module.
 * redis queue
 * by jlego on 2018-11-20
 */
class Queue {
  constructor(opts = {}) {
    this.redis = opts.redis;
    this.ctx = opts.ctx;
    this.options = {
      maxlen: 0, //最大长度
      ...(opts.options || {})
    };
    if(!this.redis) console.warn('Queue Redis 没找到实例');
  }

  async push(listkey, value) {
    let countResult = await this.ctx.catchErr(this.redis.listCount(listkey));
    if(countResult.err) throw this.ctx.error(countResult.err);
    if(this.options.maxlen && this.options.maxlen >= countResult.data){
      return null;
    }else{
      let result = await this.ctx.catchErr(this.redis.listPush(listkey, value));
      if(result.err) throw this.ctx.error(result.err);
      return result.data;
    }
  }

  async pop(listkey, times = 0) {
    let countResult = await this.ctx.catchErr(this.redis.listCount(listkey));
    if(countResult.err) throw this.ctx.error(countResult.err);
    if(!countResult.data) return null;
    let result = await this.ctx.catchErr(this.redis.brpop(listkey, times));
    if(result.err) throw this.ctx.error(result.err);
    return result.data;
  }
}
module.exports = Queue;
