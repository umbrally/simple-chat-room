import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import store from './store'
import vuetify from './plugins/vuetify';
import './assets/application.css'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://nameless-inlet-21529.herokuapp.com/',
  vuex: {
    // store,
    // actionPrefix: 'SOCKET_',
    // mutationPrefix: 'SOCKET_'
  },
  // options: { path: "/my-app/" } //Optional options
}))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
