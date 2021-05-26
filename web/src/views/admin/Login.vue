<template>
  <div class="login-box">
    <van-nav-bar title="">
      <template #right>
        <div class="right-btn" @click="staffLogin">
          <span>员工登录</span>
          <van-icon name="arrow" size="18" />
        </div>
      </template>
    </van-nav-bar>
    <div class="logo">
      <img src="@/assets/image/logo-invoice.jpg" alt="">
    </div>
    <van-form @submit="login()">
      <van-field
        v-model="model.username"
        name="账号"
        label="账号"
        left-icon="manager-o"
        size="large"
        placeholder="请输入管理员账号"
        clearable
      />
      <van-field
        v-model="model.password"
        type="password"
        name="密码"
        label="密码"
        left-icon="lock"
        size="large"
        placeholder="请输入密码"
        clearable
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          登录
        </van-button>
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
      model: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    staffLogin () {
      this.$router.push('/staffLogin')
    },
    async login () {
      if (!this.model.username || !this.model.password) {
        this.$toast.fail('未填写完整')
      } else {
        const res = await this.$ajax.post('/admin/login', this.model)
        if (res.data.code === 200) {
          this.$toast.success('登录成功')
          sessionStorage.setItem('token', res.data.token)
          this.$router.push('/reimburse')
        } else {
          this.$toast.fail(res.data.msg)
        }
      }
    }
  }
}

</script>

<style lang="less" scoped>
.login-box {
  height: 100vh;
  background-color: white;
  .right-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 3vh;
    span {
      font-size: 16px;
      color: rgb(25, 137, 250);
    }
  }
  .logo {
    text-align: center;
    margin: 8vh auto;
    img {
      width: 40vw;
    }
  }
  .van-form {
    padding: 0 7vw;
    /deep/ .van-field__label {
      width: 18vw;
    }
    /deep/ .van-icon {
      font-size: 20px;
    }
  }
}

</style>
