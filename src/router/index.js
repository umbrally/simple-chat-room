import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from './../views/NotFound.vue'
import Chat from './../views/Chat.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chat',
    name: 'chat',
    component: Chat
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})

export default router
