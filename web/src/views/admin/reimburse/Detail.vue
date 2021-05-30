<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="报销详情"
      @leftClick="leftClick"
    />
    <van-cell-group>
      <van-cell
        center
        :title="model.group_name"
        size="large"
        :label="model.group_number"
      >
      <template #right-icon>
        <van-tag
          plain
          :color="reimStatusColor[model.status]"
          size="medium"
        >{{ adminReimStatus[model.status] }}</van-tag>
      </template>
      </van-cell>
      <van-cell title="报销人" :value="model.reim_person" />
      <van-cell title="发起时间" :value="model.create_date" />
      <van-cell title="发票金额" :value="'￥' + model.invo_amount" />
      <van-cell title="发票张数" :value="model.invo_quantity" />
      <van-cell title="报销金额" :value="'￥' + model.reim_amount" />
      <van-cell title="报销事由" :value="model.reason" />
      <div class="btn-group">
        <van-button
          v-show="model.status===0"
          round plain
          hairline
          size="small"
          type="info"
          @click="confirm()"
        >确认已报销</van-button>
      </div>
    </van-cell-group>

    <ul>
      <div class="title">相关发票</div>
      <li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <div class="top">
          <h4>{{ invoiceType[item.type] }}</h4>
          <span>￥{{ item.total }}</span>
        </div>
        <div class="bottom" v-if="item.type===0">
          <div>销售方：{{ item.seller_name }}</div>
          <div>购买方：{{ item.buyer_name }}</div>
          <div>开票日期：{{ item.issue_date }}</div>
        </div>
        <div class="bottom" v-if="item.type===1">
          <div>车号：{{ item.taxi_number }}</div>
          <div>上下车时间：{{ item.time }}</div>
          <div>开票日期：{{ item.issue_date }}</div>
        </div>
        <div class="bottom" v-if="item.type===2">
          <div>地址：{{ item.location }}</div>
          <div>备注：{{ item.remarks }}</div>
        </div>
        <div class="bottom" v-if="item.type===3">
          <div>备注：{{ item.remarks }}</div>
          <div>开票日期：{{ item.issue_date }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import { invoiceType, adminReimStatus, reimStatusColor } from '@/utils/enum.js'

export default {
  components: {
    TopNav
  },
  data () {
    return {
      invoiceType: invoiceType,
      adminReimStatus: adminReimStatus,
      reimStatusColor: reimStatusColor,
      model: {
        group_name: '',
        group_number: '',
        create_date: '',
        status: 0,
        invo_amount: '',
        invo_quantity: '',
        reim_amount: '',
        reason: ''
      },
      list: []
    }
  },
  created () {
    if (sessionStorage.getItem('reimItem')) {
      this.model = JSON.parse(sessionStorage.getItem('reimItem'))
      console.log('this.model: ', this.model)
      this.getInvoice()
    }
  },
  methods: {
    leftClick () {
      this.$router.go(-1)
    },
    async getInvoice () {
      let reimId = JSON.parse(sessionStorage.getItem('reimItem')).id
      const res = await this.$ajax.post(`/users/reimInvoice`, { reimId })
      if (res.data.code === 200) {
        this.list = res.data.data
      }
    },
    confirm () {
      this.$dialog.confirm({
        message: '确定已经报销完成吗？'
      }).then(() => {
        let reimId = JSON.parse(sessionStorage.getItem('reimItem')).id
        this.$ajax.post('/admin/confirmReim', { reimId }).then(res => {
          if (res.data.code === 200) {
            this.$toast.success('报销成功')
            this.$router.push('/Reimburse')
          } else {
            this.$toast.fail(res.data.msg)
          }
        })
      }).catch(() => {})
    },
    handleClick (item) {
      this.$router.push({
        name: 'InvoiceDetail',
        params: { item }
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .van-cell-group {
    padding-bottom: 8px;
    .btn-group {
      margin-top: 8px;
      display: flex;
      justify-content: space-around;
      .van-button {
        width: 30%;
      }
    }
  }
  ul {
    // background-color: rgb(247, 248, 250);
    background-color: white;
    margin: 14px 8px 8px;
    overflow: hidden;
    padding-bottom: 3vh;
    border-radius: 8px;
    border: 1px solid #eee;
    .title {
      font-size: 17px;
      font-weight: 700;
      margin: 8px 0 0 18px;
    }
    li {
      background-color: white;
      margin: 8px 14px 0;
      padding: 8px 12px;
      border-radius: 10px;
      border: 2px solid #eee;
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
</style>
