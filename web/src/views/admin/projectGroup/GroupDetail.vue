<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="项目组详情"
      rigthIcon="edit"
      :actions="actions"
      @actionClick="actionClick"
      @leftClick="leftClick"
    />
    <van-cell-group>
      <van-cell title="名称" size="large" :value="model.name" />
      <van-cell title="编号" size="large" :value="model.number" />
      <van-cell title="创建时间" size="large" :value="model.create_date" />
      <van-cell title="成员人数" size="large" :value="model.memberNum" />
      <van-cell title="报销单数" size="large" :value="model.reimNum" />
      <van-cell title="描述" size="large" :value="model.descpt" />
    </van-cell-group>

    <ul v-if="list.length">
      <van-checkbox-group v-model="result" ref="checkboxGroup">
      <li v-for="(item, index) in list" :key="index">
        <div class="top">
          <div @click.stop="checkItem(item)">
            <van-checkbox v-model="item.checked" icon-size="16px" :name="item.id"/>
          </div>
          <h4>{{ item.name }}</h4>
        </div>
        <div class="bottom">
          <div>性别：{{ item.sex }}</div>
          <div>工号：{{ item.number }}</div>
        </div>
        <div class="right-btn" @click="handleClick(item)">
          <i>报销单({{ item.reimNum }})</i>
          <van-icon name="arrow" />
        </div>
      </li>
      </van-checkbox-group>
    </ul>

    <van-cell v-show="list.length" class="bottom-cell">
      <van-checkbox v-model="allChecked" @click="handleSelectAll()">全选</van-checkbox>
      <template #right-icon>
          <!-- <van-button plain hairline type="danger" size="small" @click="remove()">删除</van-button> -->
          <van-button plain hairline type="info" size="small" @click="transfer()">转移</van-button>
      </template>
    </van-cell>

    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        title="项目组"
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'

export default {
  components: {
    TopNav
  },
  data () {
    return {
      model: {
        name: '',
        number: '',
        create_date: '',
        memberNum: 0,
        reimNum: 0,
        descpt: ''
      },
      groupId: Number(this.$route.query.groupId),
      actions: [{ text: '编辑项目组' }, { text: '添加成员' }],
      result: [],
      allChecked: false,
      showPicker: false,
      columns: [], // 所有项目组名
      list: []
    }
  },
  created () {
    this.getDetail(this.groupId)
    this.getColumns()
  },
  methods: {
    async getDetail (groupId) {
      const res = await this.$ajax.get(`/admin/groupDetail?id=${groupId}`)
      if (res.data.code === 200) {
        let data = res.data.data
        this.model = data
        this.list = data.members
      }
    },
    async getColumns () {
      const res = await this.$ajax.get(`/admin/groupList`)
      if (res.data.code === 200) {
        for (var item of res.data.data) {
          let option = { id: item.id, text: item.name, disabled: false }
          if (item.id === this.groupId) {
            option.disabled = true
          }
          this.columns.push(option)
        }
      }
    },
    actionClick (action) {
      if (action.text === '编辑项目组') {
        this.$router.push({
          path: '/editGroup',
          query: {
            groupId: this.groupId,
            name: this.model.name,
            number: this.model.number,
            descpt: this.model.descpt
          }
        })
      } else {
        this.$router.push(`/addMember?groupId=${this.groupId}`)
      }
    },
    leftClick () {
      this.$router.push('/projectGroup')
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
              this.getDetail(this.groupId)
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
        this.$toast.fail('请选择成员')
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
        this.getDetail(this.groupId)
      }
    }
  },
  mounted () {
    // this.getDetail(this.groupId)
  }
}

</script>

<style lang="less" scoped>
.van-cell-group {
  border-bottom: 1px solid #eee;
}
  ul {
    padding-bottom: 10vh;
    li {
      background-color: white;
      position: relative;
      margin: 8px 8px 0;
      padding: 8px 12px;
      border-radius: 10px;
      .top {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        .van-checkbox {
          margin-right: 4px;
        }
      }
      .bottom {
        margin-left: 18px;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        // align-items: center;
        div {
          font-size: 14px;
        }
      }
      .right-btn {
        display: flex;
        align-items: center;
        position: absolute;
        right: 12px;
        bottom: 40%;
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
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    position: fixed;
    bottom: 0;
    .van-button {
      margin-left: 14px;
      font-size: 14px;
      padding: 0 12px;
    }
    .van-cell__value--alone {
      margin: auto;
      .van-checkbox {
        width: 50%;
      }
    }
  }
</style>
