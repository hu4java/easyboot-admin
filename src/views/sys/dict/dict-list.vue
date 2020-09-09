<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{span: 5}" :wrapper-col="{span:18}">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="query.name" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="query.mobile" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="query.status" placeholder="请选择" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px;" @click="() => this.query = {}">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <a-button icon="sync" @click="$refs.table.refresh(true)">刷新</a-button>
      </div>

      <s-table
        ref="table"
        row-key="id"
        :data="loadData"
        :scroll="{ x: 1500 }"
      >
        <a-table-column key="name" title="字典名称" data-index="name" :width="200" fixed="left"/>
        <a-table-column key="type" title="类型" data-index="type" :width="180"/>
        <a-table-column
          key="status"
          title="状态"
          data-index="status"
          :width="120"
          align="center">
          <template slot-scope="status">
            <a-tag color="#87d068" v-if="status === 0">正常</a-tag>
            <a-tag color="#f50" v-else>禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="remark" title="备注" data-index="remark" />
        <a-table-column key="action" title="操作" :width="180" fixed="right" >
          <template slot-scope="text, record">
            <a @click="view(record)">数据项</a>
            <a-divider type="vertical" />
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="remove(record)">删除</a>
          </template>
        </a-table-column>
      </s-table>
      <a-modal :visible="visible" title="新建字典" :closable="false">
        <template v-slot:footer>
          <a-button key="back" @click="cancel">取消</a-button>
          <a-button key="submit" type="primary" v-if="isEdit" :loading="submitLoading" @click="submit">{{ submitLoading? '更新中':'更新' }}</a-button>
          <a-button key="submit" type="primary" v-else :loading="submitLoading" @click="submit">{{ submitLoading? '提交中':'提交' }}</a-button>
        </template>
        <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="id" prop="id" hidden>
            <a-input v-model="form.id" />
          </a-form-model-item>
          <a-form-model-item label="字典名称" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="字典类型" prop="type">
            <a-input v-model="form.type" />
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="form.status">
              <a-radio :value="0">正常</a-radio>
              <a-radio :value="1">禁用</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="form.remark" type="textarea" />
          </a-form-model-item>

        </a-form-model>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import * as DictApi from '@/api/system/dict'

export default {
  name: 'DictList',
  components: { STable },
  data () {
    return {
      visible: false,
      submitLoading: false,
      isEdit: false,
      query: {
        name: '',
        state: '',
        type: ''
      },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return DictApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      form: {
        id: '',
        name: '',
        type: '',
        status: 0,
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入字典名称' }
        ],
        type: [
          { required: true, message: '请输入字典类型' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    add () {
      this.visible = true
      this.isEdit = false
      const self = this
      this.$nextTick(() => {
        self.$refs.form.resetFields()
      })
    },
    view (record) {
      this.$router.push({ name: 'DictItemList', query: { dictType: record.type } })
    },
    edit (record) {
      this.visible = true
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = Object.assign({}, record)
      })
    },
    cancel () {
      this.$refs.form.resetFields()
      this.visible = false
      this.isEdit = false
      this.submitLoading = false
    },
    submit () {
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
      const resp = await DictApi.save(this.form)
      if (resp.success) {
        self.$message.success('保存成功')
        self.$refs.table.refresh(true)
        self.cancel()
      }
      this.submitLoading = false
    },
    async update () {
      const self = this
      const resp = await DictApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
        self.$refs.table.refresh(true)
        self.cancel()
      }
      this.submitLoading = false
    },
    remove (record) {
      const self = this
      self.$confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '删除',
        okType: 'danger',
        centered: true,
        onOk () {
          return new Promise((resolve, reject) => {
            DictApi.remove(record.id).then(() => {
              self.$refs.table.refresh(true)
              resolve()
            }).catch((err) => {
              reject(err)
            })
          })
        }
      })
    }
  }
}
</script>
