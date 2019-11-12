<template>
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <!-- @change 事件监听数据的改变 -->
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'], // 接收父组件的数据  实现双向绑定
  data () {
    return {
      // value: null,
      options: []
    }
  },
  created () {
    this.channelOptions() // 获取频道数据
  },
  methods: {
    async channelOptions () {
      const {
        // async await 异步方式 es7新增 统称es6中的方式
        data: { data }
      } = await this.$http.get('channels') // 通过get方式的接口channels获取后台的数据 数据是一个对象，data中有一个channels方法 获取到了所有数据
      // 赋值下拉菜单当中的数据
      console.log(data)
      this.options = data.channels
    },
    fn (id) {
      if (id === '') id = null
      this.$emit('input', id) // 子传父 父组件自动接收，因为v-model原理中存在input
    }
  }
}
</script>

<style scoped lang='less'></style>
