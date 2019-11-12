<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 粉丝列表 -->
          <div class="fans_list">
            <div class="fans_item" v-for="item in fanslist" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" size="small" plain>+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="pic">
          <div ref="dom" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line semi
import defultImg from '../../assets/hxz.jpg';
// eslint-disable-next-line semi
import echarts from 'echarts';
export default {
  data () {
    return {
      activeName: 'list',
      defultImg,
      reqParams: {
        per_page: 21,
        page: 1
      },
      total: 0,
      fanslist: []
    }
  },
  created () {
    this.fanslst()
  },
  methods: {
    async fanslst () {
      const {
        data: { data }
      } = await this.$http.get('/followers', { params: this.reqParams })
      console.log(data)
      this.fanslist = data.results
      this.total = data.total_count
    },
    pager (e) {
      this.reqParams.page = e
      this.fanslst()
    }
  },
  mounted () {
    const dom = this.$refs.dom
    const myEcharts = echarts.init(dom)
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    myEcharts.setOption(option)
  }
}
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 150px;
    height: 190px;
    text-align: center;
    border: 1px dashed #ddd;
    padding-top: 20px;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>
