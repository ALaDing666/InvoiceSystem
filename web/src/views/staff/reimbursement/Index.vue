<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="records"
      leftText="报销单"
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
            <div>报销时间：{{ item.create_date }}</div>
          </div>
        </li>
        <template #right>
          <van-button v-show="item.status===3" square text="删除" type="danger" class="delete-button" />
          <!-- <van-button square text="删除" type="danger" class="delete-button" /> -->
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
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      let uid = sessionStorage.getItem('userId')
      const res = await this.$ajax.post(`/users/reimList`, { uid })
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
              this.getList()
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
