var express = require('express')
var router = express.Router()
var users = require('../controllers/usersController')


/* GET users listing. */
router.post('/login', users.login) // 成员登录post
router.post('/getUserInfo', users.getUserInfo) // 获取用户信息post
router.post('/changePwd', users.changePwd) // 修改密码post

// router.get('/invoiceList', users.invoiceList) // 获取发票列表get
router.post('/getInvoice', users.getInvoice) // 获取选择报销的发票post
router.post('/scanInvoice', users.scanInvoice) // 扫描上传发票图片post
// router.post('/cancelSave', users.cancelSave) // 取消发票录入post
router.post('/saveInvoice', users.saveInvoice) // 保存发票post
router.post('/updateInvoice', users.updateInvoice) // 更新发票post
router.post('/screenInvoice', users.screenInvoice) // 筛选发票post id
router.post('/deleteInvoice', users.deleteInvoice) // 删除发票post
router.post('/initiateReim', users.initiateReim) // 发起报销post

router.post('/screenReim', users.screenReim) // 获取报销单列表post
router.post('/searchReim', users.searchReim) // 搜索报销单post
router.post('/reimInvoice', users.reimInvoice) // 获取报销单相关发票post
router.post('/withdrawReim', users.withdrawReim) // 撤回报销单post
router.post('/reInitiate', users.reInitiate) // 重新发起报销post
router.post('/deleteReim', users.deleteReim) // 删除报销单post
router.post('/confirmRec', users.confirmRec) // 确认已收款post

module.exports = router
