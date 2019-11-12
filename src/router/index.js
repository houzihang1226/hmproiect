import VueRouter from 'vue-router'
import Vue from 'vue'
import local from '@/utils/store'
import Login from '@/views/login/login.vue'
import Home from '@/views/home/home.vue'
import Welcome from '@/views/welcome/index.vue'
import Nofoun from '@/views/404/index.vue'
import Article from '@/views/article/article.vue'
import Publish from '@/views/publish/publish.vue'
import Comment from '@/views/comment/comment.vue'
import Setting from '@/views/setting/setting.vue'
import Fans from '@/views/fans/fans.vue'
import Img from '@/views/img'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    // 登录
    path: '/login',
    component: Login
  }, {
    // 首页
    path: '/',
    component: Home,
    children: [{
      path: '/',
      component: Welcome
    }, {

      // 内容管理
      path: '/article',
      component: Article

    },
    {
      // 素材管理
      path: '/image',
      component: Img
    },
    {
      // 发布文章
      path: '/publish',
      component: Publish
    },
    {
      // 粉丝管理
      path: '/comment',
      component: Comment
    },
    {
      // 个人设置
      path: '/setting',
      component: Setting
    },
    {
      // 粉丝管理
      path: '/fans',
      component: Fans
    }
    ]
  }, {
    // 404
    path: '*',
    component: Nofoun
  }]
})
// 导航守卫
// 前置导航守卫
router.beforeEach((to, from, next) => {
  const user = local.getUser() // 获取登录信息
  if (user && user.token) { // 判断登录状态并且判断token不为空
    next() // 放行
  } else { // 退出时候
    if (to.path === '/login') { // 判断是否在登录
      next() // 在登陆不阻止  放行
    } else {
      next('/login') // 没在登录,滚回去登录
    }
  }
})

export default router
