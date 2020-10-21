<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="rollback" @click="cancel">返回</a-button>
      <a-divider />
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item prop="id" hidden>
          <a-input v-model="form.id" />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="上级" prop="pid">
              <a-tree-select
                v-model="form.pid"
                allowClear
                style="width: 100%"
                showSearch
                treeNodeFilterProp="title"
                :dropdown-style="{ overflow: 'auto' }"
                :tree-data="regionList"
                :replaceFields="{ key: 'id', title: 'name', value: 'id'}"
                placeholder="请选择"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="名称" prop="name">
              <a-input v-model="form.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="等级" prop="level">
              <a-radio-group v-model="form.level" button-style="solid">
                <a-radio-button :value="1">省</a-radio-button>
                <a-radio-button :value="2">市</a-radio-button>
                <a-radio-button :value="3">区/县</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="简称" prop="shortName">
              <a-input v-model="form.shortName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="代码" prop="code">
              <a-input v-model="form.code"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="首字符" prop="firstLetter">
              <a-input v-model="form.firstLetter"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合称" prop="mergerName">
              <a-input v-model="form.mergerName"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 9 }">
          <a-button type="primary" v-if="isEdit" @click="submitForm" :loading="submitLoading">{{ submitLoading ? '更新中':'更新' }}</a-button>
          <a-button type="primary" v-else @click="submitForm" :loading="submitLoading">{{ submitLoading ? '提交中':'提交' }}</a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as RegionApi from '@/api/system/region'

export default {
  name: 'RegionForm',
  data () {
    return {
      isEdit: false,
      submitLoading: false,
      form: {
        id: '',
        name: '',
        shortName: '',
        pid: 0,
        level: 1,
        code: '',
        firstLetter: '',
        mergerName: ''
      },
      regionList: [],
      rules: {
        name: [
          { required: true, message: '请填写名称' }
        ]
      }
    }
  },
  created () {
    const pid = this.$route.query.pid
    if (pid) {
      this.form.pid = pid
    }
    this.getRegionList()
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.getRegion(id)
    }
  },
  methods: {
    async getRegionList () {
      const data = await RegionApi.getSelectList()
      if (data.success) {
        this.regionList = data.data
        this.regionList.unshift({ id: '0', name: '无', pid: '0', value: '0' })
      }
    },
    async getRegion (id) {
      const data = await RegionApi.detail(id)
      if (data.success) {
        this.form = data.data
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
      const resp = await RegionApi.save(this.form)
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
            self.$router.go(0)
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
      const resp = await RegionApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
      }
      self.$nextTick(() => {
        self.submitLoading = false
      })
    },
    cancel () {
      this.$router.push({ name: 'RegionList' })
    }
  }
}
</script>
