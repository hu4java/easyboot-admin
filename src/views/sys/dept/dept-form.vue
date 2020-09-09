<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="rollback" @click="cancel">返回</a-button>
      <a-divider />
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span: 8}" :wrapper-col="{span: 6}">
        <a-form-model-item label="上级部门" prop="pid">
          <a-tree-select
            v-model="form.pid"
            allowClear
            show-search
            style="width: 100%"
            :dropdown-style="{ overflow: 'auto' }"
            :tree-data="deptList"
            :replaceFields="{key: 'id', title: 'name', value: 'id'}"
            treeNodeFilterProp="title"
            placeholder="请选择"
          />

        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="部门编号" prop="code">
          <a-input v-model="form.code"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="phone">
          <a-input v-model="form.phone"/>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email"/>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <a-radio-group v-model="form.status" :default-value="0">
            <a-radio :value="0">启用</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="orderNum">
          <a-input-number v-model="form.orderNum" :min="1" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="form.remark" type="textarea"/>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 8, offset: 8 }">
          <a-button type="primary" v-if="isEdit" @click="submitForm" :loading="submitLoading">{{ submitLoading ? '更新中':'更新' }}</a-button>
          <a-button type="primary" v-else @click="submitForm" :loading="submitLoading">{{ submitLoading ? '提交中':'提交' }}</a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as DeptApi from '@/api/system/dept'

export default {
  name: 'DeptForm',
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      form: {
        id: '',
        name: '',
        pid: 0,
        code: '',
        phone: '',
        email: '',
        status: 0,
        orderNum: 1,
        remark: ''
      },
      deptList: [],
      rules: {
        pid: [
          { required: true, message: '请选择上级部门' }
        ],
        name: [
          { required: true, message: '请填写部门名称' }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确' }
        ],
        orderNum: [
          { required: true, message: '请填写排序' }
        ]
      }
    }
  },
  async created () {
    const pid = this.$route.query.pid
    if (pid) {
      this.form.pid = pid
    }
    this.getDeptList()
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      const resp = await DeptApi.detail(id)
      if (resp.success) {
        this.form = resp.data
      }
    }
  },
  methods: {
    async getDeptList () {
      const resp = await DeptApi.getList()
      if (resp.success) {
        this.deptList = resp.data
        this.deptList.unshift({ id: '0', name: '无', pid: '0', value: '0' })
      }
    },
    submitForm () {
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
      const resp = await DeptApi.save(this.form)
      if (resp.success) {
        self.$message.success('保存成功')
        self.$confirm({
          title: '提示',
          content: '保存成功',
          okText: '继续添加',
          okType: 'primary',
          cancelText: '返回上一页',
          centered: true,
          onOk () {
            self.$refs.form.resetFields()
            self.getDeptList()
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
      const resp = await DeptApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
      }
      self.$nextTick(() => {
        self.submitLoading = false
      })
    },
    cancel () {
      this.$router.push({ name: 'DeptList' })
    }
  }
}
</script>
