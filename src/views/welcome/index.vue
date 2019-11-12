<template>
  <div class="welcome">
    <img src="../../assets/1.jpg" width="100%" alt />
  </div>
</template>

<script>
export default {
  // 测试
  created () {
    this.$http
      .get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
      .then(res => {
        console.log(res.data)
      })
      .catch(() => {
        console.log('error')
      })
  }
}
</script>

<style scoped lang='less'>
</style>
