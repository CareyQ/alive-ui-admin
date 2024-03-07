const Layout = () => import('@/layout/Layout.vue')

export const staticRouter: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index.vue'),
        name: 'Index',
        meta: {
          title: '首页',
          icon: 'ep:home-filled',
          keepAlive: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noNavTab: true
    }
  },
  {
    path: '/mall/product',
    component: Layout,
    name: 'ProductCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'attribute/:groupId(\\d+)',
        component: () => import('@/views/mall/product/attribute-group/attribute/index.vue'),
        name: 'ProductAttribute',
        meta: {
          noCache: true,
          hidden: true,
          title: '商品属性值',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/home/index.vue'),
    name: '',
    meta: {
      hidden: true,
      title: '404',
      noNavTab: true
    }
  }
]

export default staticRouter
