<template>
  <div>
    <top-nav
      :isShow="true"
      leftIcon="arrow-left"
      leftText="编辑"
      @leftClick="leftClick"
    />
    <van-form @submit="confirm()">
      <van-field
        v-model="model.name"
        name="项目组名称"
        label="项目组名称"
        placeholder="项目组名称"
        :rules="[{ required: true, message: '请填写项目组名称' }]"
      />
      <van-field
        v-model="model.descpt"
        type="textarea"
        name="描述"
        label="描述"
        placeholder="描述"
        show-word-limit
        maxlength="60"
        autosize
        :rules="[{ required: true, message: '请输入相关描述' }]"
      />
      <div class="btn-group">
        <van-button plain hairline size="small" type="info" @click="cancel()">取消</van-button>
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
        descpt: ''
      }
    }
  },
  created () {
    if (this.groupId) {
      this.model = this.$route.query
    }
  },
  methods: {
    leftClick () {
      this.$router.push('/projectGroup')
    },
    cancel () {
      this.$router.go(-1)
    },
    async confirm () {
      if (this.groupId) { // 修改项目组信息
        const res = await this.$ajax.post('/admin/modifyGroup', this.model)
        if (res.data.code === 200) {
          this.$toast.success('修改成功！')
          this.$router.go(-1)
        }
      } else { // 添加项目组
        const res = await this.$ajax.post('/admin/addGroup', this.model)
        if (res.data.code === 200) {
          this.$toast.success('添加成功！')
          this.$router.push('/projectGroup')
        }
      }
    }
  },
  mounted () {

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
