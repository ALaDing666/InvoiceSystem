// import { uriType } from '../utils/enum.js'
var dbConfig = require('../util/dbconfig')
var Enum = require('../util/enum')
var common = require('./common')
var multiparty = require('multiparty')
const jwt = require('jsonwebtoken')
var demo = require('../demo')
var path = require('path')
const fs = require('fs') // 引入文件系统模块

// let userInfo = {}
// userInfo.id = 1
// let userInfo = await common.verToken(req, res)

// 成员登录post
login = async (req, res) => {
  let { number, password } = req.body
  let sql = `select * from staff where number='${number}' and password='${password}'`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length) {
    userInfo = {
      id: result[0].id,
      number: result[0].number
    }
    // 生成一个 token 返回给前端
    const token = jwt.sign(userInfo, 'Josiah', { expiresIn: 60 })
    res.json({
      code: 200,
      msg: 'success!',
      token
    })
  } else {
    res.json({
      code: 400,
      msg: '用户名或密码错误'
    })
  }
}

// 获取用户信息post
getUserInfo = async (req, res) => {
  // let userInfo = common.verToken(req, res)
  let { number } = req.body
  let sql = `select * from staff where number=${number}`
  let result = await dbConfig.SySqlConnect(sql)
  if (result[0]) {
    let result1 = await common.getGroupInfo(result[0].group_id)
    result[0].groupName = result1.name
    result[0].groupNumber = result1.number
    if (delete result[0].password) {
      res.json({
        code: 200,
        data: result[0],
        msg: 'success!'
      })
    } else {
      res.json({
        code: 400,
        msg: 'fail!'
      })
    }
  }
}

// 修改密码post
changePwd = async (req, res) => {
  let { userNum, password, newPassword_1, newPassword_2 } = req.body
  let sql = `select * from staff where number='${userNum}'`
  let result = await dbConfig.SySqlConnect(sql)
  if (result[0].password === password) {
    if (newPassword_1 === newPassword_2) {
      let sql1 = `update staff set password='${newPassword_1}' where number=${userNum}`
      let result1 = await dbConfig.SySqlConnect(sql1)
      if (result1.affectedRows === 1) {
        res.json({
          code: 200,
          msg: 'success!'
        })
      } else {
        res.json({
          code: 400,
          msg: '未修改成功'
        })
      }
    } else {
      res.json({
        code: 400,
        msg: '新密码输入不一致'
      })
    }
  } else {
    res.json({
      code: 400,
      msg: '原密码有误'
    })
  }
}

// 获取发票列表post
// invoiceList = async (req, res) => {
//   let sql = `select * from invoice_vat where staff_id=${userInfo.id}`
//   let result = await dbConfig.SySqlConnect(sql)
//   res.json({
//     code: 200,
//     data: result,
//     msg: 'success!'
//   })
// }

// 获取选择报销的发票post
getInvoice = async (req, res) => {
  let { ids } = req.body
  let idString = ids.join(',')
  let sql = `select * from invoice_vat where id in (${idString})`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 扫描上传发票图片post
scanInvoice = async (req, res) => {
  let form = new multiparty.Form()
  let uploadDir = path.resolve(__dirname,'../public/images')
  form.uploadDir = uploadDir
  form.keepExtensions = true   // 是否保留后缀
  form.autoFields = true        // 启用文件事件，并禁用部分文件事件，如果监听文件事件，则默认为true
  form.parse(req, async function(err, fields, file) {
    let { type } = fields
    let imgName = file.file[0].path.split('images\\')[1]
    console.log('imgName: ', imgName)
    let opt = {}
    let ocrClientAksk = demo.ocrClientAksk
    let httpUri = Enum.uriType[type]
    ocrClientAksk.requestOcrServiceBase64(httpUri, `./public/images/${imgName}`, opt).then(async result => {
      if (result.statusCode === 200) {
        res.json({ code: 200, data: result.result, msg: 'success!' })
      } else {
        res.json({ code: 500, msg: 'fail!' })
      }
    }).catch(error => {
      res.json({ code: 400, msg: '扫描有误' })
    })
    fs.unlink(`${uploadDir}/${imgName}`, (err) => {
      if (err) {
        throw err
      }
    })
  })
}

// 取消发票录入post
// cancelSave = async (req, res) => {
//   let { imgName } = req.body
//   let uploadDir = path.resolve(__dirname,'../public/images')
//   fs.unlink(`${uploadDir}/${imgName}`, (err) => {
//     if (err) {
//       throw err
//     }
//     res.json({
//       code: 200,
//       msg: 'success!'
//     })
//   })
// }

// 保存发票post
saveInvoice = async (req, res) => {
  let form = new multiparty.Form()
  let uploadDir = path.resolve(__dirname,'../public/images')
  form.uploadDir = uploadDir
  form.keepExtensions = true   // 是否保留后缀
  form.autoFields = true        // 启用文件事件，并禁用部分文件事件，如果监听文件事件，则默认为true
  var obj ={}
  var imgName = ''
  form.parse(req, async function(err, fields, file) {
    var { params } = fields
    obj = JSON.parse(params[0])
    obj.pic = ''
    if (file.file) {
      imgName = file.file[0].path.split('images\\')[1]
      obj.pic = `images/${imgName}`
      console.log('imgName: ', imgName)
    }
    if (obj.type === 3) { // 其他发票
      let { uid, type, pic, issue_date, total, remarks } = obj
      let sql = `insert into invoice_vat(type,pic,issue_date,total,create_date,remarks,staff_id) values(${
        type},'${pic}','${issue_date}',${total},NOW(),'${remarks}',${uid})`
      let result = await dbConfig.SySqlConnect(sql)
      if (result.affectedRows === 1) {
        res.json({ code: 200, msg: 'success!' })
      } else {
        res.json({ code: 400, msg: '保存失败' })
        fs.unlink(`${uploadDir}/${imgName}`, (err) => {
          if (err) {
            throw err
          }
        })
      }
    } else { // 增值税发票
      let sql = `select * from invoice_vat where number=${obj.number}`
      let result = await dbConfig.SySqlConnect(sql)
      if (result.length) {
        res.json({ code: 400, msg: '该发票已录入' })
        fs.unlink(`${uploadDir}/${imgName}`, (err) => {
          if (err) {
            throw err
          }
        })
      } else {
        let { uid, type, pic, code, number, taxi_number, issue_date, total, location, time,
          unit_price, distance, buyer_name, seller_name, remarks } = obj
        let str = 'type,pic,code,number,taxi_number,issue_date,total,location,time,unit_price,'
          +'distance,buyer_name,seller_name,create_date,remarks,staff_id'
        let sql1 = `insert into invoice_vat(${str}) values(${type},'${pic}','${code}','${number}','${taxi_number}','${issue_date}',${
          total},'${location}','${time}',${unit_price},${distance},'${buyer_name}','${seller_name}',NOW(),'${remarks}',${uid})`
        let result1 = await dbConfig.SySqlConnect(sql1)
        if (result1.affectedRows === 1) {
          res.json({ code: 200, msg: 'success!' })
        } else {
          res.json({ code: 400, msg: '保存失败' })
          fs.unlink(`${uploadDir}/${imgName}`, (err) => {
            if (err) {
              throw err
            }
          })
        }
      }
    }
  })
}

// 更新发票post
updateInvoice = async (req, res) => {
  let { id, type, code, number, taxi_number, issue_date, total, location, time, unit_price,
    distance, buyer_name, seller_name, remarks } = req.body
  let sql = `update invoice_vat set type=${type},code='${code}',number='${number}',taxi_number='${
    taxi_number}',issue_date='${issue_date}',total=${total},location='${location}',time='${time}',unit_price=${unit_price},distance=${
    distance},buyer_name='${buyer_name}',seller_name='${seller_name}',remarks='${remarks}' where id=${id}`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.affectedRows === 1) {
    res.json({
      code: 200,
      msg: 'success!'
    })
  } else {
    res.json({
      code: 400,
      msg: '保存失败'
    })
  }
}

// 筛选发票post
screenInvoice = async (req, res) => {
  // let userInfo = common.verToken(req, res)
  let { uid, order, type, status } = req.body
  let str = ''
  if (type !== 'all' && status !== 'all') {
    str = `type=${type} and status=${status} and`
  } else if (type !== 'all') {
    str = `type=${type} and`
  } else if (status !== 'all'){
    str = `status=${status} and`
  }
  let sql = `select * from invoice_vat where ${str} staff_id=${uid} order by create_date ${order}`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 删除发票post
deleteInvoice = async (req, res) => {
  let { invoiceIds } = req.body
  let idString = invoiceIds.join(',')
  let sql = `select pic from invoice_vat where id in (${idString})`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.length > 0) {
    let sql1 = `delete from invoice_vat where id in (${idString})`
    let result1 = await dbConfig.SySqlConnect(sql1)
    if (result1.affectedRows > 0) {
      let uploadDir = path.resolve(__dirname,'../public/images')
      for (var item of result) {
        if (item.pic) {
          var imgName = item.pic.split('images/')[1]
          console.log('imgName: ', imgName)
          fs.unlink(`${uploadDir}/${imgName}`, (err) => {
            if (err) {
              throw err
            }
          })
        }
      }
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
}

// 发起报销post
initiateReim = async (req, res) => {
  let { uid, ids, group_id, group_name, group_number, reim_person, invo_amount, invo_quantity, reim_amount, reason } = req.body
  let str = 'group_id,group_name,group_number,reim_person,invo_amount,invo_quantity,reim_amount,reason,create_date,staff_id'
  let sql = `insert into reimburse(${str}) values(${group_id},'${group_name}','${group_number}','${reim_person}',
    '${invo_amount}','${invo_quantity}',${reim_amount},'${reason}',NOW(),${uid})`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.affectedRows === 1) {
    let idString = ids.join(',')
    let sql1 = `update invoice_vat set status=1,reim_id=${result.insertId} where id in (${idString})`
    let result1 = await dbConfig.SySqlConnect(sql1)
    if (result1.affectedRows > 0) {
      res.json({
        code: 200,
        msg: 'success!'
      })
    }
  } else {
    res.json({
      code: 400,
      msg: '报销失败'
    })
  }
}

// 获取报销单列表get
screenReim = async (req, res) => {
  let { uid, order, status } = req.body
  let str = ''
  if (status !== 'all') {
    str = `status=${status} and`
  }
  let sql = `select * from reimburse where ${str} staff_id=${uid} order by create_date ${order}`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 搜索报销单post
searchReim = async (req, res) => {
  let { uid, value } = req.body
  let sql = `select * from reimburse where staff_id=${uid} and reason like '%${value}%'`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 获取报销单相关发票post
reimInvoice = async (req, res) => {
  let { reimId } = req.body
  let sql = `select * from invoice_vat where reim_id=${reimId}`
  let result = await dbConfig.SySqlConnect(sql)
  res.json({
    code: 200,
    data: result,
    msg: 'success!'
  })
}

// 撤回报销单post
withdrawReim = async (req, res) => {
  let { reimId } = req.body
  let sql = `update reimburse set status=3 where id=${reimId}`
  let sql1 = `update invoice_vat set status=4 where reim_id=${reimId}`
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
      msg: '撤回失败'
    })
  }
}

// 重新发起报销post
reInitiate = async (req, res) => {
  let { ids, id, reim_amount, reason } = req.body
  let sql = `update reimburse set status=0,reim_amount=${reim_amount},reason='${reason}',create_date=NOW() where id=${id}`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.affectedRows === 1) {
    let idString = ids.join(',')
    let sql1 = `update invoice_vat set status=1 where id in (${idString})`
    let result1 = await dbConfig.SySqlConnect(sql1)
    if (result1.affectedRows > 0) {
      res.json({
        code: 200,
        msg: 'success!'
      })
    }
  } else {
    res.json({
      code: 400,
      msg: '报销失败'
    })
  }
}

// 确认已收款post
confirmRec = async (req, res) => {
  let { reimId } = req.body
  let sql = `update reimburse set status=2 where id=${reimId}`
  let sql1 = `update invoice_vat set status=3 where reim_id=${reimId}`
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

// 删除报销单post
deleteReim = async (req, res) => {
  let { reimId } = req.body
  let sql = `update invoice_vat set status=0 where reim_id=${reimId}`
  let result = await dbConfig.SySqlConnect(sql)
  if (result.affectedRows > 0) {
    let sql1 = `delete from reimburse where id=${reimId}`
    let result1 = await dbConfig.SySqlConnect(sql1)
    if (result1.affectedRows===1) {
      res.json({
        code: 200,
        msg: 'success!'
      })
    }
  } else {
    res.json({
      code: 500,
      msg: 'fail!'
    })
  }
}

module.exports = {
  login,
  getUserInfo,
  changePwd,
  // invoiceList,
  getInvoice,
  scanInvoice,
  // cancelSave,
  saveInvoice,
  updateInvoice,
  screenInvoice,
  deleteInvoice,
  initiateReim,
  screenReim,
  searchReim,
  reimInvoice,
  withdrawReim,
  reInitiate,
  deleteReim,
  confirmRec
}