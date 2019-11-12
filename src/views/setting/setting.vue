<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <el-col :span="12">
        <el-form label-width="120px">
          <el-form-item label="编号:">{{userinf.id}}</el-form-item>
          <el-form-item label="手机号:">{{userinf.mobile}}</el-form-item>
          <el-form-item label="媒体名称:">
            <el-input v-model="userinf.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体介绍:">
            <el-input type="textarea" :rows="3" v-model="userinf.intro"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:">
            <el-input v-model="userinf.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setuser">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :http-request="uploadphoto"
          :show-file-list="false"
        >
          <!--           :http-request="uploadphoto" 覆盖默认上传方式   上传头像需要新的上传方式（文件）         -->
          <img v-if="userinf.photo" :src="userinf.photo" width="178" height="178" alt />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p style="text-align:center">修改头像</p>
      </el-col>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line semi
import local from '@/utils/store.js';
// eslint-disable-next-line semi
import eventBus from '@/eventBus.js';
export default {
  data () {
    return {
      userinf: {
        name: '',
        intro: '',
        email: '',
        photo: null
      }
    }
  },
  created () {
    this.getuserinf()
  },
  methods: {
    // 上传头像
    async uploadphoto ({ file }) {
      // {file} 是解构出来的 是形参e.file结构出来
      // console.log(e.file) === console.log(file)  因为是修改头像 所以选择图片的时候可以获得文件对象 既可以解构出来
      const formDate = new FormData() // 创建新的formdate对象 使用里面的方法
      formDate.append('photo', file) // append(key, value)来添加数据
      const {
        data: { data }
      } = await this.$http.patch('user/photo', formDate) // 把上传的头像发送给后台
      console.log(data)
      this.$message.success('修改头像成功') // 提示
      this.userinf.photo = data.photo // 预览图片
      eventBus.$emit('updatePhoto', data.photo) // 修改home组件
      const userphoto = local.getUser() // 修改本地存储信息
      userphoto.photo = data.photo
      local.setUser(userphoto)
    },
    async getuserinf () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      console.log(data)
      this.userinf = data
    },
    // 保存设置
    async setuser () {
      // 解构赋值来存储
      console.log(this.userinf.name.length)
      const { name, email, intro } = this.userinf
      console.log(name)
      if (name.length > 7) {
        this.$message.warning('最多7个字符')
      } else {
        await this.$http.patch('user/profile', {
          name,
          email,
          intro
        })
        // 提示成功
        this.$message.success('保存成功')
        // 改home组件
        eventBus.$emit('updateName', name)
        // 修改本地存储
        const user = local.getUser()
        user.name = name
        local.setUser(user)
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
