<template>
  <div class="container-img">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn_box">
        <el-radio-group v-model="reqImg.collect" @change="toggList" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 绿色按钮 -->
        <el-button @click="open" style="float:right" type="success" size="small">添加素材</el-button>
        <!-- 素材列表 -->
        <div class="img_list">
          <div class="img_item" v-for="item in images" :key="item.id">
            <img :src="item.url" alt />
            <div class="footer" v-if="!reqImg.collect">
              <span
                class="el-icon-star-off"
                @click="toostutas(item)"
                :class="{red:item.is_collected}"
              ></span>
              <span @click="deleteImg(item.id)" class="el-icon-delete"></span>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reqImg.per_page"
          :current-page="reqImg.page"
          @current-change="pager"
        ></el-pagination>
        <!-- 分页功能实现 1、获取总条数并声明一个总条数用来存储  2、从后台获得总条数 -->
      </div>
    </el-card>
    <!-- 添加素材 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="30%">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :on-success="upimgYe"
        :headers="headers"
        name="image"
      >
        <!-- action 上传的接口地址  element发送请求 地址要写全 -->
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line semi
import local from '@/utils/store.js';
export default {
  data () {
    return {
      reqImg: {
        collect: false,
        page: 1,
        per_page: 10
      },
      images: [], // 素材列表存放图片
      total: 0,
      dialogVisible: false,
      imageUrl: null,
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    upimgYe (res) {
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages()
      }, 2000)
      console.log(res)
    },
    // 更新页面
    async getImages () {
      // 从后台拿数据  根据接口地址
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqImg })
      this.images = data.results // results为后台服务器数据 赋值给定义的空数组
      this.total = data.total_count // 获取总条数
      console.log(data)
    },
    pager (e) {
      this.reqImg.page = e
      this.getImages()
    },
    toggList () {
      this.reqImg.page = 1
      this.getImages()
    },
    async toostutas (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      item.is_collected = data.collect
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    deleteImg (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '黑心提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(`user/images/${id}`)
          this.$message.success('删除成功,哼！！！')
          this.getImages()
        })
        .catch(() => {})
    }
  }
}
/**
 * 组件初始化之前拿数据
 * 然后进行渲染页面 使用异步方式
 */
</script>

<style scoped lang='less'>
.img_list {
  padding-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    // height: 130px;
    position: relative;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      width: 100%;
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        cursor: pointer;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
