// 工具类
// by YuRonghui 2018-1-4
let Util = {
  // 唯一码
  uuid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
  // 深拷贝
  deepCopy(obj){
    let str, newobj = Array.isArray(obj) ? [] : {};
    if(typeof obj !== 'object'){
      return;
    // } else if(window.JSON){
    //   newobj = JSON.parse(JSON.stringify(obj));
    } else {
      for(let i in obj){
        newobj[i] = typeof obj[i] === 'object' && !(obj[i] instanceof Date) ? Util.deepCopy(obj[i]) : obj[i];
      }
    }
    return newobj;
  },
  // 是否空对象
  isEmpty(value){
    if(JSON.stringify(value) == '{}' || JSON.stringify(value) == '[]') return true;
    return false;
  },
  // 过滤html
  filterHtml(str){
    return str ? str.replace(/<[^>]+>/g,"") : '';
  }
};

module.exports = Util;
