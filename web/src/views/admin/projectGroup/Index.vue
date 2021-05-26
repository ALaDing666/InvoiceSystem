<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="records"
      rigthIcon="plus"
      leftText="项目组管理"
      :actions="actions"
      @actionClick="actionClick"
    />
    <van-search
      v-model="searchValue"
      show-action
      placeholder="请输入项目组名称"
      @search="onSearch"
      @cancel="onCancel"
    />
    <ul v-if="list.length">
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <div class="top">
          <h4>{{ item.name }}</h4>
          <span>{{ item.memberNum }}人</span>
        </div>
        <div class="bottom">
          <div>{{ item.create_date }}</div>
          <div>{{ item.descpt }}</div>
        </div>
        <van-button
          v-show="item.memberNum === 0"
          plain
          type="info"
          size="small"
          @click.stop="disband(item)"
        >解散</van-button>
      </li>
    </ul>
    <bottom-nav/>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/admin/BottomNav.vue'

export default {
  components: {
    TopNav,
    BottomNav
  },
  data () {
    return {
      groups: [],
      actions: [{ text: '添加项目组' }],
      searchValue: '',
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      const res = await this.$ajax.get('/admin/groupList')
      if (res.data.code === 200) {
        this.list = res.data.data
        console.log('this.list: ', this.list)
      }
    },
    actionClick (action) {
      if (action.text === '添加项目组') {
        this.$router.push('/editGroup')
      }
    },
    async onSearch () {
      const res = await this.$ajax.post(`/admin/searchGroup?value=${this.searchValue}`)
      if (res.data.code === 200) {
        this.list = res.data.data
      }
    },
    onCancel () {
      this.getList()
    },
    handleClick (item) {
      this.$router.push(`/groupDetail?groupId=${item.id}`)
    },
    async disband (item) {
      this.$dialog.confirm({
        message: `确认解散${item.name}项目组吗？`
      }).then(() => {
        this.$ajax.post(`/admin/disbandGroup?id=${item.id}`).then(res => {
          if (res.data.code === 200) {
            this.$toast.success('解散成功！')
            this.getList()
          }
        })
      }).catch(err => {
        console.log('err: ', err)
      })
    }
  },
  mounted () {
    // this.getList()
  }
}

</script>

<style lang="less" scoped>
  ul {
    padding-bottom: 10vh;
    li {
      background-color: white;
      margin: 8px 8px 0;
      padding: 8px 12px;
      border-radius: 10px;
      position: relative;
      .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        h4 {
          // color: rgb(85, 85, 85);
        }
      }
      .bottom {
        // position: relative;
        div {
          font-size: 14px;
          color: rgb(143, 143, 143);
        }
      }
      .van-button {
        position: absolute;
        bottom: 8px;
        right: 12px;
        height: 26px;
      }
    }
  }
</style>
