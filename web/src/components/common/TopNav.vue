<template>
  <div class="top-nav-box">
    <van-nav-bar v-if="isShow" fixed placeholder @click-left="onClickLeft">
      <template #left>
        <van-icon :name="leftIcon" size="20" color="white"/>
        <span class="left-title">{{ leftText }}</span>
      </template>
      <template #right>
        <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="bottom-end"
        >
          <template #reference>
            <van-icon :name="rigthIcon" size="20" color="white"/>
          </template>
        </van-popover>
      </template>
    </van-nav-bar>

    <!-- <van-nav-bar v-if="!isShow" :left-text="leftText" left-arrow/> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      showPopover: false
    }
  },
  props: ['isShow', 'leftIcon', 'rigthIcon', 'leftText', 'actions'],
  methods: {
    onSelect (action) {
      this.$toast.fail(action.text)
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}

</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__content {
  background-color: rgba(25, 137, 250, 1);
  .left-title {
    color: white;
    font-size: 16px;
    margin-left: 4px;
    padding-top: 2px;
  }
}
/deep/ .van-popover__wrapper i {
  margin-top: 6px;
}
// /deep/ .van-nav-bar__text {
//   color: white;
//   font-size: 16px;
// }
</style>
