<template>
  <div>
    <div class="top"></div>
    <div class="info">
      <van-icon size="55" color="#fff" name="user-circle-o" />
      <span class="name">{{ model.name }}</span>
      <div class="detail">
        <span class="icon-line"></span>
        <van-cell-group title="个人资料" :border="false">
          <van-cell title="项目组" :value="model.groupName" size="large" icon="wap-home" />
          <van-cell title="工号" :value="model.number" size="large" icon="setting" />
          <van-cell title="性别" :value="model.sex" size="large" icon="manager" />
          <!-- <van-cell title="手机号" value="13777856952" size="large" icon="phone" /> -->
          <van-cell title="修改密码" size="large" icon="lock" is-link @click="modify()"/>
          <van-cell title="退出登录" size="large" icon="share" is-link @click="signOut()"/>
        </van-cell-group>
      </div>
    </div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import BottomNav from '@/components/staff/BottomNav.vue'

export default {
  components: {
    BottomNav
  },
  data () {
    return {
      userNum: sessionStorage.getItem('userNum'),
      model: {
        name: '',
        groupName: '',
        number: '',
        sex: ''
      }
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    async getInfo () {
      const res = await this.$ajax.post(`/users/getUserInfo`, {number: this.userNum})
      if (res.data.code === 200) {
        this.model = res.data.data
      }
    },
    modify () {
      this.$router.push('/newPassword')
    },
    signOut () {
      this.$dialog.confirm({
        message: `确认退出登录吗？`
      }).then(() => {
        sessionStorage.clear()
        this.$router.push('/staffLogin')
      }).catch(err => {
        console.log('err: ', err)
      })
    }
  }
}

</script>

<style lang="less" scoped>
.top {
  height: 35vh;
  width: 100%;
  background-color: rgb(25, 137, 250);
  // background-color: #60A2F1;
  position: absolute;
  top: 0;
  z-index: -999;
  border-radius: 0 0 15px 15px;
}
.info {
  // background-color: red;
  height: 50vh;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  // img {
  //   width: 15vw;
  //   margin-top: 4vh;
  // }
  .van-icon-user-circle-o {
    margin-top: 5vh;
  }
  .name {
    color: white;
    margin: 2vh 0;
  }
  .detail {
    background-color: white;
    border-radius: 8px;
    padding: 8px 0;
    width: 100%;
    height: 50vh;
    box-shadow: 0px 2px 10px 0px #ccc;
    position: relative;
    .icon-line {
      background-color: rgb(25, 137, 250);
      display: block;
      width: 4px;
      height: 26px;
      position: absolute;
      top: 20px;
      left: 8px;
      z-index: 999;
    }
    .van-cell-group__title {
      color: #323233;
      font-size: 18px;
      font-weight: 700;
    }
    .van-cell__left-icon {
      color: rgb(25, 137, 250);
      font-size: 20px;
    }
    .van-cell--large {
      padding-top: 16px;
      padding-bottom: 16px;
    }
  }
}
</style>
