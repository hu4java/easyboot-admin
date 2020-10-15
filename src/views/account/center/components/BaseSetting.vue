<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-col :md="16" :lg="12">
          <a-form-model ref="form" :model="form" :rules="rules" layout="vertical">
            <a-form-model-item label="姓名" prop="name">
              <a-input v-model.trim="form.name" />
            </a-form-model-item>
            <a-form-model-item label="性别" prop="gender">
              <a-radio-group v-model="form.gender">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="手机号" prop="mobile">
              <a-input v-model="form.mobile" />
            </a-form-model-item>
            <a-form-model-item label="邮箱" prop="email">
              <a-input v-model="form.email" />
            </a-form-model-item>
            <a-form-model-item label="生日" prop="birthday">
              <a-date-picker v-model="form.birthday" value-format="YYYY-MM-DD"/>
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" :loading="submitLoading" @click="update">更新</a-button>
            </a-form-model-item>
          </a-form-model>

        </a-col>
        <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
          <div class="ant-upload-preview" @click="$refs.cropper.show()" >
            <a-icon type="cloud-upload-o" class="upload-icon"/>
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img :src="avatar"/>
          </div>
        </a-col>

      </a-col></a-row>

    <avatar-cropper ref="cropper" @complete="setavatar"/>

  </div>
</template>

<script>
import pick from 'lodash.pick'
import { AvatarCropper } from '@/components'
import { mapGetters } from 'vuex'
import { validateMobile } from '@/utils/validate'
import * as ManageApi from '@/api/manage'

export default {
  components: {
    AvatarCropper
  },
  data () {
    return {
      avatar: null,
      submitLoading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '请填写姓名' }
        ],
        mobile: [
          { required: true, message: '请填写手机号' },
          { validator: validateMobile }
        ],
        email: [
          { required: true, message: '请填写邮箱' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.form = pick(this.userInfo, 'name', 'gender', 'mobile', 'email', 'birthday')
    this.avatar = this.userInfo.avatar
  },
  methods: {
    setavatar (url) {
    },
    update () {
      const self = this
      self.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        self.submitLoading = true
        ManageApi.update(self.form).then((data) => {
          if (data.success) {
            self.$message.success('更新成功')
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          self.submitLoading = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
