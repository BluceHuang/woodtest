/**
 * 日志服务
 */
exports.log = {
  package: 'wood-log',
  enable: true,
  config: {
    cluster: {
      appenders: {
        normal: {
          type: 'dateFile',
          filename: '/data/logs/activity.log',
          pattern: "-yyyy-MM-dd",
          alwaysIncludePattern: true
        }
      },
      categories: {
        default: {
          appenders: ['normal'],
          level: 'trace'
        }
      }
    },

    single: {
      appenders: {
        normal: {
          type: 'dateFile',
          filename: 'logs/activity.log',
          pattern: "-yyyy-MM-dd",
          alwaysIncludePattern: true
        },
        console: {
          type: 'console'
        }
      },
      categories: {
        default: {
          appenders: [
            'console', 'normal'
          ],
          level: 'trace'
        }
      }
    }
  }
}

/**
 * 工具库
 */
exports.util = {
  package: 'wood-util',
  enable: true
}

/**
 *  邮件
 */
exports.email = {
  enable: true,
  package: 'wood-email',
  /*
  user 		// username for logging into smtp
	password // password for logging into smtp
	host		// smtp host
	port		// smtp port (if null a standard port number will be used)
	ssl		// boolean or object {key, ca, cert} (if true or object, ssl connection will be made)
	tls		// boolean or object (if true or object, starttls will be initiated)
	timeout	// max number of milliseconds to wait for smtp responses (defaults to 5000)
	domain	// domain to greet smtp with (defaults to os.hostname)
  authentication // array of preferred authentication methods ('PLAIN', 'LOGIN', 'CRAM-MD5', 'XOAUTH2')
  logger // override the built-in logger (useful for e.g. Azure Fun
  */
  config: {
    username: 'nx0105',
    password: 'huicui19',
    host: 'smtp.163.com',
    sender: 'nx0105@163.com',
    ssl: true
 }
}


/**
 * 查询条件对象
 */
exports.query = {
  package: 'wood-query',
  enable: true
}

exports.query = {
  package: 'wood-querysql',
  enable: false
}

exports.redisconnect = {
  package: 'wood-redis/connect',
  enable: true,
  config: {
    test: {
      port: 6379,
      host: '127.0.0.1',
      dbnum: 10
    }
  }
}

/**
 * redis
 */
exports.redis = {
  package: 'wood-redis',
  enable: true,
}

exports.mysqlconnect = {
  package: 'wood-mysql/connect',
  enable: true,
  config: {
    test: {
      database: 'test',
      host: '10.0.1.26',
      port: '3306',
      user: 'hy',
      password: 'HYtest123@',
      pool: {
        max: 5,
        min: 0,
        idle: 1000
      }
    }
  }
}

/**
 * mysql
 */
exports.mysql = {
  package: 'wood-mysql',
  enable: true,
  config: {
    test: {
      host: '10.0.1.26',
      port: '3306',
      user: 'hy',
      password: 'HYtest123@'
    }
  }
}
/**
 * mongo
 */
// exports.mongo = {
//   package: 'wood-mongo',
//   enable: false
// }
// exports.mongoconnect = {
//   package: 'wood-mongo/connect',
//   enable: false,
//   config: {
//     // master: 'mongodb://127.0.0.1:27017/test',
//     master: 'mongodb://10.0.1.26:51801,10.0.1.26:51802,10.0.1.26:51803,10.0.1.26:51804/test?replicaSet=rs0&readPreference=secondaryPreferred',
//     // master: {
//     //   dbName: 'test',
//     //   host: ['10.0.1.26:51801','10.0.1.26:51802','10.0.1.26:51803','10.0.1.26:51804'],
//     //   port: '',
//     //   user: '',
//     //   password: '',
//     //   replset: 'rs0',
//     //   readPreference: 'secondaryPreferred'
//     // },
//     slave1: 'mongodb://127.0.0.1:27017/test',
//   }
// }
/**
 * 跨域处理
 */
exports.crossdomain = {
  package: 'wood-crossdomain',
  enable: true
}
/**
 * 输出结果格式化
 */
exports.responseformat = {
  package: 'wood-responseformat',
  enable: true
}
/**
 * 请求数据体
 */
exports.requestbody = {
  package: 'wood-requestbody',
  enable: true
}
/**
 * tcp
 */
exports.tcp = {
  package: 'wood-tcp',
  enable: true,
  config: {}
}
/**
 * token
 */
exports.token = {
  package: 'wood-token',
  enable: true,
  config: {}
}
/**
 * 数据字段
 */
exports.fields = {
  package: 'wood-fields',
  enable: true
}
/**
 * 数据模型
 */
// exports.model = {
//   package: 'wood-model',
//   enable: false
// }

exports.model = {
  package: 'wood-model-sql',
  enable: true
}
/**
 * 控制器
 */
exports.controller = {
  package: 'wood-controller',
  enable: true
}
/**
 * 路由
 */
exports.router = {
  package: 'wood-router',
  enable: true
}
/**
 * 模块加载器
 */
exports.moduleloader = {
  package: 'wood-module-loader',
  enable: true,
  config: {
    //默认注册模块目录
    route: '../../routes',
    model: '../../models',
    controller: '../../controllers'
  }
}
/**
 * 生成接口文档
 */
exports.apidocs = {
  package: 'wood-apidocs',
  enable: true,
  config: {}
}
/**
 * 异常捕获
 */
exports.onerror = {
  package: 'wood-onerror',
  enable: true
}
/**
 * http服务
 */
exports.httpserver = {
  package: 'wood-httpserver',
  enable: true,
  config: {
    http: {
      port: 3004
    },
    // https: {
    //   port: 443,
    //   options: {}
    // },
  }
}

exports.io = {
  enable: false,
  package: 'wood-socket.io',
  init: {},
  namespace: {
    '/': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
  },
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
};