import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/components/Main.vue'),
      meta: {
        keepAlive: true,
        isBack: false,
      },
    },
    // {
    //   path: '/u/:id/',
    //   redirect: { name: 'Member' },
    // },
    // {
    //   path: '/member/:id/',
    //   redirect: { name: 'Member' },
    // },
    // {
    //   path: '/users/:id/',
    //   name: 'Member',
    //   component: () => import('@/components/Member.vue'),
    // },
    // {
    //   path: '/i/:id/',
    //   redirect: { name: 'Illust' },
    // },
    // {
    //   path: '/illust/:id/',
    //   redirect: { name: 'Illust' },
    // },
    // {
    //   path: '/artworks/:id/',
    //   name: 'Illust',
    //   component: () => import('@/components/Illust.vue'),
    // },
    {
      path: '/about/',
      name: 'About',
      component: () => import('@/components/About.vue'),
    },
    {
      path: '/settings/',
      name: 'Settings',
      component: () => import('@/components/Settings.vue'),
    },
  ],
})
