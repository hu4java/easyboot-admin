// eslint-disable-next-line
import * as LoginApi from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import svgIcons from '@/core/icons'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import('@/views/exception/403'),
  '404': () => import('@/views/exception/404'),
  '500': () => import('@/views/exception/500'),

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/views/dashboard/Workplace'),
  'Analysis': () => import('@/views/dashboard/Analysis')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  name: 'index',
  path: '/',
  component: BasicLayout,
  redirect: '/dashboard/workplace',
  meta: {
    title: '首页'
  }
}

const rootChildren = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/workplace',
    component: RouteView,
    meta: { title: '仪表盘', keepAlive: true, icon: svgIcons['dashboard'] },
    children: [
      {
        path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '分析页', permission: ['user'] }
      },
      {
        path: '/dashboard/workplace',
        name: 'Workplace',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '工作台' }
      }
    ]
  },
  {
    path: '/account',
    component: RouteView,
    redirect: '/account/center',
    name: 'Account',
    meta: { title: '个人页', icon: 'user', keepAlive: true },
    hidden: true,
    children: [
      {
        path: '/Account/center',
        name: 'AccountCenter',
        component: () => import('@/views/account/center'),
        meta: { title: '个人中心', keepAlive: true }
      }
    ]
  }
]

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    LoginApi.getCurrentUserNav().then(res => {
      const { data } = res
      const routers = []
      const menus = generator(data)
      const router = { ...rootRouter }
      router.children = [...rootChildren]
      router.children.push(...menus)
      routers.push(router)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, icon, component } = item || {}
    if (component.startsWith('/')) {
      item.component = component.replace('/', '')
    }
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path,
      // 路由名称，建议唯一
      name: item.routeName || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.component || item.key]) || (() => import(`@/views/${item.component}`)),

      hidden: item.hidden,
      hideChildrenInMenu: item.hideChildrenInMenu,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: svgIcons[icon] || (icon || 'none'),
        permission: item.code,
        hidden: item.hidden
      }
    }

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
