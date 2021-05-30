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
        v-model="model.number"
        :required="!readonly"
        name="项目组编号"
        label="项目组编号"
        placeholder="请填写项目组编号"
        :rules="[{ required: true, message: '' }]"
        :readonly="readonly"
      />
      <van-field
        v-model="model.name"
        required
        name="项目组名称"
        label="项目组名称"
        placeholder="请填写项目组名称"
        :rules="[{ required: true, message: '' }]"
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
        number: '',
        descpt: ''
      },
      readonly: false
    }
  },
  created () {
    if (this.groupId) {
      this.model = this.$route.query
      this.readonly = true
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
        } else {
          this.$toast.fail(res.data.msg)
        }
      } else { // 添加项目组
        const res = await this.$ajax.post('/admin/addGroup', this.model)
        if (res.data.code === 200) {
          this.$toast.success('添加成功！')
          this.$router.push('/projectGroup')
        } else {
          this.$toast.fail(res.data.msg)
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
