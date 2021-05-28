const mysql = require('mysql')

//数据库配置
const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '774332622lzq',
  database: 'invoicedb',
  timezone: '08:00'
}
//连接数据库，使用mysql的连接池连接方式
const pool = mysql.createPool(config)

module.exports = {
  config: config,
  sqlConnect: function (sql, callBack) {
    pool.getConnection((err, conn) => {
      console.log('pool.getConnection...')
      if (err) {
        console.log('连接失败')
      } else {
        //事件驱动回调
        conn.query(sql, callBack)
        //释放连接
        conn.release()
      }
    })
  },
  // Promise回调
  SySqlConnect: async function (sySql) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject(err)
        } else {
          //事件驱动回调
          conn.query(sySql, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
          //释放连接
          conn.release()
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }
}