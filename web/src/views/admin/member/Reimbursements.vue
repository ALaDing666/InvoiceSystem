<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="报销单"
      @leftClick="leftClick"
    />
    <ul v-if="list.length">
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <div class="top">
          <h4>{{ item.reason }}</h4>
          <van-tag plain :color="reimStatusColor[item.status]" size="medium">{{ adminReimStatus[item.status] }}</van-tag>
        </div>
        <div class="bottom">
          <div>项目名称：{{ item.group_name }}</div>
          <div>报销金额：￥{{ item.reim_amount }}</div>
          <div>报销时间：{{ item.create_date }}</div>
        </div>
      </li>
    </ul>
    <van-empty
      v-else
      class="custom-image"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无报销单~"
    />
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/staff/BottomNav.vue'
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
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    leftClick () {
      this.$router.go(-1)
    },
    async getList () {
      let id = this.$route.query.id
      const res = await this.$ajax.post('/admin/memberReim', { id })
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
  }
  /deep/ .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
</style>
