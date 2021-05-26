<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="records"
      rigthIcon="share"
      leftText="报销管理"
      :actions="actions"
      @actionClick="actionClick"
    />
    <ul v-if="list.length">
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <div class="top">
          <h4>{{ item.group_name }}</h4>
          <div>￥{{ item.reim_amount }}</div>
        </div>
        <div class="bottom">
          <div>报销人：{{ item.reim_person }}</div>
          <div>报销时间：{{ item.create_date }}</div>
          <div>报销事由：{{ item.reason }}</div>
          <van-tag plain :color="reimStatusColor[item.status]" size="medium">{{ adminReimStatus[item.status] }}</van-tag>
        </div>
      </li>
    </ul>
    <bottom-nav/>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/admin/BottomNav.vue'
import { adminReimStatus, reimStatusColor } from '@/utils/enum.js'

export default {
  components: {
    TopNav,
    BottomNav
  },
  created () {
    this.getList()
  },
  data () {
    return {
      adminReimStatus: adminReimStatus,
      reimStatusColor: reimStatusColor,
      actions: [{ text: '退出登录' }],
      list: []
    }
  },
  methods: {
    async getList () {
      const res = await this.$ajax.get(`/admin/reimList`)
      if (res.data.code === 200) {
        this.list = res.data.data
      }
    },
    actionClick (action) {
      if (action.text === '退出登录') {
        this.$router.push('/')
      }
    },
    handleClick (item) {
      sessionStorage.setItem('reimItem', JSON.stringify(item))
      this.$router.push('/detail')
    }
  }
}

</script>

<style lang="less" scoped>
  ul {
    // background-color: rgb(247, 248, 250);
    padding-bottom: 3vh;
    li {
      background-color: white;
      margin: 8px 8px 0;
      padding: 8px 12px;
      border-radius: 10px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        div {
          font-size: 15px;
          color: rgb(143, 143, 143);
        }
      }
      .bottom {
        position: relative;
        div {
          font-size: 14px;
        }
        /deep/ .van-tag {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }
  }
</style>
