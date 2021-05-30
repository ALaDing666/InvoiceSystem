<template>
  <div class="scan-content">
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="扫描录入"
      @leftClick="leftClick"
    />
    <van-radio-group v-model="type">
      <van-cell-group>
        <van-cell title="增值税发票" clickable @click="type = 0">
          <template #right-icon>
            <van-radio :name="0" />
          </template>
        </van-cell>
        <van-cell title="出租车发票" clickable @click="type = 1">
          <template #right-icon>
            <van-radio :name="1" />
          </template>
        </van-cell>
        <van-cell title="定额发票" clickable @click="type = 2">
          <template #right-icon>
            <van-radio :name="2" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <van-overlay :show="show">
      <van-loading size="30px" vertical>正在扫描中...</van-loading>
    </van-overlay>

    <input class="hide-file" ref ="inputFile" id="upload" type="file" @change="getFile($event)" accept="image/*">
    <div class="icon-box">
      <van-icon name="add" color="#1989fa" size="50" @click="clickFile()"/>
    </div>
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
      show: false,
      img: '',
      type: 0
    }
  },
  created () {

  },
  methods: {
    leftClick () {
      this.$router.go(-1)
    },
    // 点击触发input的点击事件
    clickFile () {
      this.$refs.inputFile.click()
    },
    // 获取选择的图片文件上传
    async getFile (e) {
      this.show = true
      let file = e.target.files[0]
      console.log('file: ', file)
      let pic = window.URL.createObjectURL(file) // 前端图片地址
      let formData = new FormData() // 创建form对象
      formData.append('file', file) // 通过append向form对象添加数据
      formData.append('type', this.type)
      let config = { // 添加请求头
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const res = await this.$ajax.post('/users/scanInvoice', formData, config)
      if (res.data.code === 200) {
        this.show = false
        res.data.data.pic = pic
        res.data.data.file = file
        this.$router.push({
          name: 'InvoiceDetail',
          params: {
            result: res.data.data,
            type: this.type
          }
        })
      } else {
        this.show = false
        this.$toast.fail(res.data.msg)
      }
    }
  }
}

</script>

<style lang="less" scoped>
.van-loading {
  margin-top: 40vh;
}
.van-cell {
  font-size: 16px;
}
.hide-file{
  display:none;
}
.icon-box {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 5vh;
}

.camera{
    position: relative;
    z-index: 2;
    margin: 0 auto;
    margin-bottom: 10px;
    width: 138px;
    height: 138px;
    background: #E7E7E7;
    border-radius: 6px;
    text-align: center;
    .bigImg{
      width: 138px;
      height: 138px;
    }
    .icon{
      width: 40px;
      margin-top: 40px;
    }
    .text{
      display: block;
      line-height: 22px;
      font-size: 15px;
      color: #999;
      margin-top: 8px;
    }
}

</style>
