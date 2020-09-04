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
        <a-form-model-item label="部门" prop="deptId">
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
        <a-form-model-item label="角色" prop="roleIdList">
          <a-select
            v-model="form.roleIdList"
            mode="multiple"
            :options="roleList"
            style="width: 100%"
            placeholder="请选择"
            optionFilterProp="label"
          >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <a-radio-group v-model="form.status">
            <a-radio :value="0">启用</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
          <a-button style="margin-left: 10px;" @click="handleReset">重置</a-button>
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
        gender: 0,
        mobile: '',
        email: '',
        brithday: '',
        deptIds: [],
        roleIdList: [],
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
          { required: true, message: '请填写邮箱' }
        ],
        deptId: [
          { required: true, message: '请选择部门' },
          { type: 'email', message: '邮箱格式不正确' }
        ],
        roleIdList: [
          { required: true, message: '请选择角色' }
        ]
      },
      deptList: [],
      roleList: []
    }
  },
  created () {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      UserApi.detail(id).then(response => {
        this.form = response.data
      })
    }
    DeptApi.getList().then(response => {
      this.deptList = response.data
    })
    RoleApi.getList().then(response => {
      this.roleList = response.data
    })
  },
  methods: {
    handleSubmit: function () {
    //   this.$refs.form.validate(valid => {
    //     if (valid) {
    //       this.submitLoading = true
    //       let doSomething
    //       if (this.form.id) {
    //         doSomething = updateUser(this.form)
    //       } else {
    //         doSomething = addUser(this.form)
    //       }
    //       doSomething.then(() => {
    //         const self = this
    //         this.$confirm({
    //           title: '提示',
    //           content: '保存成功',
    //           okText: '返回',
    //           okType: 'primary',
    //           cancelText: '继续新增',
    //           centered: true,
    //           onOk () {
    //             self.$router.go(-1)
    //           },
    //           onCancel () {
    //             self.handleReset()
    //           }
    //         })
    //       }).finally(() => {
    //         this.submitLoading = false
    //       })
    //     }
    //   })
    },
    handleReset: function () {
      this.$refs.form.resetFields()
    }
  }
}
</script>
