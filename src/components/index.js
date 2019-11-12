// 封装vue插件  为main.js 分担
import MyBread from '@/components/my-bread'
import MyChannel from '@/components/my-channel'
import Myimage from '@/components/my-image'
export default {
  install (Vue) {
    // Vue是一个构造函数
    Vue.component('my-bread', MyBread)
    Vue.component('my-channel', MyChannel)
    Vue.component('my-image', Myimage)
  }
}
