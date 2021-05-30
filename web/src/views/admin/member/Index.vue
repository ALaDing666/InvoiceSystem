<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="records"
      leftText="成员管理"
    />
    <van-search
      v-model="searchValue"
      show-action
      placeholder="请输入姓名或工号"
      @search="onSearch"
      @cancel="onCancel"
    />
    <ul v-if="list.length">
      <van-checkbox-group v-model="result" ref="checkboxGroup">
      <li v-for="(item, index) in list" :key="index">
        <div class="top">
          <div>
            <div @click.stop="checkItem(item)">
              <van-checkbox v-model="item.checked" icon-size="16px" :name="item.id"/>
            </div>
            <h4>{{ item.name }}</h4>
          </div>
          <span>{{ item.number }}</span>
        </div>
        <div class="bottom">
          <div>性别：{{ item.sex }}</div>
          <div>项目组：{{ item.groupName }} ( {{item.groupNumber}} )</div>
        </div>
        <div class="right-btn" @click="handleClick(item)">
          <i>报销单({{ item.reimNum }})</i>
          <van-icon name="arrow" />
        </div>
      </li>
      </van-checkbox-group>
    </ul>

    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        title="项目组"
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>

    <van-cell class="bottom-cell">
      <van-checkbox v-model="allChecked" @click="handleSelectAll()">全选</van-checkbox>
      <template #right-icon>
          <van-button plain hairline type="danger" size="small" @click="remove()">删除</van-button>
          <!-- <van-button plain hairline type="info" size="small" @click="transfer()">转移</van-button> -->
      </template>
    </van-cell>
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
      searchValue: '',
      showPicker: false,
      columns: [],
      result: [],
      allChecked: false,
      list: []
    }
  },
  created () {
    this.getList()
    this.getColumns()
  },
  methods: {
    async getList () {
      const res = await this.$ajax.get('/admin/memberList')
      if (res.data.code === 200) {
        this.list = res.data.data
      }
    },
    async getColumns () {
      const res = await this.$ajax.get(`/admin/groupList`)
      if (res.data.code === 200) {
        for (var item of res.data.data) {
          let option = { id: item.id, text: item.name, disabled: false }
          this.columns.push(option)
        }
      }
    },
    async onSearch () {
      const res = await this.$ajax.post(`/admin/searchMember?value=${this.searchValue}`)
      if (res.data.code === 200) {
        this.list = res.data.data
        this.$refs.checkboxGroup.toggleAll(false)
      }
    },
    onCancel () {
      this.getList()
    },
    handleClick (item) {
      this.$router.push(`/reimbursements?id=${item.id}`)
    },
    checkItem (item) {
      item.checked = !item.checked
      for (var i of this.list) {
        if (!i.checked) {
          this.allChecked = false
          return
        }
      }
      this.allChecked = true
    },
    handleSelectAll () {
      if (!this.allChecked) {
        this.$refs.checkboxGroup.toggleAll()
      } else {
        this.$refs.checkboxGroup.toggleAll(true)
      }
    },
    async remove () {
      if (this.result.length) {
        this.$dialog.confirm({
          message: `确认删除成员吗？`
        }).then(() => {
          let params = { membersId: this.result }
          this.$ajax.post('/admin/deleteMember', params).then(res => {
            if (res.data.code === 200) {
              this.$toast.success('删除成功！')
              this.getList()
            }
          })
        }).catch(err => {
          console.log('err: ', err)
        })
      } else {
        this.$toast.fail('未选择成员')
      }
    },
    // 转移
    transfer () {
      if (this.result.length) {
        this.showPicker = true
      } else {
        this.$toast.fail('未选择成员')
      }
    },
    async onConfirm (option) {
      console.log('option: ', option)
      this.showPicker = false
      let params = {
        membersId: this.result,
        groupId: option.id
      }
      const res = await this.$ajax.post('/admin/transferMember', params)
      if (res.data.code === 200) {
        this.$toast.success('转移成功')
        this.getList()
        this.$refs.checkboxGroup.toggleAll(false)
      }
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
      position: relative;
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
          display: flex;
          align-items: center;
          .van-checkbox {
            margin-right: 4px;
          }
        }
      }
      .bottom {
        margin-left: 18px;
        position: relative;
        div {
          font-size: 14px;
          color: rgb(143, 143, 143);
        }
        /deep/ .van-tag {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .right-btn {
        display: flex;
        align-items: center;
        position: absolute;
        right: 12px;
        bottom: 8px;
        color: rgb(25, 137, 250);
        font-size: 15px;
        i {
          font-style: normal;
        }
        .van-icon {
          padding-top: 3px;
        }
      }
    }
  }
  .bottom-cell {
    border-top: 2px solid #eee;
    border-bottom: 1px solid #eee;
    position: fixed;
    bottom: 49px;
    .van-button {
      margin-left: 14px;
      font-size: 14px;
      padding: 0 12px;
    }
    .van-cell__value--alone {
      margin: auto;
      .van-checkbox {
        width: 40%;
      }
    }
  }
</style>
