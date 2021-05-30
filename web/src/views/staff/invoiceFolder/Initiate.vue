<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="发起报销"
      @leftClick="leftClick"
    />
    <van-form @submit="confirm()">
      <van-field
        v-model="model.group_name"
        name="项目组名称"
        label="项目组名称"
        placeholder="项目组名称"
        readonly
      />
      <van-field
        v-model="model.group_number"
        name="项目组编号"
        label="项目组编号"
        placeholder="项目组编号"
        readonly
      />
      <van-field
        v-model="model.reim_person"
        name="报销人"
        label="报销人"
        placeholder="报销人"
        readonly
      />
      <van-field
        v-model="model.invo_amount"
        type="number"
        name="发票金额"
        label="发票金额"
        placeholder="发票金额"
        readonly
      />
      <van-field
        v-model="model.invo_quantity"
        name="发票张数"
        label="发票张数"
        placeholder="发票张数"
        readonly
      />
      <van-field
        v-model="model.reim_amount"
        required
        :rules="[{ required: true, message: '' }]"
        type="number"
        name="报销金额"
        label="报销金额"
        placeholder="请输入报销金额"
        :readonly="readonly"
      />
      <van-field
        v-model="model.reason"
        required
        :rules="[{ required: true, message: '' }]"
        type="textarea"
        name="报销事由"
        label="报销事由"
        placeholder="请输入报销事由"
        show-word-limit
        maxlength="50"
        autosize
        :readonly="readonly"
      />
      <div class="btn-group">
        <van-button round plain hairline size="small" type="info" native-type="button" @click="cancel()">&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;</van-button>
        <van-button round plain hairline size="small" type="info" native-type="submit">确定报销</van-button>
      </div>
    </van-form>

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
          <div>备注：{{ item.remarks }}</div>
          <van-tag plain :color="invoiceColor[item.status]" size="medium">{{ invoiceStatus[item.status] }}</van-tag>
        </div>
        <div class="bottom" v-if="item.type===3">
          <div>备注：{{ item.remarks }}</div>
          <div>开票日期：{{ item.issue_date }}</div>
          <van-tag plain :color="invoiceColor[item.status]" size="medium">{{ invoiceStatus[item.status] }}</van-tag>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import { invoiceType, invoiceStatus, invoiceColor } from '@/utils/enum.js'

export default {
  components: {
    TopNav
  },
  data () {
    return {
      invoiceType: invoiceType,
      invoiceStatus: invoiceStatus,
      invoiceColor: invoiceColor,
      ids: this.$route.params.ids,
      list: [],
      model: {
        group_name: JSON.parse(sessionStorage.getItem('userInfo')).groupName,
        group_number: JSON.parse(sessionStorage.getItem('userInfo')).groupNumber,
        reim_person: JSON.parse(sessionStorage.getItem('userInfo')).name,
        invo_amount: '',
        invo_quantity: '',
        reim_amount: '',
        reason: ''
      },
      readonly: false
    }
  },
  created () {
    if (this.$route.params.model) {
      console.log('this.$route.params: ', this.$route.params)
      this.model = this.$route.params.model
      this.list = this.$route.params.list
    } else {
      this.getList()
    }
  },
  methods: {
    leftClick () {
      if (this.$route.params.model) {
        this.$router.go(-1)
      } else {
        this.$router.push('/invoiceFolder')
      }
    },
    async getList () {
      // let { ids } = this.$route.params
      const res = await this.$ajax.post(`/users/getInvoice`, { ids: this.ids })
      if (res.data.code === 200) {
        this.list = res.data.data
        this.model.invo_quantity = this.list.length
        let total = 0
        for (var item of this.list) {
          total += item.total
        }
        this.model.invo_amount = total
      }
    },
    cancel () {
      if (this.$route.params.model) {
        this.$router.go(-1)
      } else {
        this.$router.push('/invoiceFolder')
      }
    },
    confirm () {
      let params = this.model
      params.group_id = JSON.parse(sessionStorage.getItem('userInfo')).group_id
      params.ids = this.ids
      params.uid = sessionStorage.getItem('userId')
      let url = this.$route.params.model ? '/users/reInitiate' : '/users/initiateReim'
      this.$dialog.confirm({
        message: `确认发起报销吗？`
      }).then(() => {
        this.$ajax.post(url, params).then(res => {
          if (res.data.code === 200) {
            this.$toast.success('已发起报销')
            this.$router.push('/reimbursement')
          } else {
            this.$toast.fail(res.data.msg)
          }
        })
      }).catch(err => {
        console.log('err: ', err)
      })
    },
    handleClick (item) {
      // console.log('item: ', item)
      // this.$router.push('/invoiceDetail')
    }
  }
}

</script>

<style lang="less" scoped>
.van-form {
  margin-top: 20px;
  padding-bottom: 8px;
  background-color: white;
  .btn-group {
    margin-top: 8px;
    display: flex;
    justify-content: space-around;
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
          // color: rgb(143, 143, 143);
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
