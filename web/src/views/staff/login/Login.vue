<template>
  <div class="login-box">
    <van-nav-bar title="">
      <template #right>
        <div class="right-btn" @click="adminLogin">
          <span>管理员登录</span>
          <van-icon name="arrow" size="18" />
        </div>
      </template>
    </van-nav-bar>
    <div class="logo">
      <img src="@/assets/image/logo-invoice.jpg" alt="">
    </div>
    <van-form @submit="login">
      <van-field
        v-model="model.number"
        name="工号"
        label="工号"
        left-icon="discount"
        size="large"
        placeholder="请输入工号"
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
      >
      <!-- <template #button>
        <van-button round plain hairline size="small" type="info" @click="sendCode">验证码登录</van-button>
      </template> -->
      </van-field>
      <!-- <div class="register" @click="goRegister">去注册</div> -->
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
        number: '',
        password: ''
      }
    }
  },
  methods: {
    adminLogin () {
      this.$router.push('/')
    },
    // goRegister () {
    //   this.$router.push('/register')
    // },
    async login () {
      if (!this.model.number || !this.model.password) {
        this.$toast.fail('未填写完整')
      } else {
        const res = await this.$ajax.post('/users/login', this.model)
        if (res.data.code === 200) {
          this.$toast.success('登录成功')
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem('userNum', this.model.number)
          const res1 = await this.$ajax.post(`/users/getUserInfo`, {number: this.model.number})
          if (res1.data.code === 200) {
            sessionStorage.setItem('userInfo', JSON.stringify(res1.data.data))
            sessionStorage.setItem('userId', JSON.stringify(res1.data.data.id))
            this.$router.push('/invoiceFolder')
          }
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
    span {
      font-size: 16px;
      color: rgb(25, 137, 250)
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
    .register {
      text-align: right;
      text-decoration: underline;
      margin-top: 2vh;
      padding-right: 7vw;
      font-size: 16px;
      color: rgb(25, 137, 250);
    }
  }
}

</style>
