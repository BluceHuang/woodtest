// 关联型查询对象类
// 将json格式查询转化为sql语句，json格式需要参考mongo-sql
// by YuRonghui 2018-7-10
const mongoSQL = require('mongo-sql');
const { isEmpty } = require('./util');

class Query {
  constructor(params = {}) {
    this._isQuery = true;
    this.sql = {
      type: 'select',
      table: '',
    };

    for (item in params) {
      if (typeof this[item] === 'function') {
        this[item](params[item]);
      }
    }
  }

  create(params={}){
    let {tableName, definition, ifNotExists = true} = params;
    this.sql.type = 'create-table';
    if(tableName) this.sql.table = tableName;
    this.sql.ifNotExists = ifNotExists;
    if(definition) this.sql.definition = definition;
    return this;
  }
  drop(params={}){
    let {tableName, cascade = true, ifExists = true} = params;
    this.sql.type = 'drop-table';
    if(tableName) this.sql.table = tableName;
    this.sql.cascade = cascade;
    this.sql.ifExists = ifExists;
    return this;
  }
  table(params='tablename'){
    if(params) this.sql.table = params;
    return this;
  }
  index(name, params = {}){
    this.sql.type = 'create-index';
    if(!isEmpty(params) && name) {
      this.sql = {
        ...this.sql,
        name,
        unique: true,
        concurrently: true,
        using: 'gin(id)',
        ...params
      };
    }
    return this;
  }
  view(params = {}){
    let {name, orReplace = true, expression = {}} = params;
    let newData = {...this.sql};
    this.sql = {
      ...newData,
      type: 'create-view',
      view: name,
      orReplace,
      expression
    }
    return this;
  }
  definition(columns = {}){
    if(!isEmpty(columns)) this.sql.definition = Object.assign(this.sql.definition || {}, columns);
    return this;
  }
  alter(action = {}){
    this.sql.type = 'alter-table';
    if(!isEmpty(action)) this.sql.action = action;
    return this;
  }
  alias(val){
    if(val) this.sql.alias = val;
    return this;
  }
  expression(params = {}){
    if(!isEmpty(params)) this.sql.expression = Object.assign(this.sql.expression || {}, params);
    return this;
  }
  select(params = []) {
    this.sql.type = 'select';
    if(!isEmpty(params)) this.sql.columns = params;
    return this;
  }
  insert(params){
    this.sql.type = 'insert';
    this.values(params);
    return this;
  }
  values(params){
    if(!isEmpty(params)) {
      if(Array.isArray(params)){
        this.sql.values = params;
      }else{
        this.sql.values = Object.assign(this.sql.values || {}, params);
      }
    }
    return this;
  }
  update(params = {}) {
    this.sql.type = 'update';
    if(!isEmpty(params)) this.sql.updates = Object.assign(this.sql.updates || {}, params);
    return this;
  }
  delete(params = {}) {
    this.sql.type = 'delete';
    //if(!isEmpty(params)) this.sql.deletes = Object.assign(this.sql.deletes || {}, params);
    return this;
  }
  from(tableName=''){
    if(tableName) this.sql.from = tableName;
    return this;
  }
  join(params = []){
    if(!isEmpty(params)) this.sql.joins = params;
    return this;
  }
  withs(params = {}){
    if(!isEmpty(params)) this.sql.withs = Object.assign(this.sql.withs || {}, params);
    return this;
  }
  where(params = {}) {
    if(!isEmpty(params)) this.sql.where = Object.assign(this.sql.where || {}, params);
    return this;
  }
  columns(params = []) {
    if(!isEmpty(params)) this.sql.columns = Object.assign(this.sql.columns || {}, params);
    return this;
  }
  groupBy(params = []) {
    if(!isEmpty(params)) this.sql.groupBy = params;
    return this;
  }
  order(params=[]) {
    this.sql.order = params ? params : ['id desc'];
    return this;
  }
  limit(val=1) {
    if(val) this.sql.limit = val;
    return this;
  }
  // 返回sql语句
  toSQL(){
    let result = mongoSQL.sql(this.sql),
      str = result.toString();
    str = str.replace(/(\$\d+)/g, '?').replace(/"/g, "`").replace('insert', 'replace');
    return [str, result.values];
  }

  static getQuery(req = {}) {
    return new Query(req);
  }
}

module.exports = Query;
