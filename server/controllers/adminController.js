var dbConfig = require('../util/dbconfig')
var common = require('./common')
const jwt = require('jsonwebtoken')

// 管理员登录post
login = (req, res) => {
  let { username, password } = req.body
  var sql = `select * from admin where admin_user='${username}' and admin_pwd='${password}'`
  var callBack = (err, result) => {
    if(err) {
      res.json({
        code: 500,
        msg: err.message
      })
    } else {
      if (result.length === 0) {
        res.json({
          code: 400,
          msg: '用户名或密码错误'
        })
      } else {
        const userInfo = {
          adminId: result[0].admin_id
        }
        // 生成一个 token 返回给前端
        const token = jwt.sign(userInfo, 'Josiah', { expiresIn: 60 })
        res.json({
          code: 200,
          msg: 'success!',
          token
        })
      }
    }
  }
  dbConfig.sqlConnect(sql, callBack)
}

// 获取报销单列表get
screenReim = async (req, res) => {
  let { order, status } = req.body
  let str = ''
  if (status === 'all') {
    str = 'status in (0,1,2)'
  } else {
    str = `status=${status}`
  }
  let sql = `select * from reimburse where ${str} order by create_date ${order}`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 确认已报销post
confirmReim = async (req, res) => {
  let { reimId } = req.body
  let sql = `update reimburse set status=1 where id=${reimId}`
  let sql1 = `update invoice_vat set status=2 where reim_id=${reimId}`
  let result = await dbConfig.SySqlConnect(sql)
  let result1 = await dbConfig.SySqlConnect(sql1)
  if (result.affectedRows === 1 && result1.affectedRows > 0) {
    res.json({
      code: 200,
      data: result,
      msg: 'success!'
    })
  } else {
    res.json({
      code: 400,
      msg: '确认失败'
    })
  }
}

// 添加项目组post
addGroup = async (req, res) => {
  let { name, number, descpt } = req.body // 获取前端所传的项目组信息
  let sql = `select * from grouplist where number='${number}'`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length > 0) {
    res.json({ code: 400, msg: '该项目组编号已存在' })
  } else {
    let sql1 = `insert into grouplist(name,number,descpt,create_date) values('${name}','${number}','${descpt}',CURDATE())`
    let result1 = await dbConfig.SySqlConnect(sql1)
    if (result1.affectedRows===1) {
      res.json({ code: 200, msg: 'success!' })
    } else {
      res.json({ code: 500, msg: err.message })
    }
  }
}

// 获取项目组列表get
groupList = async (req, res) => {
  let sql = 'select * from grouplist order by id desc'
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length) {
    for (var item of result) {
      item.memberNum = await common.getMemberNum(item.id)
    }
  }
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 获取项目组详情get
groupDetail = async (req, res) => {
  let { id } = req.query
  let sql = `select * from grouplist where id=${id}`
  let group = await dbConfig.SySqlConnect(sql)
  group[0].memberNum = await common.getMemberNum(id)
  group[0].reimNum = await common.getReimNum(id)
  group[0].members = await common.getMembers(id)
  res.json({
    code: 200,
    data: group[0],
    msg: 'success!'
  })
}

// 转移成员post
transferMember = async (req, res) => {
  let { membersId, groupId } = req.body
  let idString = membersId.join(',')
  let sql = `update staff set group_id=${groupId} where id in (${idString})`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    msg: 'success!'
  })
}

// 解散项目组post
disbandGroup = (req, res) => {
  let { id } = req.query
  var sql = `delete from grouplist where id=${id}`
  var callBack = (err, result) => {
    if(err) {
      res.json({
        code: 500,
        msg: err.message
      })
    } else {
      res.json({
        code: 200,
        msg: 'success!'
      })
    }
  }
  dbConfig.sqlConnect(sql, callBack)
}

// 搜索项目组post
searchGroup = (req, res) => {
  let { value } = req.query
  var sql = `select * from grouplist where name like '%${value}%'`
  var callBack = (err, result) => {
    if(err) {
      res.json({
        code: 500,
        msg: err.message
      })
    } else {
      res.json({
        code: 200,
        data: result,
        msg: 'success!'
      })
    }
  }
  dbConfig.sqlConnect(sql, callBack)
}

// 修改项目组信息post
modifyGroup = async (req, res) => {
  let { groupId, name, descpt } = req.body
  let sql = `update grouplist set name='${name}',descpt='${descpt}' where id=${groupId}`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.affectedRows > 0) {
    res.json({
      code: 200,
      msg: 'success!'
    })
  } else {
    res.json({
      code: 500,
      msg: 'fail!'
    })
  }
}

// 添加成员post
addMember = async (req, res) => {
  let { name, sex, number, groupId } = req.body
  let sql = `select * from staff where number=${number}`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length) {
    res.json({
      code: 400,
      msg: '该工号已存在'
    })
  } else {
    let sql1 = `insert into staff(name,sex,number,group_id,password) values('${name}','${sex}','${number}','${groupId}','${number}')`
    let result1 = await dbConfig.SySqlConnect(sql1)
    res.json({
      code: 200,
      msg: 'success!'
    })
  }
}

// 获取成员列表get
memberList = async (req, res) => {
  let sql = 'select * from staff'
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length) {
    for (var item of result) {
      let res = await common.getGroupInfo(item.group_id)
      item.groupName = res.name
      item.groupNumber = res.number
      item.reimNum = await common.getMemReimNum(item.id)
    }
  }
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 搜索成员post
searchMember = async (req, res) => {
  let { value } = req.query
  let sql = `select * from staff where name like '%${value}%' or number like '%${value}%'`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length) {
    for (var item of result) {
      let res = await common.getGroupInfo(item.group_id)
      item.groupName = res.name
      item.groupNumber = res.number
      item.reimNum = await common.getMemReimNum(item.id)
    }
  }
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 删除成员post
deleteMember = async (req, res) => {
  let { membersId } = req.body
  let idString = membersId.join(',')
  let sql = `delete from staff where id in (${idString})`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.affectedRows > 0) {
    res.json({
      code: 200,
      msg: 'success!'
    })
  } else {
    res.json({
      code: 500,
      msg: 'fail!'
    })
  }
}

// 获取成员报销单列表post
memberReim = async (req, res) => {
  let { id } = req.body
  let sql = `select * from reimburse where staff_id=${id} and status in (0,1,2)`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

module.exports = {
  login,
  screenReim,
  confirmReim,
  addGroup,
  groupList,
  groupDetail,
  transferMember,
  disbandGroup,
  searchGroup,
  modifyGroup,
  addMember,
  memberList,
  searchMember,
  deleteMember,
  memberReim
}