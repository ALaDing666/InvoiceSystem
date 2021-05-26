<template>
  <div>
    <van-tabbar v-model="active" route placeholder>
      <van-tabbar-item to="/reimburse" icon="balance-list">报销</van-tabbar-item>
      <van-tabbar-item to="/projectGroup" icon="wap-home">项目组</van-tabbar-item>
      <van-tabbar-item to="/member" icon="friends">成员</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  }
}

</script>

<style lang="less" scoped>

</style>
