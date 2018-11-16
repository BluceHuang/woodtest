// 关系型数据模型基类
// by YuRonghui 2018-7-10
const Redis = require('./redis');
const Mysql = require('./mysql');
const Util = require('./util');
const cluster = require('cluster');
const {
  error,
  catchErr,
  isEmpty,
  getListKey
} = Util;
let largelimit = 20000; //限制不能超过2万条数据返回

class Model {
  constructor(data, opts = {}) {
    this.tableName = opts.tableName || '';
    this.fields = opts.fields || {};
    this.select = opts.select || {};
    this.relation = {};
  }

  // 设置getter和setter
  _get_set() {
    let obj = {}, fieldMap = this.fields.fieldMap;
    for (let key in fieldMap) {
      obj[key] = {
        get() {
          if (CONFIG.isDebug) console.warn(`getter: ${key}`);
          return fieldMap[key].value || fieldMap[key].defaultValue;
        },
        set(val) {
          if (CONFIG.isDebug) console.warn(`setter: ${key}, ${val}`);
          fieldMap[key].value = val;
        }
      }
    }
    return obj;
  }

  _init() {
    let fields = this.fields.data || {};
    for (let key in fields) {
      let item = fields[key];
      if (key == '_id') continue;
      // 建索引
      if (item.index) {
        if(cluster.worker == null || CONFIG.service.initloop.workerid == cluster.worker.id){
          let indexField = {};
          indexField[key] = item.index == 'text' ? item.index : 1 ;
          this.db.index(indexField);
        }
      }
      //表关联
      if (item.key && item.as && item.from) {
        if (item) {
          this.relation[key] = item;
        }
      }
    }
    return Object.create(this, this._get_set());
  }

  // 设置数据
  setData(target, value) {
    this.fields.setData(target, value);
  }

  // 获取模型数据
  getData(hasVirtualField = true) {
    return this.fields.getData(hasVirtualField);
  }

  // 重置数据
  resetData() {
    this.fields.resetData();
  }

  // 是否新的
  isNew() {
    return !this.id;
  }

  //新增数据
  async create(data, addLock = true, hascheck = true, timeout = 1) {
    if (!data) throw error('create方法的参数data不能为空');
    if (CONFIG.isDebug) console.warn('新增记录');
    let hasId = false;
    if(Array.isArray(data)){
      hasId = !!data.find(item => item.id);
    }else{
      hasId = !!data.id;
    }
    if (!hasId) {    
        data = Array.isArray(data) ? data : [data];
        let newData = [];        
        data.forEach(item => {
          this.setData(item);
          let err = hascheck ? this.fields.validate() : false;
          if (err) throw error(err);
          newData.push(this.getData());
        });

        const lock = addLock ? await catchErr(this.redis.lock(timeout)) : {data: 1};
        if (lock.data) {     
          const result = await catchErr(this.db.insert(newData));
          if(addLock) this.redis.unlock(lock.data);
          if (result.data){
            return result.data;
          }else{
          throw error(result.err);
        }
      }else{
        throw error(lock.err);
      }
    }else{
      throw error('新增数据不能包含id');
    }
  }

  // 更新数据
  async update(data = {}, addLock = true, hascheck = true) {
    if (!data) throw error('update方法的参数data不能为空');
    if(!isEmpty(data)) this.setData(data);
    if (!this.isNew() || data.id) {
      let err = hascheck ? this.fields.validate() : false,
        id = this.id || data.id;
      if (err) {
        throw error(err);
      } else {
        let lock = addLock ? await catchErr(this.redis.lock()) : {data: 1};
        if (lock.data) {
          delete data.id;
          const result = await catchErr(this.db.update({where:id, data}));
          if(addLock) this.redis.unlock(lock.data);
          if (result.data){
            return result.data;
          }else{
            throw error(result.err);
          }
        }else{
          throw error(isLock.err);
        }
      }
    }
    throw error(false);
  }

  // 保存数据
  async save() {
    let data = this.getData(false);
    if (isEmpty(data) || !data) throw error('save方法的data为空');
    if (!this.isNew() || data.id) {
      const updateOk = await catchErr(this.update({}));
      if (updateOk.err) throw error(updateOk.err);
      return updateOk.data;
    } else {
      const result = await catchErr(this.create({}));
      if (result.err) throw error(result.err);
      return result.data;
    }
  }

  //删除数据
  async remove(data) {
    if (!data) return false;
    const lock = await catchErr(this.redis.lock());
    if (lock.data) {
      let result = await this.db.delete(data);
      this.redis.unlock();
      if (result.err) {
        throw error(result.err);
      }
    }else{
      throw error(lock.err);
    }
  }

  //清空数据
  async clear() {
    const lock = await catchErr(this.redis.lock());
    if (lock.data) {
      return this.db.drop();
    }else{
      throw error(lock.err);
    }
  }

  // 计算总记录数
  async count(body = {}, noCatch = true) {
    if (!body.data) throw error('count方法参数data不能为空');
    const result = await catchErr(this.getQuery(body, false));
    if (result.data) {
      let query = result.data;
      let theKey = query.listKey + '_count',
        count = 0,
        timeout = 60 * 1, //5分钟
        hasKey = await this.redis.existKey(theKey);
      if (hasKey && noCatch) {
        await this.redis.delKey(theKey); //删除已有的key
        hasKey = false;
      }
      if (hasKey && !noCatch) {
        if (CONFIG.isDebug) console.warn('已有count');
        let arr = await this.redis.listSlice(theKey, 0, 1);
        if (arr.length) count = arr[0];
      } else {
        if (CONFIG.isDebug) console.warn('没有count');
        if (query.hasKey && !noCatch) {
          count = await this.redis.listCount(query.listKey);
        } else {
          query.select(['count(*)']);
          let countObj = await this.db.execute(query);
          count = countObj[0]['count(*)'];
        }
        this.redis.listPush(theKey, [count]);
        this.redis.setKeyTimeout(theKey, timeout);
      }
      return Number(count);
    } else {
      throw error(result.err);
    }
  }

  // 查询条件对象
  async getQuery(opts = {}, clearListKey) {
    let body = Util.deepCopy(opts),
      params = this.parseParams(body),
      limit = params.limit == undefined ? 20 : Number(params.limit),
      page = params.page || 1,
      where = params.where || {},
      order = params.order || ['id desc'],
      largepage = params.largepage || 1;
    page = page % Math.ceil(largelimit / limit) || 1;
    let listKey = await Util.getListKey(body); //生成listkey
    let hasKey = await this.redis.existKey(listKey); //key是否存在
    if (clearListKey && hasKey) {
      await this.redis.delKey(listKey); //删除已有的key
      hasKey = false;
    }
    if (hasKey) {
      let startIndex = (page - 1) * limit;
      where.id = await this.redis.listSlice(listKey, startIndex, startIndex + limit - 1);
      where.id = where.id.map(item => parseInt(item));
    }
    let query = this.db.query().where(where);
    query.listKey = listKey;
    query.hasKey = hasKey;
    let obj = {};
    for (let key in where) {
      if (!this._options.fields[key]) continue;
      if (Array.isArray(where[key])) {
        obj[key] = {
          $in: where[key]
        };
      } else {
        obj[key] = where[key];
      }
    }
    query.where(obj).order(order);
    return query;
  }

  // 查询单条记录
  async queryOne(data, addLock = true) {
    if (!body) throw error('queryOne方法参数data不能为空');
    const hasLock = addLock ? await catchErr(this.redis.hasLock()) : {data: 0};
    if(hasLock.err){
      throw error(hasLock.err);
    }else{
      if (!hasLock.data) {
        let query = this.db.query().select(!Util.isEmpty(this._options.select) ? this._options.select : []);
        if (typeof data == 'number') {
          query.where({
            id: data
          });
        } else if (typeof data == 'object') {
          query.where(data);
        }
        let result = await this.db.execute(query);
        return Array.isArray(result) ? result[0] : {};
      } else {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
          }, 500);
        });
        return this.queryOne(data, addLock);
      }
    }
  }

  // 查询数据列表
  async queryList(body = {}, noCatch = true, addLock = true) {
    let hasLock = addLock ? await catchErr(this.redis.hasLock()) : {data: 0};
    if(hasLock.err){
      throw error(hasLock.err);
    }else{
      if (!hasLock.data) {
        if (!body.data) throw error('queryList方法参数data不能为空');
        let timeout = 60 * 1; //半小时
        const result = await catchErr(this.getQuery(body, noCatch));
        if (result.data) {
          let query = result.data.select(!Util.isEmpty(this._options.select) ? this._options.select : []);
          if (CONFIG.isDebug) console.warn(`请求列表, ${query.hasKey ? '有' : '无'}listKey`);
          const docsResult = await catchErr(this.db.execute(query));
          if (docsResult.data) {
            let docs = docsResult.data;
            // 缓存id
            if (!query.hasKey && docs.length) {
              if (docs.length >= largelimit) {
                body.data.largepage = body.data.largepage || 1;
                let startNum = (body.data.largepage - 1) * largelimit;
                docs = docs.slice(startNum, startNum + largelimit);
              }
              await this.redis.listPush(query.listKey, docs.map(item => item.id));
              this.redis.setKeyTimeout(query.listKey, timeout); //设置listkey一小时后过期
              return this.queryList(body, false, addLock);
            } else {
              return docs;
            }
          } else {
            throw error(docsResult.err);
          }
        } else {
          throw error(result.err);
        }
        return [];
      }else{
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
          }, 500);
        });
        return this.queryList(body, noCatch, addLock);
      }
    }
  }
}

module.exports = Model;
