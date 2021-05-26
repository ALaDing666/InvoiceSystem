// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant, { ImagePreview } from 'vant'
import 'vant/lib/index.css'
import http from '@/utils/http.js'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(ImagePreview)
Vue.prototype.$ajax = http
Vue.prototype.$imagePreview = ImagePreview

// 用户未登录则自动跳转到登录页面
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  // console.log('to.path : ', to.path)
  if (to.path === '/' || to.path === '/staffLogin' || to.path === '/register') {
    sessionStorage.removeItem('token')
    sessionStorage.clear()
    next() // 如果不加入这一条件语句，则会陷入死循环
  } else {
    if (token) {
      next()
    } else {
      next('/staffLogin')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
