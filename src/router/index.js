import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => require( /* webpackChunkName: 'home' */ '@/views/Home')
  },
  {
    path: '/blog',
    name: 'AllBlog',
    meta: {
      page: 'blog'
    },
    component: () => require( /* webpackChunkName: 'allBlog' */ '@/views/AllBlog')
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    meta: {
      page: 'blog'
    },
    component: () => require( /* webpackChunkName: 'blogDetail' */ '@/views/BlogDetail')
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
    component: () => require( /* webpackChunkName: 'notFound' */ '@/views/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
