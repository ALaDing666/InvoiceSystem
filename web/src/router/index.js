import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// 管理员路由
const AdminLogin = () => import('@/views/admin/Login')

const Reimburse = () => import('@/views/admin/reimburse')
const Detail = () => import('@/views/admin/reimburse/Detail.vue')

const ProjectGroup = () => import('@/views/admin/projectGroup')
const GroupDetail = () => import('@/views/admin/projectGroup/GroupDetail.vue')
const EditGroup = () => import('@/views/admin/projectGroup/EditGroup.vue')
const AddMember = () => import('@/views/admin/projectGroup/AddMember.vue')

const Member = () => import('@/views/admin/member')
const Reimbursements = () => import('@/views/admin/member/Reimbursements.vue')

// 员工路由
const StaffLogin = () => import('@/views/staff/login/Login.vue')
const Register = () => import('@/views/staff/login/Register.vue')

const InvoiceFolder = () => import('@/views/staff/invoiceFolder')
const ManualEntry = () => import('@/views/staff/invoiceFolder/ManualEntry.vue')
const ScanInvoice = () => import('@/views/staff/invoiceFolder/ScanInvoice.vue')
const InvoiceDetail = () => import('@/views/staff/invoiceFolder/InvoiceDetail.vue')
const Initiate = () => import('@/views/staff/invoiceFolder/Initiate.vue')

const Reimbursement = () => import('@/views/staff/reimbursement')
const ReimDetail = () => import('@/views/staff/reimbursement/ReimDetail.vue')

const StaffInfo = () => import('@/views/staff/info')
const NewPassword = () => import('@/views/staff/info/NewPassword.vue')

const adminRoutes = [
  {
    path: '/',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/reimburse',
    name: 'Reimburse',
    component: Reimburse
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/projectGroup',
    name: 'ProjectGroup',
    component: ProjectGroup
  },
  {
    path: '/groupDetail',
    name: 'GroupDetail',
    component: GroupDetail
  },
  {
    path: '/editGroup',
    name: 'EditGroup',
    component: EditGroup
  },
  {
    path: '/addMember',
    name: 'AddMember',
    component: AddMember
  },
  {
    path: '/member',
    name: 'Member',
    component: Member
  },
  {
    path: '/reimbursements',
    name: 'Reimbursements',
    component: Reimbursements
  }
]
const staffRoutes = [
  {
    path: '/staffLogin',
    name: 'StaffLogin',
    component: StaffLogin
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/invoiceFolder',
    name: 'InvoiceFolder',
    component: InvoiceFolder
  },
  {
    path: '/manualEntry',
    name: 'ManualEntry',
    component: ManualEntry
  },
  {
    path: '/scanInvoice',
    name: 'ScanInvoice',
    component: ScanInvoice
  },
  {
    path: '/invoiceDetail',
    name: 'InvoiceDetail',
    component: InvoiceDetail
  },
  {
    path: '/initiate',
    name: 'Initiate',
    component: Initiate
  },
  {
    path: '/reimbursement',
    name: 'Reimbursement',
    component: Reimbursement
  },
  {
    path: '/reimDetail',
    name: 'ReimDetail',
    component: ReimDetail,
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/staffInfo',
    name: 'StaffInfo',
    component: StaffInfo
  },
  {
    path: '/newPassword',
    name: 'NewPassword',
    component: NewPassword
  }
]

export default new Router({
  routes: [
    ...adminRoutes,
    ...staffRoutes
  ]
})
