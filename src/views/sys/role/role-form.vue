<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="rollback" @click="cancel">返回</a-button>
      <a-divider />
      <a-form-model ref="form" :model="form" :rules="rules">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="角色代码" prop="code">
              <a-input v-model="form.code" placeholder="请填写角色代码" />
            </a-form-model-item>
            <a-form-model-item label="角色名称" prop="name">
              <a-input v-model="form.name" placeholder="请填写角色名称" />
            </a-form-model-item>

            <a-form-model-item label="状态" prop="status">
              <a-radio-group v-model="form.status" defaultValue="0">
                <a-radio :value="0">正常</a-radio>
                <a-radio :value="1">禁用</a-radio>
              </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="备注说明" prop="remark">
              <a-textarea v-model="form.remark" :row="3" placeholder="请填写备注" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="拥有权限" prop="checkedKeys">
              <a-tree
                v-model="checkedKeys"
                :tree-data="menuList"
                checkable
                defaultExpandAll
                checkStrictly
                :replaceFields="{key: 'id'}"
                :selected-keys="selectedKeys" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item>
          <a-button type="primary" v-if="isEdit" @click="submitForm" :loading="submitLoading">{{ submitLoading ? '更新中':'更新' }}</a-button>
          <a-button type="primary" v-else @click="submitForm" :loading="submitLoading">{{ submitLoading ? '提交中':'提交' }}</a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as MenuApi from '@/api/system/menu'
import * as RoleApi from '@/api/system/role'

export default {
  name: 'RoleForm',
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      form: {
        id: '',
        name: '',
        code: '',
        status: 0,
        remark: '',
        menuIds: []
      },
      menuList: [],
      selectedKeys: [],
      checkedKeys: { checked: [], halfChecked: [] },
      rules: {
        code: [
          { required: true, message: '请填写角色代码' }
        ],
        name: [
          { required: true, message: '请填写角色名称' }
        ]
      }
    }
  },
  async created () {
    const pid = this.$route.query.pid
    if (pid) {
      this.form.pid = pid
    }
    this.getMenuList()
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      const resp = await RoleApi.detail(id)
      if (resp.success) {
        this.form = resp.data
        this.checkedKeys.checked = resp.data.menuIds
      }
    }
  },
  methods: {
    async getMenuList () {
      const resp = await MenuApi.getList()
      if (resp.success) {
        this.menuList = resp.data
      }
    },
    submitForm () {
      const self = this
      self.$refs.form.validate(async (valid) => {
        if (!valid) {
          return
        }
        self.form.menuIds = self.checkedKeys.checked
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
      const resp = await RoleApi.save(this.form)
      if (resp.success) {
        self.$message.success('保存成功')
        self.$confirm({
          title: '提示',
          content: '保存成功',
          okText: '继续新增',
          okType: 'primary',
          cancelText: '返回上一页',
          centered: true,
          onOk () {
            self.$refs.form.resetFields()
            self.checkedKeys.checked = []
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
      const resp = await RoleApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
      }
      setTimeout(function () {
        self.submitLoading = false
      }, 1000)
    },
    cancel () {
      this.$router.push({ name: 'RoleList' })
    }
  }
}
</script>
