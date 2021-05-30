<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="records"
      leftText="报销单"
    />
    <van-sticky offset-top="7vh">
      <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="order" :options="orders" @change="screen(order,status)" />
        <van-dropdown-item v-model="status" :options="statuses" @change="screen(order,status)" />
      </van-dropdown-menu>
    </van-sticky>
    <van-search
      v-model="searchValue"
      show-action
      shape="round"
      placeholder="请输入报销事由关键字"
      @search="onSearch"
      @cancel="onCancel"
    />
    <ul v-if="list.length">
      <van-swipe-cell v-for="(item, index) in list" :key="index" :name="item.id" ref="swipeCell" :before-close="beforeClose">
        <li @click="handleClick(item)">
          <div class="top">
            <h4>{{ item.reason }}</h4>
            <van-tag :color="reimStatusColor[item.status]" plain size="medium">
              {{ reimStatus[item.status] }}
            </van-tag>
          </div>
          <div class="bottom">
            <div>项目名称：{{ item.group_name }}</div>
            <div>报销金额：￥{{ item.reim_amount }}</div>
            <div>发起时间：{{ item.create_date }}</div>
          </div>
        </li>
        <template #right>
          <van-button v-show="item.status===3" square text="删除" type="danger" class="delete-button" />
        </template>
      </van-swipe-cell>
    </ul>
    <van-empty
      v-else
      class="custom-image"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无报销单~"
    />
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/staff/BottomNav.vue'
import { reimStatus, reimStatusColor } from '@/utils/enum.js'

export default {
  components: {
    TopNav,
    BottomNav
  },
  data () {
    return {
      reimStatus: reimStatus,
      reimStatusColor: reimStatusColor,
      searchValue: '',
      list: [],
      order: 'DESC',
      status: 'all',
      orders: [
        { text: '按发起时间降序', value: 'DESC' },
        { text: '按发起时间升序', value: 'ASC' }
      ],
      statuses: [
        { text: '全部状态', value: 'all' },
        { text: '进行中', value: 0 },
        { text: '未确认', value: 1 },
        { text: '已完成', value: 2 },
        { text: '已撤回', value: 3 }
      ]
    }
  },
  created () {
    this.screen(this.order, this.status)
  },
  methods: {
    async onSearch () {
      let uid = sessionStorage.getItem('userId')
      let params = {
        uid,
        value: this.searchValue
      }
      const res = await this.$ajax.post(`/users/searchReim?`, params)
      if (res.data.code === 200) {
        this.list = res.data.data
        this.order = 'DESC'
        this.status = 'all'
      }
    },
    onCancel () {
      this.screen(this.order, this.status)
    },
    // 筛选
    async screen (order, status) {
      this.searchValue = ''
      let uid = sessionStorage.getItem('userId')
      let params = { uid, order, status }
      const res = await this.$ajax.post(`/users/screenReim`, params)
      if (res.data.code === 200) {
        this.list = res.data.data
      }
    },
    // position 为关闭时点击的位置
    // instance 为对应的 SwipeCell 实例
    beforeClose ({ name, position, instance }) {
      switch (position) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          this.$dialog.confirm({
            message: '确定删除该报销单吗？'
          }).then(() => {
            console.log('name: ', name)
            this.$ajax.post('/users/deleteReim', { reimId: name }).then(res => {
              this.$toast.success('删除成功！')
              this.screen(this.order, this.status)
              instance.close()
            })
          }).catch(() => {})
          break
      }
    },
    handleClick (item) {
      // console.log('this.$refs.swipeCell: ', this.$refs.swipeCell)
      sessionStorage.setItem('reimItem', JSON.stringify(item))
      this.$router.push({
        name: 'ReimDetail',
        params: { item }
      })
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
        margin-bottom: 6px;
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
    .delete-button {
      height: 100%;
    }
  }
  /deep/ .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
</style>
