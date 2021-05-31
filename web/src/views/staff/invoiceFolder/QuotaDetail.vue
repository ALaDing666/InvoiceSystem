<template>
  <div>
    <van-field
      v-model="quota.code"
      required
      :rules="[{ required: true, message: '' }]"
      name="发票代码"
      label="发票代码"
      placeholder="请输入发票代码"
      :readonly="readonly"
    />
    <van-field
      v-model="quota.number"
      required
      :rules="[{ required: true, message: '' }]"
      name="发票号码"
      label="发票号码"
      placeholder="请输入发票号码"
      :readonly="readonly"
    />
    <van-field
      v-model="quota.total"
      required
      :rules="[{ required: true, message: '' }]"
      name="含税金额"
      type="number"
      label="含税金额 (元)"
      placeholder="请输入含税金额"
      :readonly="readonly"
    />
    <van-field
      v-model="quota.location"
      required
      :rules="[{ required: true, message: '' }]"
      name="地址"
      label="地址"
      placeholder="请输入地址"
      :readonly="readonly"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['quota', 'readonly']
}

</script>

<style scoped>

</style>
