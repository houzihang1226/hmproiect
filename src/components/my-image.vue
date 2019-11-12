<template>
  <div class="my-image">
    <div class="btn_box" @click="open">
      <img :src="value || btnimg" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 切换按钮 -->
          <el-radio-group v-model="reqImg.collect" @change="toggList" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片列表 -->
          <div class="img_list">
            <div
              class="img_item"
              @click="climg(item.url)"
              :class="{imgurl:getimgurl === item.url}"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" alt />
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqImg.per_page"
            :current-page="reqImg.page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            :show-file-list="false"
            :on-success="upimgYe"
            name="image"
          >
            <!-- action 上传的接口地址  element发送请求 地址要写全 -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line semi
import local from '@/utils/store.js';
// eslint-disable-next-line semi
import myImg from '../assets/biedw.jpg';
export default {
  props: ['value'],
  data () {
    return {
      // 对话框显示隐藏
      dialogVisible: false,
      // 双向绑定，切换上传和素材库
      activeName: 'image',
      reqImg: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      total: 0,
      getimgurl: null, // 图片列表地址
      imageUrl: null, // 上传图片地址
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      btnimg: myImg // 按钮图片默认地址
    }
  },
  methods: {
    // 确认图片
    confirmImg () {
      if (this.activeName === 'image') {
        if (!this.getimgurl) {
          return this.$message.warning('请选择一张图片')
        }
        // this.btnimg = this.getimgurl
        this.$emit('input', this.getimgurl)
        this.dialogVisible = false
      } else {
        if (!this.imageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // this.btnimg = this.imageUrl
        this.$emit('input', this.imageUrl)
        this.dialogVisible = false
      }
    },
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.getImages()
    },
    //  切换收藏列表
    toggList () {
      this.reqImg.page = 1
      this.getImages()
    },
    // 视图更新
    async getImages () {
      // 从后台拿数据  根据接口地址
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqImg })
      this.images = data.results // results为后台服务器数据 赋值给定义的空数组
      this.total = data.total_count // 获取总条数
      console.log(data)
    },
    // 分页器
    pager (e) {
      this.reqImg.page = e
      this.getImages()
    },
    // 素材图片加对勾
    climg (url) {
      console.log(url) // 打印查看，可获得点击当前图片的地址
      this.getimgurl = url
    },
    // 图片上传
    upimgYe (res) {
      console.log(res)
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  margin-top: 15px;
  margin-right: 15px;
  .btn_box {
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.el-tab-pane {
  margin-bottom: 1px;
}
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
.img_list {
  padding-top: 20px;
  .img_item {
    width: 150px;
    height: 120px;
    // height: 130px;
    position: relative;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 25px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    &.imgurl::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 15px 15px;
    }
  }
}
</style>
