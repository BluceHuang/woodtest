// mysql操作方法类
// by YuRonghui 2018-7-9
const Query = require('./querysql');
const mysql = require('mysql2/promise');
const {
  error,
  catchErr
} = Util;
let dbs = {};

class Mysql {
  constructor(tbname, database = 'master') {
    this.tableName = tbname;
    this.database = database;
    if (!dbs[this.database]) {
      throw error(`mysql don't connected ${database}`);
    }
    this.conn = dbs[this.database];
  }
  // 创建数据库连接池
  static async connect(dbName, opts = {}) {
    opts.database = dbName;
    if (dbs[dbName]) return dbs[dbName];

    let result = await catchErr(mysql.createConnection(opts));
    if (result.err) {
      console.log(`Mysql ${dbName} connect fail`);
      return "";
    } else {
      dbs[dbName] = result.data;
      console.log(`Mysql ${dbName} connected Successfull`);
      return dbName;
    }
  }

  // 获取连接
  getConn(database) {
    return dbs[database || this.database];
  }
  // 创建表
  async createTable(opts = {}) {
    const { fields, tableName } = opts;
    if (typeof tableName === 'undefined' || typeof fields === 'undefined') {
      throw error("parameters invalid, can't create table");
    }
    for (let key in fields) {
      if (fields[key].type === 'datetime') {
        fields[key].default = `'${fields[key].default}'`;
      }
    }
    let [sqlStr, values] = Query.getQuery().create({tableName, fields}),
      fieldsArr = Object.values(fields);
    fieldsArr.forEach(item => {
      let length = item.length;
      if (length !== undefined) {
        sqlStr = sqlStr.replace(/\s+(int|char|varchar|float)\s+/, ` $1(${Array.isArray(length) ? length.join(',') : length}) `);
      }
    });
    sqlStr += ' default charset=utf8;'
    let result = await this.conn.execute(sqlStr);
    if (result.err) {
      throw error(result.err);
    } else {
      return result.data;
    }
  }
  // 清除表
  async dropTable() {
    let result = await this.conn.execute(`drop table if exists \`${this.tableName}\`;`);
    if (result.err) {
      throw error(result.err);
    } else {
      return result.data;
    }
  }
  // 可以自定义执行sql语句
  async execute(sql = {}) {
    console.warn(sql);
    const result = await catchErr(this.conn.execute(sql));
    if (result.err) {
      throw error(result.err);
    } else {
      return result.data;
    }
  }

  find(params = {}, limit = 1) {
    if (!params.where) params = {where:params};
    let sql = Query.getQuery(params);
    sql.select().limit(limit);
    let result = await this.conn.execute(sql.toSQL());
    if (result.err) {
      throw error(result.err);
    } else {
      return result.data;
    }
  }

  findOne(params = {}) {
    let result = await this.find(params);
    if (result.err) {
      throw error(result.err);
    } else {
      return result.data;
    }
  }

  remove(params = {}) {
    if (!params.where) params = {where:params};
    let sql = Query.getQuery(params);
    sql.delete();
    let result = await this.conn.execute(sql.toSQL());
    if (result.err) {
      throw error(result.err);
    } else {
      return result.data;
    }
  }


}

module.exports = Mysql;
