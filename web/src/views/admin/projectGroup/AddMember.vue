<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="添加成员"
      @leftClick="leftClick"
    />
    <van-form @submit="confirm()">
      <van-field
        v-model="model.name"
        name="姓名"
        label="姓名"
        placeholder="姓名"
        :rules="[{ required: true, message: '请填写成员姓名' }]"
      />
      <van-field name="性别" label="性别" :rules="[{ required: true, message: '请选择' }]">
        <template #input>
          <van-radio-group v-model="model.sex" direction="horizontal">
            <van-radio name="男" icon-size="20px">男</van-radio>
            <van-radio name="女" icon-size="20px">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="model.number"
        name="工号"
        label="工号"
        placeholder="工号"
        :rules="[{ required: true, message: '请填写工号' }]"
      />
      <div class="btn-group">
        <van-button plain hairline size="small" type="info" native-type="button" @click="cancel()">取消</van-button>
        <van-button plain hairline size="small" type="info" native-type="submit">确定</van-button>
      </div>
    </van-form>
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
      groupId: this.$route.query.groupId,
      model: {
        name: '',
        sex: '',
        number: ''
      }
    }
  },
  methods: {
    leftClick () {
      this.$router.go(-1)
    },
    cancel () {
      this.$router.go(-1)
    },
    async confirm () {
      let params = this.model
      params.groupId = this.groupId
      console.log('this.groupId: ', this.groupId)
      console.log('params: ', params)
      const res = await this.$ajax.post('/admin/addMember', params)
      if (res.data.code === 200) {
        this.$toast.success('添加成功！')
        this.$router.go(-1)
      } else if (res.data.code === 400) {
        this.$toast.fail(res.data.msg)
      }
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
    align-items: center;
    .van-button {
      font-size: 14px;
      padding: 0 14px;
    }
  }
}

</style>
