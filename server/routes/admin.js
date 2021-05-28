var express = require('express')
var router = express.Router()
var admin = require('../controllers/adminController')

/* GET home page. */
router.post('/login', admin.login) // 管理员登录post

router.post('/screenReim', admin.screenReim) // 获取报销单列表get
router.post('/confirmReim', admin.confirmReim) // 确认已报销post

router.post('/addGroup', admin.addGroup) // 添加项目组post
router.get('/groupList', admin.groupList) // 获取项目组列表get
router.get('/groupDetail', admin.groupDetail) // 获取项目组详情get
router.post('/transferMember', admin.transferMember) // 转移成员post
router.post('/disbandGroup', admin.disbandGroup) // 解散项目组post
router.post('/searchGroup', admin.searchGroup) // 搜索项目组post
router.post('/modifyGroup', admin.modifyGroup) // 修改项目组信息post

router.get('/memberList', admin.memberList) // 获取成员列表get
router.post('/addMember', admin.addMember)  // 添加成员post
router.post('/searchMember', admin.searchMember) // 搜索成员post
router.post('/deleteMember', admin.deleteMember) // 删除成员post
router.post('/memberReim', admin.memberReim) // 获取成员报销单列表post

module.exports = router
