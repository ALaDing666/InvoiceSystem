<template>
  <div>
    <van-tabbar v-model="active" route placeholder>
      <van-tabbar-item to="/invoiceFolder" icon="card">发票夹</van-tabbar-item>
      <van-tabbar-item to="/reimbursement" icon="balance-list">报销单</van-tabbar-item>
      <van-tabbar-item to="/staffInfo" icon="manager">我的</van-tabbar-item>
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
