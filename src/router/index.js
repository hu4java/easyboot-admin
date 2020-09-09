import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: constantRouterMap
})

// 解决用户退出重进时路由重复问题
router.$addRoutes = (params) => {
  router.matcher = new Router({ mode: 'history', routes: constantRouterMap }).matcher
  router.addRoutes(params)
}

export default router
