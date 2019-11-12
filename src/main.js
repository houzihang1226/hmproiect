import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
import App from './App.vue'
import router from '@/router'
import axios from '@/api'
// import MyBread from '@/components/my-bread'

// Vue.component('my-bread', MyBread) // 括号里前面是组件名 后面是组件配置对象
import plugin from '@/components'
Vue.use(plugin)

Vue.use(ElementUI)
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
