<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="arrow-left" @click="() => $router.go(-1)">返回</a-button>
      <a-divider />
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{span: 4}"
        :wrapper-col="{span: 6}"
      >
        <a-form-model-item prop="id" hidden>
          <a-input v-model="form.id" />
        </a-form-model-item>
        <a-form-model-item v-if="!isEdit" label="用户名" prop="username">
          <a-input v-model="form.username" />
        </a-form-model-item>
        <a-form-model-item v-if="!isEdit" label="密码" prop="password">
          <a-input v-model="form.password" type="password" />
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
        <a-form-model-item label="手机号" prop="mobile">
          <a-input v-model="form.mobile" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email" />
        </a-form-model-item>
        <a-form-model-item label="生日" prop="birthday">
          <a-date-picker v-model="form.birthday" value-format="YYYY-MM-DD"/>
        </a-form-model-item>
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
        <a-form-model-item label="状态" prop="status">
          <a-radio-group v-model="form.status">
            <a-radio :value="0">启用</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 6, offset: 4 }">
          <a-button type="primary" v-if="isEdit" @click="submitForm" :loading="submitLoading">{{ submitLoading ? '更新中':'更新' }}</a-button>
          <a-button type="primary" v-else @click="submitForm" :loading="submitLoading">{{ submitLoading ? '提交中':'提交' }}</a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import * as RoleApi from '@/api/system/role'

export default {
  name: 'UserForm',
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      form: {
        id: undefined,
        username: '',
        password: '',
        name: '',
        gender: 1,
        mobile: '',
        email: '',
        brithday: '',
        deptIds: [],
        roleIds: [],
        status: 0
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度 6-20' },
          { max: 20, message: '密码长度 6-20' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
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
      deptList: [],
      roleList: []
    }
  },
  async created () {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      UserApi.detail(id).then(response => {
        this.form = response.data
      })
    }
    DeptApi.getList().then(response => {
      this.deptList = response.data
    })
    RoleApi.getSelectList().then(response => {
      this.roleList = response.data
    })
  },
  methods: {
    submitForm: function () {

    },
    cancel: function () {
      this.$router.push({ name: 'UserList' })
    }
  }
}
</script>
