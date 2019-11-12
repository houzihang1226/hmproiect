/* eslint-disable semi */
<template>
  <div class="container-article">
    <!-- 卡片筛选布局 -->
    <el-card>
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="reqQuery.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- 频道 -->
          <my-channel v-model="reqQuery.channel_id">
            <!-- 子组件  -->
          </my-channel>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateAry"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果</span>
      </div>
      <!-- 表格 -->
      <!-- <el-table>是表格容器  data属性 指定的数据[是一个数组] <el-table-column>是列容器(竖着的) label 表头文字   prop当前列包含行(字段名称显示对应内容)   -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" fit="fill" class="img_1">
              <!-- scope.row是element组件的固定写法，拿数据使用 -->
              <div slot="error">
                <img src="../../assets/error.jpg" width="150px" height="100px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="toElidt(scope.row.id)"
              plain
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button type="danger" @click="del(scope.row.id)" plain icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="reqQuery.page"
        :page-size="reqQuery.per_page"
        style="margin-top:20px"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 筛选功能，不传值为全部，默认为全部
      reqQuery: {
        // 设置为null不会提交到后台 设置'' 会提交空字符串
        status: null, // 默认单选框的状态 0-4对应的是上面的结构的内容
        channel_id: null, // 频道id，不传为全部  父组件传值
        begin_pubdate: null, // 开始时间
        end_pubdate: null, // 结束时间
        page: 1, // 图片当前页数
        per_page: 20 // 每页显示多少图片
      },
      options: [
        { value: 1, label: '鸡' },
        { value: 2, label: '你' },
        { value: 3, label: '太' },
        { value: 4, label: '美' }
      ],
      dateArr: [], // 存放日期的开始时间和结束时间
      articles: [], // 存放表格数据
      total: 0 // 总条数
    }
  },
  created () {
    // this.channelOptions() // 获取频道数据
    this.channelTable()
  },
  methods: {
    // 获取频道选项数据
    // async channelOptions () {
    //   const {
    //     // async await 异步方式 es7新增 统称es6中的方式
    //     data: { data }
    //   } = await this.$http.get('channels') // 通过get方式的接口channels获取后台的数据 数据是一个对象，data中有一个channels方法 获取到了所有数据
    //   // 赋值下拉菜单当中的数据
    //   console.log(data)
    //   this.options = data.channels
    // }, // 获取文章总条数
    async channelTable () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqQuery }) // axios.get需要传参可以穿对象，传入对象必须写上params
      this.articles = data.results
      this.total = data.total_count
    },
    pager (e) {
      this.reqQuery.page = e
      this.channelTable()
    },
    dateAry (date) {
      // 拿到日期格式
      console.log(date)
      // 根据日期筛选
      if (date) {
        this.reqQuery.begin_pubdate = date[0]
        this.reqQuery.end_pubdate = date[1]
      } else {
        // eslint-disable-next-line semi
        this.reqQuery.begin_pubdate = '';
        // eslint-disable-next-line semi
        this.reqQuery.end_pubdate = '';
      }
    },
    search () {
      if (this.reqQuery.channel_id === '') this.reqQuery.channel_id = null // channel_id为状态，草稿之类的
      this.reqQuery.page = 1
      this.channelTable()
    },
    toElidt (id) {
      this.$router.push({ path: '/publish', query: { id } }) // 获取当前编辑文章的id 编辑跳转到发布文章页面，进行编辑
    }, // 9007199254740991 js最大安全数值 使用Number.MAX_SAFE_INTEGER方法查看
    async del (id) {
      // 删除 向后端发请求   根据当前id删除当前文章
      await this.$http.delete(`articles/${id}`)
      // 提示
      this.$message.success('删除文章成功')
      // 更新页面
      this.channelTable()
    }
  }
}
/**
 * 1、频道下拉选项
 *    在组件初始化之前
 *        -获取频道下拉选项的数据
 *        -然后设置给下拉选项的options
 */
</script>

<style scoped lang='less'>
.img_1 {
  width: 150px;
  height: 100px;
}
</style>
