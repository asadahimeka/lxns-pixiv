import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main.vue'
import About from '@/components/About.vue'
import Settings from '@/components/Settings.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      meta: {
        keepAlive: true,
        isBack: false,
      },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
})
