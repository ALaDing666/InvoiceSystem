<template>
  <div class="register-box">
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
    <van-form>
      <van-field
        v-model="jobNum"
        name="工号"
        label="工号"
        left-icon="discount"
        size="large"
        placeholder="请输入工号"
        clearable
      />
      <van-field
        v-model="phone"
        name="手机号"
        label="手机号"
        left-icon="user-o"
        size="large"
        placeholder="请输入手机号"
        clearable
      />
      <van-field
        v-model="code"
        name="验证码"
        label="验证码"
        left-icon="certificate"
        size="large"
        placeholder="请输入验证码"
        clearable
      >
      <template #button>
        <!-- <span class="btn-code" @click="sendCode">立即获取</span> -->
        <!-- <van-button size="small" type="primary">立即获取</van-button> -->
        <van-button plain hairline size="small" type="info" @click="sendCode">立即获取</van-button>
      </template>
      </van-field>
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        left-icon="lock"
        size="large"
        placeholder="请设置登录密码"
        clearable
      />
      <div class="register" @click="goLogin">去登录</div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="register">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      jobNum: '',
      phone: '',
      code: '',
      password: ''
    }
  },
  methods: {
    adminLogin () {
      this.$router.push('/')
    },
    goLogin () {
      this.$router.push('/staffLogin')
    },
    sendCode () {
      if (!this.phone) {
        this.$toast.fail('未填写手机号')
      } else {
        this.$ajax.post()
      }
    },
    register () {
      if (this.jobNum && this.phone && this.code && this.password) {

      } else {
        this.$toast.fail('未填写完整')
      }
    }
  }
}

</script>

<style lang="less" scoped>
.register-box {
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
    .btn-code {
      color: rgb(25, 137, 250);
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
