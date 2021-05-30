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
    <van-sticky offset-top="7vh">
      <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="order" :options="orders" @change="screen(order,status)" />
        <van-dropdown-item v-model="status" :options="statuses" @change="screen(order,status)" />
      </van-dropdown-menu>
    </van-sticky>

    <ul v-if="list.length">
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <div class="top">
          <h4>{{ item.group_name }}</h4>
          <div>￥{{ item.reim_amount }}</div>
        </div>
        <div class="bottom">
          <div>报销人：{{ item.reim_person }}</div>
          <div>发起时间：{{ item.create_date }}</div>
          <div>报销事由：{{ item.reason }}</div>
          <van-tag plain :color="reimStatusColor[item.status]" size="medium">{{ adminReimStatus[item.status] }}</van-tag>
        </div>
      </li>
    </ul>
    <van-empty
      v-else
      class="custom-image"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无报销单~"
    />
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
  data () {
    return {
      adminReimStatus: adminReimStatus,
      reimStatusColor: reimStatusColor,
      actions: [{ text: '退出登录' }],
      list: [],
      order: 'DESC',
      status: 'all',
      orders: [
        { text: '按发起时间降序', value: 'DESC' },
        { text: '按发起时间升序', value: 'ASC' }
      ],
      statuses: [
        { text: '全部状态', value: 'all' },
        { text: '未报销', value: 0 },
        { text: '待确认', value: 1 },
        { text: '已完成', value: 2 }
      ]
    }
  },
  created () {
    this.screen(this.order, this.status)
  },
  methods: {
    actionClick (action) {
      if (action.text === '退出登录') {
        this.$dialog.confirm({
          message: `确认退出登录吗？`
        }).then(() => {
          sessionStorage.clear()
          this.$router.push('/')
        }).catch(err => {
          console.log('err: ', err)
        })
      }
    },
    // 筛选
    async screen (order, status) {
      let params = { order, status }
      const res = await this.$ajax.post(`/admin/screenReim`, params)
      if (res.data.code === 200) {
        this.list = res.data.data
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
  /deep/ .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
</style>
