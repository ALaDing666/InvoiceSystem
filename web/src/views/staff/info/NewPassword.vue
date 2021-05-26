<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="修改密码"
      @leftClick="leftClick"
    />
    <van-form>
      <van-field
        v-model="password"
        type="password"
        label="原密码"
        placeholder="请输入原密码"
      />
      <van-field
        v-model="newPassword_1"
        type="password"
        label="新密码"
        placeholder="请输入新密码"
      />
      <van-field
        v-model="newPassword_2"
        type="password"
        label="确认新密码"
        placeholder="请再次输入新密码"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" @click="submit()">提交</van-button>
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
      password: '',
      newPassword_1: '',
      newPassword_2: ''
    }
  },
  methods: {
    leftClick () {
      this.$router.go(-1)
    },
    async submit () {
      if (this.password && this.newPassword_1 && this.newPassword_2) {
        let params = {
          userNum: sessionStorage.getItem('userNum'),
          password: this.password,
          newPassword_1: this.newPassword_1,
          newPassword_2: this.newPassword_2
        }
        const res = await this.$ajax.post('/users/changePwd', params)
        if (res.data.code === 200) {
          this.$toast.success('修改成功')
          this.$router.go(-1)
        } else {
          this.$toast.fail(res.data.msg)
        }
      } else {
        this.$toast.fail('请填写完整')
      }
    }
  }
}

</script>

<style lang="less" scoped>
.van-form {
  margin-top: 5vh;
}
</style>
