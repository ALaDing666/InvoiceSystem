var dbConfig = require('../util/dbconfig')
const jwt = require('jsonwebtoken')

let verToken = (req, res) => {
  const token = req.headers.authorization
  let info = jwt.verify(token, 'Josiah', (err, data) => {
    console.log('data: ', data)
    if (err && err.message === 'invalid token') return res.json({ message: '无效 token', code: 400 })
    if (err && err.message === 'jwt expired') return res.json({ message: 'token 失效', code: 400 })
    return data
  })
  console.log('info: ', info)
  return info
}

// 获取项目组成员数
let getMemberNum = async (id) => {
  let sql = `select * from staff where group_id=${id}`
  let res = await dbConfig.SySqlConnect(sql)
  return res.length
}

// 获取项目组报销单数
let getReimNum = async (id) => {
  let sql = `select * from reimburse where group_id=${id} and status in (0,1,2)`
  let res = await dbConfig.SySqlConnect(sql)
  return res.length
}
// 获取成员报销单数
let getMemReimNum = async (id) => {
  let sql = `select * from reimburse where staff_id=${id} and status in (0,1,2)`
  let res = await dbConfig.SySqlConnect(sql)
  return res.length
}

// 获取项目组成员信息
let getMembers = async (id) => {
  let sql = `select * from staff where group_id=${id}`
  let res = await dbConfig.SySqlConnect(sql)
  for (var item of res) {
    item.reimNum = await getMemReimNum(item.id)
  }
  return res
}

// 获取项目组信息
let getGroupInfo = async (id) => {
  let sql = `select * from grouplist where id=${id}`
  let res = await dbConfig.SySqlConnect(sql)
  if (res.length) {
    return res[0]
  } else {
    return ''
  }
}

module.exports = {
  verToken,
  getMemberNum,
  getReimNum,
  getMemReimNum,
  getMembers,
  getGroupInfo
}