import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 管理员路由
const AdminLogin = () => import('@/views/admin/Login')

// 员工路由
const StaffLogin = () => import('@/views/staff/login/Login.vue')
const Register = () => import('@/views/staff/login/Register.vue')

const InvoiceFolder = () => import('@/views/staff/invoiceFolder')
const InvoiceDetail = () => import('@/views/staff/invoiceFolder/InvoiceDetail.vue')
const Reimburse = () => import('@/views/staff/invoiceFolder/Reimburse.vue')

const Reimbursement = () => import('@/views/staff/reimbursement')
const StaffInfo = () => import('@/views/staff/info')

const adminRoutes = [
  {
    path: '/',
    name: 'AdminLogin',
    component: AdminLogin
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
    path: '/invoiceDetail',
    name: 'InvoiceDetail',
    component: InvoiceDetail
  },
  {
    path: '/reimburse',
    name: 'Reimburse',
    component: Reimburse
  },
  {
    path: '/reimbursement',
    name: 'Reimbursement',
    component: Reimbursement
  },
  {
    path: '/staffInfo',
    name: 'StaffInfo',
    component: StaffInfo
  }
]

export default new Router({
  routes: [
    ...adminRoutes,
    ...staffRoutes
  ]
})
