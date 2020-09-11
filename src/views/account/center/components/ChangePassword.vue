<template>
  <a-modal
    :visible="visible"
    title="修改密码"
    :confirm-loading="confirmLoading"
    :width="400"
    :closable="false"
    :maskClosable="false"
    okText="修改"
    @ok="submit"
    @cancel="cancel">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:6}" :wrapper-col="{span: 18}">
      <a-form-model-item label="原密码" prop="oldPassword">
        <a-input v-model="form.oldPassword" type="password" />
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="newPassword">
        <a-input v-model="form.newPassword" type="password" />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="confirmPassword">
        <a-input v-model="form.confirmPassword" type="password" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import * as ManageApi from '@/api/manage'
export default {
  name: 'ChangePassword',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码' },
          { min: 6, max: 20, message: '密码长度 6 - 20' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码' },
          { min: 6, max: 20, message: '密码长度 6 - 20' },
          { validator: (rule, value, callback) => {
            if (value !== this.form.newPassword) {
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
    show () {
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
        self.confirmLoading = true
        ManageApi.changePassword(self.form).then(() => {
          self.cancel()
          self.$warning({
            title: '提示',
            content: '修改成功，请重新登录。',
            keyboard: false,
            okText: '确定',
            okType: 'primary',
            onOk () {
              self.$store.dispatch('ResetToken').then(() => {
                self.$router.push({ path: '/login' })
              })
            }
          })
        }).finally(() => {
          self.confirmLoading = false
        })
      })
    },
    cancel () {
      this.visible = false
      this.confirmLoading = false
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  }
}
</script>
