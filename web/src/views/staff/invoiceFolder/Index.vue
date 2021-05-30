<template>
  <div class="invoice-box">
    <top-nav
      :isShow="true"
      leftIcon="records"
      rigthIcon="plus"
      leftText="发票夹"
      :actions="actions"
      @actionClick="actionClick"
    />
    <van-sticky offset-top="7vh">
      <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="order" :options="orders" @change="screen(order,type,status)" />
        <van-dropdown-item v-model="type" :options="types" @change="screen(order,type,status)" />
        <van-dropdown-item v-model="status" :options="statuses" @change="screen(order,type,status)" />
      </van-dropdown-menu>
    </van-sticky>

    <ul v-if="list.length">
      <van-checkbox-group v-model="result" ref="checkboxGroup">
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <div class="top">
          <div>
            <div @click.stop="checkItem(item)">
              <van-checkbox v-model="item.checked" v-if="item.status===0" icon-size="16px" :name="item.id"/>
            </div>
            <h4>{{ invoiceType[item.type] }}</h4>
          </div>
          <span>￥{{ item.total }}</span>
        </div>
        <div class="bottom" v-if="item.type===0">
          <div>销售方：{{ item.seller_name }}</div>
          <div>购买方：{{ item.buyer_name }}</div>
          <div>开票日期：{{ item.issue_date }}</div>
          <van-tag plain :color="invoiceColor[item.status]" size="medium">{{ invoiceStatus[item.status] }}</van-tag>
        </div>
        <div class="bottom" v-if="item.type===1">
          <div>车号：{{ item.taxi_number }}</div>
          <div>上下车时间：{{ item.time }}</div>
          <div>开票日期：{{ item.issue_date }}</div>
          <van-tag plain :color="invoiceColor[item.status]" size="medium">{{ invoiceStatus[item.status] }}</van-tag>
        </div>
       <div class="bottom" v-if="item.type===2">
          <div>地址：{{ item.location }}</div>
          <div>备注：{{ item.remarks || '无' }}</div>
          <van-tag plain :color="invoiceColor[item.status]" size="medium">{{ invoiceStatus[item.status] }}</van-tag>
        </div>
        <div class="bottom" v-if="item.type===3">
          <div>开票日期：{{ item.issue_date }}</div>
          <div>备注：{{ item.remarks || '无' }}</div>
          <van-tag plain :color="invoiceColor[item.status]" size="medium">{{ invoiceStatus[item.status] }}</van-tag>
        </div>
      </li>
      </van-checkbox-group>
    </ul>
    <van-empty
      v-else
      class="custom-image"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="发票夹空空如也~"
    />
    <van-cell>
      <van-checkbox v-model="allChecked" @click="handleSelectAll()">全选</van-checkbox>
      <template #right-icon>
          <van-button plain hairline type="danger" size="small" @click="remove()">删除</van-button>
          <van-button plain hairline type="info" size="small" @click="reimburse()">报销</van-button>
      </template>
    </van-cell>
    <bottom-nav/>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/staff/BottomNav.vue'
import { invoiceType, invoiceStatus, invoiceColor } from '@/utils/enum.js'

export default {
  components: {
    TopNav,
    BottomNav
  },
  data () {
    return {
      invoiceType: invoiceType,
      invoiceStatus: invoiceStatus,
      invoiceColor: invoiceColor,
      userNum: sessionStorage.getItem('userNum'),
      result: [],
      allChecked: false,
      list: [],
      actions: [{ text: '手动添加' }, { text: '扫描录入' }],
      order: 'DESC',
      type: 'all',
      status: 'all',
      orders: [
        { text: '按录入时间降序', value: 'DESC' },
        { text: '按录入时间升序', value: 'ASC' }
      ],
      types: [
        { text: '全部种类', value: 'all' },
        { text: '增值税发票', value: 0 },
        { text: '出租车发票', value: 1 },
        { text: '定额发票', value: 2 },
        { text: '其他票据', value: 3 }
      ],
      statuses: [
        { text: '全部状态', value: 'all' },
        { text: '未报销', value: 0 },
        { text: '报销中', value: 1 },
        { text: '未确认', value: 2 },
        { text: '已完成', value: 3 },
        { text: '已撤回', value: 4 }
      ]
    }
  },
  created () {
    // this.getList()
    this.screen(this.order, this.type, this.status)
  },
  methods: {
    actionClick (action) {
      if (action.text === '手动添加') {
        this.$router.push('/manualEntry')
      } else { // 扫描录入
        this.$router.push('/scanInvoice')
      }
    },
    // async getList () {
    //   const res = await this.$ajax.get(`/users/invoiceList`)
    //   if (res.data.code === 200) {
    //     this.list = res.data.data
    //     console.log('this.list: ', this.list)
    //   }
    // },
    // 筛选
    async screen (order, type, status) {
      console.log('order, type, status: ', order, type, status)
      let params = { order, type, status }
      params.uid = sessionStorage.getItem('userId')
      const res = await this.$ajax.post(`/users/screenInvoice`, params)
      if (res.data.code === 200) {
        this.list = res.data.data
      }
    },
    handleClick (item) {
      console.log('item: ', item)
      // this.$router.push('/invoiceDetail')
      this.$router.push({
        name: 'InvoiceDetail',
        params: { item }
      })
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
    remove () {
      console.log('result: ', this.result)
      if (this.result.length) {
        this.$dialog.confirm({
          message: `确认删除发票吗？`
        }).then(() => {
          let params = { invoiceIds: this.result }
          this.$ajax.post('/users/deleteInvoice', params).then(res => {
            if (res.data.code === 200) {
              this.$toast.success('删除成功！')
              this.screen(this.order, this.type, this.status)
            }
          })
        }).catch(err => {
          console.log('err: ', err)
        })
      } else {
        this.$toast.fail('未选择发票')
      }
    },
    reimburse () {
      console.log('result: ', this.result)
      if (this.result.length) {
        this.$router.push({
          name: 'Initiate',
          params: {
            ids: this.result
          }
        })
      } else {
        this.$toast.fail('未选择发票')
      }
    }
  }

}

</script>

<style lang="less" scoped>
.invoice-box {
  height: 100vh;
  // background-color: rgb(247, 248, 250);
  ul {
    padding-bottom: 10vh;
    li {
      background-color: white;
      margin: 8px 8px 0;
      padding: 8px 12px;
      border-radius: 10px;
      .top {
        display: flex;
        justify-content: space-between;
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
    }
  }
  /deep/ .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
  .van-cell {
    border-top: 2px solid #eee;
    border-bottom: 1px solid #eee;
    position: fixed;
    bottom: 49px;
    .van-button {
      margin-left: 14px;
    }
    .van-cell__value--alone {
      margin: auto;
      .van-checkbox {
        width: 40%;
      }
    }
  }
}

</style>
