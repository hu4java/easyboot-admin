<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="rollback" @click="cancel">返回</a-button>
      <a-divider />
      <a-row :gutter="20">
        <a-col :span="4" class="avatar-uploader">
          <div class="avatar">
            <!-- <img :src="form.avatar"/> -->
            <a-avatar :src="form.avatar" :size="128" />
          </div>

          <a-button class="avatar-upload-btn" @click="$refs.avatarCropper.show()"> 上传 </a-button>
          <avatar-cropper ref="avatarCropper" @complete="saveAvatar" />
        </a-col>
        <a-col :span="20">
          <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :label-col="{span: 5}"
            :wrapper-col="{span: 18}"
          >
            <a-row :gutter="20">
              <a-col :span="8">
                <a-form-model-item prop="id" hidden>
                  <a-input v-model="form.id" />
                </a-form-model-item>
                <a-form-model-item label="姓名" prop="name">
                  <a-input v-model="form.name" />
                </a-form-model-item>
                <a-form-model-item label="性别" prop="gender">
                  <a-radio-group v-model="form.gender">
                    <a-radio :value="1">男</a-radio>
                    <a-radio :value="2">女</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="8" v-if="!isEdit">
                <a-form-model-item label="登录账号" prop="username">
                  <a-input v-model="form.username" />
                </a-form-model-item>
                <a-form-model-item label="登录密码" prop="password">
                  <a-input-password v-model="form.password" type="password" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20">
              <a-col :span="8">
                <a-form-model-item label="生日" prop="birthday">
                  <a-date-picker v-model="form.birthday" value-format="YYYY-MM-DD" style="width:100%;"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20">
              <a-col :span="8">
                <a-form-model-item label="手机号" prop="mobile">
                  <a-input v-model="form.mobile" />
                </a-form-model-item>
                <a-form-model-item label="邮箱" prop="email">
                  <a-input v-model="form.email" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="部门" prop="deptIds">
                  <a-tree-select
                    v-model="form.deptIds"
                    allowClear
                    showSearch
                    multiple
                    treeNodeFilterProp="title"
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :tree-data="deptList"
                    :replaceFields="{key: 'id', title: 'name', value: 'id'}"
                    placeholder="请选择"

                  />
                </a-form-model-item>
                <a-form-model-item label="角色" prop="roleIds">
                  <a-select
                    v-model="form.roleIds"
                    mode="multiple"
                    style="width: 100%"
                    placeholder="请选择"
                    optionFilterProp="label"
                  >
                    <a-select-option v-for="role in roleList" :key="role.id">
                      {{ role.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="20">
              <a-col :span="8">
                <a-form-model-item label="人事状态" prop="state">
                  <a-select
                    v-model="form.state"
                    style="width: 100%"
                    placeholder="请选择"
                  >
                    <a-select-option v-for="state in personnelStates" :key="state.value" :value="state.value">
                      {{ state.title }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="合同到期" prop="contractExpireDate">
                  <a-date-picker v-model="form.contractExpireDate" value-format="YYYY-MM-DD" style="width:100%;"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8" >
                <a-form-model-item :wrapper-col="{ offset: 5 }">
                  <a-button type="primary" v-if="isEdit" @click="submitForm" :loading="submitLoading">{{ submitLoading ? '更新中':'更新' }}</a-button>
                  <a-button type="primary" v-else @click="submitForm" :loading="submitLoading">{{ submitLoading ? '提交中':'提交' }}</a-button>
                  <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-col>
      </a-row>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import { upload } from '@/utils/upload'
import { AvatarCropper } from '@/components'
import { validateMobile } from '@/utils/validate'
import { personnelStates } from '@/utils/const'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import * as RoleApi from '@/api/system/role'

export default {
  name: 'UserForm',
  components: { AvatarCropper },
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      form: {
        id: undefined,
        username: '',
        password: '',
        name: '',
        avatar: '',
        gender: 1,
        mobile: '',
        email: '',
        brithday: '',
        deptIds: [],
        roleIds: [],
        state: 5,
        contractExpireDate: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写登录账号' }
        ],
        password: [
          { required: true, message: '请填写登录密码' },
          { min: 6, message: '密码长度 6-20' },
          { max: 20, message: '密码长度 6-20' }
        ],
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
        ],
        deptIds: [
          { required: true, message: '请选择部门' }
        ],
        roleIds: [
          { required: true, message: '请选择角色' }
        ]
      },
      personnelStates,
      deptList: [],
      roleList: []
    }
  },
  async created () {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true

      const detail = await UserApi.detail(id)
      if (detail.success) {
        this.form = detail.data
      }
    }
    const deptList = await DeptApi.getList()
    if (deptList.success) {
      this.deptList = deptList.data
    }
    const roleList = await RoleApi.getSelectList()
    if (roleList.success) {
      this.roleList = roleList.data
    }
  },
  methods: {
    saveAvatar (file) {
      const self = this
      const observe = {
        next (res) {
          console.log(res)
        },
        error (err) {
          console.log(err)
        },
        complete (data) {
          console.log(data)
          self.form.avatar = data.url
        }
      }
      upload(file, null, observe)
    },
    submitForm: function () {
      const self = this
      self.$refs.form.validate(async (valid) => {
        if (!valid) {
          return
        }
        self.submitLoading = true
        if (self.isEdit) {
          self.update()
        } else {
          self.save()
        }
      })
    },
    async save () {
      const self = this
      const resp = await UserApi.save(this.form)
      if (resp.success) {
        self.$message.success('保存成功')
        self.$confirm({
          title: '提示',
          content: '保存成功',
          okText: '继续新增',
          okType: 'primary',
          cancelText: '返回列表页',
          centered: true,
          onOk () {
            self.$refs.form.resetFields()
          },
          onCancel () {
            self.cancel()
          }
        })
      }
      self.submitLoading = false
    },
    async update () {
      const self = this
      const resp = await UserApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
      }
      self.$nextTick(() => {
        self.submitLoading = false
      })
    },
    cancel: function () {
      this.$router.push({ name: 'UserList' })
    }
  }
}
</script>
<style scoped>
.avatar-uploader {
  text-align: center;
}
.avatar-uploader > .avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
}

.avatar-upload-btn {
  margin-top: 30px;
}
</style>
