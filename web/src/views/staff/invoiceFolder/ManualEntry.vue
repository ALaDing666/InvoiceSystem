<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="记一笔"
      @leftClick="leftClick"
    />
    <van-form @submit="preserve()">
      <van-cell center :title="invoiceType[model.type]" >
        <template #right-icon>
          <van-uploader :file-list="fileList" max-count="1" :after-read="afterRead" preview-size="70px"/>
        </template>
      </van-cell>
      <van-field
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
      <van-field
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
        <van-button v-show="!readonly" plain hairline size="small" type="info" native-type="button" @click="cancel()">取消</van-button>
        <van-button v-show="!readonly" plain hairline size="small" type="info" native-type="submit">保存</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import TopNav from '@/components/common/TopNav.vue'
import { invoiceType } from '@/utils/enum.js'

export default {
  components: {
    TopNav
  },
  data () {
    return {
      invoiceType: invoiceType,
      fileList: [],
      model: {
        type: 3,
        file: '',
        issue_date: '',
        total: '',
        remarks: ''
      },
      readonly: false,
      showPicker: false,
      currentDate: new Date()
    }
  },
  methods: {
    leftClick () {
      this.$router.go(-1)
    },
    afterRead (e) {
      console.log('e: ', e)
      this.model.file = e.file
      let url = window.URL.createObjectURL(e.file)
      this.fileList.push({ url, name: 'invoice', isImage: true, deletable: false })
      console.log('fileList: ', this.fileList)
    },
    isShowPicker () {
      this.showPicker = true
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
    cancel () {
      this.$router.go(-1)
    },
    async preserve () {
      let params = this.model
      params.uid = sessionStorage.getItem('userId')
      console.log('params111111111111: ', params)
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
        this.$toast.success('录入成功')
        this.$router.push('/invoiceFolder')
      } else {
        this.$toast.fail(res.data.msg)
      }
    }
  }
}

</script>
<style lang="less" scoped>
.van-form {
  padding-bottom: 8px;
  background-color: white;
  .van-cell__title {
    font-size: 16px;
    font-weight: 700;
  }
  /deep/.status-field input{
    color: rgb(143, 143, 143);
  }
  .icon-box {
    border-radius: 6px;
    background-color: rgb(247, 248, 250);
    .van-icon {
      margin: 4px;
    }
  }
  .hide-file {
    display:none;
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
</style>
