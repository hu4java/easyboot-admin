// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      {
        path: '/sys',
        name: 'System',
        component: RouteView,
        meta: { title: '系统管理', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/sys/dept',
            name: 'Dept',
            component: RouteView,
            redirect: '/sys/dept/list',
            meta: { title: '部门管理', permission: [ 'user' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/dept/list',
                name: 'DeptList',
                component: () => import('@/views/sys/dept/dept-list'),
                hidden: true,
                meta: { title: '部门列表', permission: [ 'user' ] }
              },
              {
                path: '/sys/dept/add',
                name: 'DeptAdd',
                component: () => import('@/views/sys/dept/dept-form'),
                hidden: true,
                meta: { title: '新建部门', permission: [ 'user' ] }
              },
              {
                path: '/sys/dept/edit',
                name: 'DeptEdit',
                component: () => import('@/views/sys/dept/dept-form'),
                hidden: true,
                meta: { title: '编辑部门', permission: [ 'user' ] }
              }
            ]
          },
          {
            path: '/sys/user',
            name: 'User',
            component: RouteView,
            redirect: '/sys/user/list',
            meta: { title: '用户管理', permission: [ 'user' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/user/list',
                name: 'UserList',
                component: () => import('@/views/sys/user/user-list'),
                hidden: true,
                meta: { title: '用户列表', permission: [ 'user' ] }
              },
              {
                path: '/sys/user/add',
                name: 'UserAdd',
                component: () => import('@/views/sys/user/user-form'),
                hidden: true,
                meta: { title: '新建用户', permission: [ 'user' ] }
              },
              {
                path: '/sys/user/edit',
                name: 'UserEdit',
                component: () => import('@/views/sys/user/user-form'),
                hidden: true,
                meta: { title: '编辑用户', permission: [ 'user' ] }
              }
            ]
          },
          {
            path: '/sys/role',
            name: 'Role',
            component: RouteView,
            redirect: '/sys/role/list',
            meta: { title: '角色管理', permission: [ 'user' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/role/list',
                name: 'RoleList',
                component: () => import('@/views/sys/role/role-list'),
                hidden: true,
                meta: { title: '角色列表', permission: [ 'user' ] }
              },
              {
                path: '/sys/role/add',
                name: 'RoleAdd',
                component: () => import('@/views/sys/role/role-form'),
                hidden: true,
                meta: { title: '新建角色', permission: [ 'user' ] }
              },
              {
                path: '/sys/role/edit',
                name: 'RoleEdit',
                component: () => import('@/views/sys/role/role-form'),
                hidden: true,
                meta: { title: '编辑角色', permission: [ 'user' ] }
              }
            ]
          },
          {
            path: '/sys/menu',
            name: 'Menu',
            component: RouteView,
            redirect: '/sys/menu/list',
            meta: { title: '菜单管理', permission: [ 'user' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/menu/list',
                name: 'MenuList',
                component: () => import('@/views/sys/menu/menu-list'),
                hidden: true,
                meta: { title: '菜单列表', permission: [ 'user' ] }
              },
              {
                path: '/sys/menu/add',
                name: 'MenuAdd',
                component: () => import('@/views/sys/menu/menu-form'),
                hidden: true,
                meta: { title: '新建菜单', permission: [ 'user' ] }
              },
              {
                path: '/sys/menu/edit',
                name: 'MenuEdit',
                component: () => import('@/views/sys/menu/menu-form'),
                hidden: true,
                meta: { title: '编辑菜单', permission: [ 'user' ] }
              }
            ]
          },
          {
            path: '/sys/dict',
            name: 'Dict',
            component: RouteView,
            redirect: '/sys/dict/list',
            meta: { title: '字典管理', permission: [ 'user' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/dict/list',
                name: 'DictList',
                component: () => import('@/views/sys/dict/dict-list'),
                hidden: true,
                meta: { title: '字典列表', permission: [ 'user' ] }
              },
              {
                path: '/sys/dict/item/list',
                name: 'DictItemList',
                component: () => import('@/views/sys/dict/dict-item-list'),
                hidden: true,
                meta: { title: '字典数据', permission: [ 'user' ] }
              }
            ]
          }

        ]
      },
      {
        path: '/sys/tools',
        name: 'SystemTools',
        component: RouteView,
        redirect: '/sys/tools/generate',
        meta: { title: '系统工具', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/sys/tools/generate',
            name: 'Generate',
            component: RouteView,
            meta: { title: '代码生成', permission: [ 'user' ] },
            hideChildrenInMenu: true,
            redirect: '/sys/tools/generate/list',
            children: [
              {
                path: '/sys/tools/generate/list',
                name: 'GenerateList',
                component: () => import('@/views/tools/generate/list'),
                hidden: true,
                meta: { title: '数据库表', permission: [ 'user' ] }
              },
              {
                path: '/sys/tools/generate/code',
                name: 'GenerateCode',
                hidden: true,
                component: () => import('@/views/tools/generate/code'),
                meta: { title: '生成代码', permission: [ 'user' ] }
              }
            ]
          }
        ]
      }

    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: UserLayout,
    hidden: true,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }

]
