/* eslint-disable semi */
<!-- 登录页面 -->

<template>
  <div class="login">
    <el-card>
      <img src="../../assets/logo_index.png" width="200px" alt />
      <el-form ref="loginForm" status-icon :model="loginForm" :rules="rules">
        <el-form-item prop="mobile">
          <el-input @keyup.enter.native="Login" v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            @keyup.enter.native="Login"
            v-model="loginForm.code"
            style="width:235px;margin-right:10px"
            placeholder="请输入验证码"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-checkbox label="美食/餐厅线上活动" ></el-checkbox> -->
          <el-checkbox v-model="opn">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" :disabled="!opn" type="primary" style="width:100%">立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line semi
import local from '@/utils/store';
export default {
  data () {
    const checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }
    const checkCode = (rule, value, callback) => {
      if (/^\d{6}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的验证码'))
      }
    }
    return {
      loginForm: {
        mobile: '15614014540',
        code: '246810'
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位验证码', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ]
      },
      opn: true // 绑定我已阅读并同意单选框，当单选框为选中状态登录按钮的disabled(动态来变化属性)属性取反为禁用状态
    }
  },
  methods: {
    Login () {
      this.login()
    },
    login () {
      this.$refs['loginForm'].validate(async valid => {
        if (valid) {
          // this.$http
          //   .post('authorizations', this.loginForm)
          //   .then(res => {
          //     // 登陆成功，保存用户信息
          //     local.setUser(res.data.data)
          //     this.$router.push('/')
          //   })
          //   .catch(() => {
          //     this.$message.error('手机号或验证码错误')
          //   })
          try {
            const {
              data: { data }
            } = await this.$http.post('authorizations', this.loginForm)
            local.setUser(data)
            this.$router.push('/')
          } catch (e) {
            this.$message.error('手机号或验证码错误')
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  background: red;
  left: 0;
  top: 0;
  // background: url(http://localhost:8080/img/login_bg.ec9bf219.jpg) no-repeat
  //   center / cover;
  background: url(../../assets/logbg.jpg) no-repeat center / cover;
  .el-card {
    width: 400px;
    height: 320px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;
      margin: 0 auto 5px;
    }
  }
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
