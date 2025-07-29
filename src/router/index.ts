import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Playground from '../pages/Playground.vue'
import Docs from '../pages/Docs.vue'
import UISchemaDemo from '../pages/UISchemaDemo.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/playground',
      name: 'playground',
      component: Playground
    },
    {
      path: '/docs',
      name: 'docs',
      component: Docs
    },
    {
      path: '/ui-schema',
      name: 'ui-schema',
      component: UISchemaDemo
    }
  ]
})

export default router