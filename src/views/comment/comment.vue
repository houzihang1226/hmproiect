/* eslint-disable semi */
<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="tablist">
        <el-table-column prop="title" label="标题" width="400"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="toostatus(scope.row.id,false)"
              v-if="scope.row.comment_status"
              type="danger"
              size="small"
            >关闭评论</el-button>
            <el-button @click="toostatus(scope.row.id,true)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqTab.per_page"
        :current-page="reqTab.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tablist: [],
      reqTab: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },
  created () {
    this.getarticles()
  },
  methods: {
    async getarticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqTab })
      console.log(data)
      this.tablist = data.results
      this.total = data.total_count
    },
    pager (e) {
      this.reqTab.page = e
      this.getarticles()
    },
    toostatus (id, status) {
      const text = status
        ? '您确定打开评论吗' // eslint-disable-next-line semi
        : '您确定关闭吗,将不能对该评论进行操作';
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${id}`, {
            allow_comment: status // comment_status 是当前的状态(正常和关闭)
          })
          this.$message.success(
            data.allow_comment ? '打开评论成功' : '关闭评论成功' // 当当前的状态是打开状态，按钮为关闭评论 相反状态为关闭则按钮为打开评论
          )
          this.getarticles()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'></style>
