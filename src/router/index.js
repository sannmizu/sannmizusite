import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Home' }
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      page: 'home'
    },
    component: () => import( /* webpackChunkName: 'home' */ '../views/Home')
  },
  {
    path: '/blog',
    name: 'AllBlog',
    meta: {
      page: 'blog'
    },
    component: () => import( /* webpackChunkName: 'allBlog' */ '../views/AllBlog')
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    meta: {
      page: 'blog'
    },
    component: () => import( /* webpackChunkName: 'blogDetail' */ '../views/BlogDetail')
  },
  {
    path: '/project',
    name: 'Project',
    meta: {
      page: 'project'
    },
    component: () => import( /* webpackChunkName: 'project' */ '../views/Project')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'NotFound' }
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: {
      page: '404'
    },
    component: () => import( /* webpackChunkName: 'notFound' */ '../views/NotFound')
  }
]

// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
const scrollBehavior = function (to, from, savedPosition) {
  // 如果是一个页面，锚点的切换会导致savedPosition变化，savedPosition相同页面只会记一个，所以
  // 相同页面回退时这个savedPosition会是现在的值，而不是之前的值，因为savedPosition被覆盖了
  // 如果有to和from都有锚点hash自然没问题，可以通过hash来移动，但如果是to没有hash，则savedPosition
  // 会不起作用，还需要加一个判断是否是相同界面
  const position = {}
  if (to.hash) {
    position.selector= to.hash
  } else {
    if (to.path === from.path) {
      position.x = 0
      position.y = 0
    } else {
      if (savedPosition) {
        // savedPosition is only available for popstate navigations.
        return savedPosition
      }
      if (!position.x) {
        position.x = 0
        position.y = 0
      }
    }
  }
  return new Promise(resolve => {
    resolve(position)
  })
}

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior
})

export default router
