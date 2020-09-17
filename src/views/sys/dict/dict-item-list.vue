<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{span: 5}" :wrapper-col="{span:18}">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="字典">
                <a-select v-model="query.dictType">
                  <a-select-option v-for="dict in dictList" :key="dict.dictType" :value="dict.type">{{ dict.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="数据标题">
                <a-input v-model="query.name" allow-clear/>
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
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px;" @click="() => this.query = {}">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button icon="rollback" @click="back">返回</a-button>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <a-button icon="sync" @click="$refs.table.refresh(true)">刷新</a-button>
      </div>

      <s-table
        ref="table"
        row-key="id"
        :data="loadData"
        :scroll="{ x: 1500 }"
      >
        <a-table-column key="title" title="数据标题" data-index="title" :width="200"/>
        <a-table-column key="value" title="数据值" data-index="value" :width="180"/>
        <a-table-column key="orderNum" title="排序" data-index="orderNum" :width="180"/>
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
        <a-table-column key="action" title="操作" :width="180" >
          <template slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="remove(record)">删除</a>
          </template>
        </a-table-column>
      </s-table>
      <a-modal :visible="visible" :title="isEdit ? '更新数据项':'新建数据项'" :closable="false">
        <template v-slot:footer>
          <a-button key="back" @click="cancel">取消</a-button>
          <a-button key="submit" type="primary" v-if="isEdit" :loading="submitLoading" @click="submit">{{ submitLoading? '更新中':'更新' }}</a-button>
          <a-button key="submit" type="primary" v-else :loading="submitLoading" @click="submit">{{ submitLoading? '提交中':'提交' }}</a-button>
        </template>
        <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="id" prop="id" hidden>
            <a-input v-model="form.id" />
          </a-form-model-item>
          <a-form-model-item label="字典类型" prop="dictType">
            <a-input v-model="form.dictType" disabled />
          </a-form-model-item>
          <a-form-model-item label="数据标题" prop="title">
            <a-input v-model="form.title" />
          </a-form-model-item>
          <a-form-model-item label="数据值" prop="value">
            <a-input v-model="form.value" />
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="form.status">
              <a-radio :value="0">正常</a-radio>
              <a-radio :value="1">禁用</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="排序" prop="orderNum">
            <a-input-number v-model="form.orderNum" :min="1" />
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
import * as DictItemApi from '@/api/system/dict-item'

export default {
  name: 'DictItemList',
  components: { STable },
  data () {
    return {
      visible: false,
      submitLoading: false,
      isEdit: false,
      query: {
        name: '',
        state: '',
        dictType: ''
      },
      dictList: [],
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return DictItemApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      form: {
        id: '',
        title: '',
        value: '',
        dictType: '',
        status: 0,
        orderNum: 1,
        remark: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入数据标题' }
        ],
        value: [
          { required: true, message: '请输入数据值' }
        ],
        orderNum: [
          { required: true, message: '请输入排序' }
        ]
      }
    }
  },
  async created () {
    try {
      const dictType = this.$route.query.dictType
      this.query.dictType = dictType
      this.form.dictType = dictType
      const resp = await DictApi.getSelectList()
      if (resp.success) {
        this.dictList = resp.data
      }
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    search () {
      this.form.dictType = this.query.dictType
      this.$refs.table.refresh(true)
    },
    back () {
      this.$router.push({ name: 'DictList' })
    },
    add () {
      this.visible = true
      this.isEdit = false
      const self = this
      this.$nextTick(() => {
        self.$refs.form.resetFields()
      })
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
      const resp = await DictItemApi.save(this.form)
      if (resp.success) {
        self.$message.success('保存成功')
        self.$refs.table.refresh(true)
        self.cancel()
      }
    },
    async update () {
      const self = this
      const resp = await DictItemApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
        self.$refs.table.refresh(true)
        self.cancel()
      }
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
            DictItemApi.remove(record.id).then(() => {
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
