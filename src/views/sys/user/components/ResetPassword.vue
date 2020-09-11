<template>
  <a-modal
    :visible="visible"
    title="重置密码"
    :confirm-loading="confirmLoading"
    :width="400"
    :closable="false"
    :maskClosable="false"
    okText="确定"
    @ok="submit"
    @cancel="cancel">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:6}" :wrapper-col="{span: 18}">
      <a-form-model-item label="密码" prop="password">
        <a-input v-model="form.password" type="password" />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="confirmPassword">
        <a-input v-model="form.confirmPassword" type="password" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import * as UserApi from '@/api/system/user'
export default {
  name: 'ResetPassword',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: {
        id: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码' },
          { min: 6, max: 20, message: '密码长度 6 - 20' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码' },
          { min: 6, max: 20, message: '密码长度 6 - 20' },
          { validator: (rule, value, callback) => {
            if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          } }
        ]
      }
    }
  },
  methods: {
    show (userId) {
      this.form.id = userId
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    submit () {
      const self = this
      self.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        UserApi.resetPassword(self.form).then(() => {
          self.$message.success('重置成功')
          self.cancel()
        }).finally(() => {
          self.confirmLoading = false
        })
      })
    },
    cancel () {
      this.visible = false
      this.confirmLoading = false
      this.form.id = ''
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  }
}
</script>
