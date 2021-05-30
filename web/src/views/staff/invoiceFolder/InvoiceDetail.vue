<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="发票详情"
      @leftClick="leftClick"
    />
    <van-form @submit="preserve()">
      <van-cell center :title="invoiceType[type]" >
        <template #right-icon>
          <img :src="model.pic" alt="" @click="preview()">
        </template>
      </van-cell>
      <!-- 共有的 -->
      <van-field
        class="status-field"
        v-model="invoiceStatus[status]"
        name="发票状态"
        label="发票状态"
        placeholder="-"
        readonly
      />
      <van-field
        v-if="type!==3&&type!==2"
        v-model="model.code"
        required
        :rules="[{ required: true, message: '' }]"
        name="发票代码"
        label="发票代码"
        placeholder="请输入发票代码"
        :readonly="readonly"
      />
      <van-field
        v-if="type!==3&&type!==2"
        v-model="model.number"
        required
        :rules="[{ required: true, message: '' }]"
        name="发票号码"
        label="发票号码"
        placeholder="请输入发票号码"
        :readonly="readonly"
      />
      <van-field
        v-if="type!==2"
        clickable
        required
        :rules="[{ required: true, message: '' }]"
        name="datetimePicker"
        :value="model.issue_date"
        label="开票日期"
        placeholder="选择日期"
        @click="isShowPicker"
        :readonly="readonly"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>

      <!-- 增值税专有 -->
      <!-- <div v-show="type===0"> -->
        <van-field
          v-if="type===0||type===3"
          v-model="model.total"
          required
          :rules="[{ required: true, message: '' }]"
          name="含税金额"
          type="number"
          label="含税金额"
          placeholder="请输入含税金额"
          :readonly="readonly"
        />
        <van-field
          v-if="type===0"
          v-model="model.buyer_name"
          required
          :rules="[{ required: true, message: '' }]"
          name="购买方"
          label="购买方"
          placeholder="请输入购买方"
          :readonly="readonly"
        />
        <van-field
          v-if="type===0"
          v-model="model.seller_name"
          required
          :rules="[{ required: true, message: '' }]"
          name="销售方"
          label="销售方"
          placeholder="请输入销售方"
          :readonly="readonly"
        />
      <!-- </div> -->

      <!-- 出租车专有 -->
        <van-field
          v-if="type===1"
          v-model="model.taxi_number"
          required
          :rules="[{ required: true, message: '' }]"
          name="车号"
          label="车号"
          placeholder="请输入车号"
          :readonly="readonly"
        />
        <van-field
          v-if="type===1"
          v-model="model.time"
          required
          :rules="[{ required: true, message: '' }]"
          name="上下车时间"
          label="上下车时间"
          placeholder="请输入上下车时间"
          :readonly="readonly"
        />
        <van-field
          v-if="type===1"
          v-model="model.unit_price"
          required
          :rules="[{ required: true, message: '' }]"
          name="单价"
          type="number"
          label="单价"
          placeholder="请输入单价"
          :readonly="readonly"
        />
        <van-field
          v-if="type===1"
          v-model="model.distance"
          required
          :rules="[{ required: true, message: '' }]"
          name="总里程"
          type="number"
          label="总里程"
          placeholder="请输入总里程"
          :readonly="readonly"
        />
        <van-field
          v-if="type===1"
          v-model="model.total"
          required
          :rules="[{ required: true, message: '' }]"
          name="实收金额"
          type="number"
          label="实收金额"
          placeholder="请输入实收金额"
          :readonly="readonly"
        />

      <quota-detail v-if="type===2" :readonly="readonly" :quota="model"></quota-detail>
      <van-field
        v-model="model.remarks"
        type="textarea"
        name="备注"
        label="备注"
        placeholder="请输入备注"
        show-word-limit
        maxlength="50"
        autosize
        :readonly="readonly"
      />
      <div class="btn-group">
        <van-button v-show="readonly && status===0" plain hairline size="small" type="info" native-type="button" @click="edit()">编辑</van-button>
        <van-button v-show="readonly && status===0" plain hairline size="small" type="info" native-type="button" @click="reimburse()">发起报销</van-button>
        <van-button v-show="!readonly" plain hairline size="small" type="info" native-type="button" @click="cancel()">取消</van-button>
        <van-button v-show="!readonly" plain hairline size="small" type="info" native-type="submit">保存</van-button>
      </div>
    </van-form>

    <van-loading v-if="show" size="30px" color="#0094ff" vertical></van-loading>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import QuotaDetail from './QuotaDetail.vue'
import { invoiceType, invoiceStatus } from '@/utils/enum.js'

export default {
  components: {
    TopNav,
    QuotaDetail
  },
  data () {
    return {
      invoiceType: invoiceType,
      invoiceStatus: invoiceStatus,
      show: false,
      type: 0,
      status: 0,
      model: {
        file: '',
        pic: '',
        code: '',
        number: '',
        taxi_number: '',
        issue_date: new Date().toLocaleDateString(),
        total: 0,
        location: '',
        time: '', // 上下车时间
        unit_price: 0,
        distance: 0,
        buyer_name: '',
        seller_name: '',
        remarks: ''
      },
      readonly: false,
      showPicker: false,
      // minDate: new Date(1970, 0, 1),
      // maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    }
  },
  created () {
    if (this.$route.params.result) { // 扫描录入结果
      this.type = this.$route.params.type
      let res = this.$route.params.result
      console.log('res: ', res)
      for (var item in this.model) {
        if (res[item]) this.model[item] = res[item]
      }
      if (this.type === 1) { // 针对出租车发票
        this.model.issue_date = res.date
      } else if (this.type === 2) {
        this.model.total = res.amount
      }
      if (this.model.issue_date) {
        this.model.issue_date = this.model.issue_date.replace('年', '-')
        this.model.issue_date = this.model.issue_date.replace('月', '-')
        this.model.issue_date = this.model.issue_date.replace('日', '')
      }
    } else if (this.$route.params.item) { // 发票详情
      let item = this.$route.params.item
      this.model = item
      this.model.pic = `http://192.168.0.9:3000/${item.pic}`
      this.type = item.type
      this.status = item.status
      this.readonly = true
    }
  },
  methods: {
    leftClick () {
      if (this.$route.params.result) {
        this.cancel()
      } else {
        this.$router.go(-1)
      }
    },
    preview () {
      this.$imagePreview([this.model.pic])
    },
    isShowPicker () {
      if (!this.readonly) {
        this.showPicker = true
      }
    },
    onConfirm (date) {
      console.log('date: ', date)
      this.model.issue_date = this.formatMyDate(date)
      console.log('this.model.issue_date: ', this.model.issue_date)
      this.showPicker = false
    },
    formatMyDate (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? ('0' + month) : month
      let day = date.getDate()
      day = day < 10 ? ('0' + day) : day
      return `${year}-${month}-${day}`
    },
    edit () {
      this.readonly = false
    },
    async cancel () {
      if (this.$route.params.item) {
        this.readonly = true
      } else {
        this.$dialog.confirm({
          message: '确认不保存此更改吗？'
        }).then(() => {
          this.$router.go(-1)
        }).catch(err => {
          console.log('err: ', err)
        })
      }
    },
    async preserve () {
      this.show = true
      let params = this.model
      params.type = this.type
      params.uid = sessionStorage.getItem('userId')
      if (params.id) {
        const res = await this.$ajax.post('/users/updateInvoice', params)
        if (res.data.code === 200) {
          this.show = false
          this.$toast.success('保存成功')
          this.$router.push('/invoiceFolder')
        } else {
          this.show = false
          this.$toast.fail(res.data.msg)
        }
      } else {
        let formData = new FormData() // 创建form对象
        formData.append('file', this.model.file) // 通过append向form对象添加数据
        formData.append('params', JSON.stringify(params)) // 通过append向form对象添加数据
        let config = { // 添加请求头
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        const res = await this.$ajax.post('/users/saveInvoice', formData, config)
        if (res.data.code === 200) {
          this.show = false
          this.$toast.success('录入成功')
          this.$router.push('/invoiceFolder')
        } else {
          this.show = false
          this.$toast.fail(res.data.msg)
        }
      }
    },
    reimburse () {
      this.$router.push({
        name: 'Initiate',
        params: {
          ids: [this.$route.params.item.id]
        }
      })
    }
  }
}

</script>

<style lang="less" scoped>
.van-form {
  // margin-top: 20px;
  padding-bottom: 8px;
  background-color: white;
  // /deep/.status-field input{
  //   color: rgb(143, 143, 143);
  // }
  .van-cell__title {
    font-size: 16px;
    font-weight: 700;
  }
  img {
    height: 18vw;
  }
  .btn-group {
    margin-top: 8px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .van-button {
      font-size: 14px;
      padding: 0 14px;
    }
  }
}
.van-loading {
  position: absolute;
  top: 45%;
  left: 45%;
}
</style>
