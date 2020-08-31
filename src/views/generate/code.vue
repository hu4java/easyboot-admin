<template>
  <page-header-wrapper :title="table.tableComment ? table.tableComment : table.tableName">
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="表名称">{{ table.tableName }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ table.createTime }}</a-descriptions-item>
        <a-descriptions-item label="字符集">{{ table.tableCollation }}</a-descriptions-item>
        <a-descriptions-item />
        <a-descriptions-item label="描述">{{ table.tableComment }}</a-descriptions-item>
      </a-descriptions>
    </template>
    <a-card :bordered="false">
      <template slot="title">
        <a-button type="primary" :loading="downloadLoading" @click="generate">生成代码</a-button>
      </template>
      <a-tabs default-active-key="config">
        <a-tab-pane key="config" tab="配置信息">
          <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-row>
              <a-col :span="12">
                <a-form-item label="作者">
                  <a-input
                    v-decorator="['author', { initialValue: 'EasyBoot', rules: [{ required: true, message: '请填写作者' }] }]"
                    placeholder="请填写作者"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="实体类名称">
                  <a-input
                    v-decorator="['entityName', { initialValue: table.entityName, rules: [{ required: true, message: '请填写实体类名称' }] }]"
                    placeholder="请填写实体类名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="注释">
                  <a-input
                    v-decorator="[
                      'comment',
                      { initialValue: table.tableComment, rules: [{ required: true, message: '请填写注释' }] },
                    ]"
                    placeholder="请填写注释"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="模块名称">
                  <a-input
                    v-decorator="['module', { initialValue: 'user', rules: [{ required: true, message: '请填写模块名称' }] }]"
                    placeholder="请填写模块名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="包路径">
                  <a-input
                    v-decorator="[
                      'javaPackage',
                      { initialValue: 'com.hu4java.user', rules: [{ required: true, message: '请填写包路径' }] },
                    ]"
                    placeholder="请填写包路径"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="field" tab="字段信息">
          <a-table
            ref="table"
            row-key="columnName"
            size="small"
            :data-source="columnList"
            :pagination="false"
          >

            <a-table-column key="index" title="序号" :width="100">
              <template slot-scope="text, record, index">
                {{ index + 1 }}
              </template>
            </a-table-column>
            <a-table-column key="columnName" title="列名" data-index="columnName" :width="250"/>
            <a-table-column key="dataType" title="数据类型" data-index="dataType" :width="200"/>
            <a-table-column key="fieldName" title="字段名" data-index="fieldName" :width="200">
              <template slot-scope="text, record">
                <a-input v-model="record.fieldName"/>
              </template>
            </a-table-column>
            <a-table-column key="javaType" title="java类型" data-index="javaType" :width="200">
              <template slot-scope="text, record">
                <a-select v-model="record.javaType" style="width:100%">
                  <a-select-option value="String"> String</a-select-option>
                  <a-select-option value="Long">Long</a-select-option>
                  <a-select-option value="Integer">Integer</a-select-option>
                  <a-select-option value="BigDecimal">BigDecimal</a-select-option>
                  <a-select-option value="Float">Float</a-select-option>
                  <a-select-option value="Double">Double</a-select-option>
                  <a-select-option value="Boolean">Boolean</a-select-option>
                  <a-select-option value="LocalTime">LocalTime</a-select-option>
                  <a-select-option value="LocalDate">LocalDate</a-select-option>
                  <a-select-option value="LocalDateTime">LocalDateTime</a-select-option>
                </a-select>
              </template>
            </a-table-column>
            <a-table-column key="columnComment" title="注释" data-index="columnComment">
              <template slot-scope="text, record">
                <a-input v-model="record.columnComment"/>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as TableApi from '@/api/generate/table'
import * as GenerateApi from '@/api/generate/generate'
export default {
  name: 'GenerateCode',
  data () {
    return {
      downloadLoading: false,
      table: {},
      columnList: [],
      form: this.$form.createForm(this)
    }
  },
  async created () {
    if (!this.$route.query) {
      return
    }
    const tableName = this.$route.query.tableName
    const resp = await TableApi.getInfo(tableName)
    if (resp.success) {
      this.table = resp.data
      this.columnList = resp.data.columnList ?? []
    }
  },
  methods: {
    generate () {
      const self = this
      self.form.validateFields(async (error, values) => {
        if (error) {
          self.$message.info('您还有内容没有填写')
          return
        }
        self.downloadLoading = true
        const data = { ...values, tableName: self.table.tableName, fieldList: self.columnList }
        const resp = await GenerateApi.generateCode(data)
        const blob = new Blob([resp.data])
        const filename = window.decodeURI(resp.headers['content-disposition'].split('=')[1])

        if ('download' in document.createElement('a')) { // 非IE下载
          const link = document.createElement('a')
          link.download = filename
          link.style.display = 'none'
          link.href = window.URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()
          URL.revokeObjectURL(link.href) // 释放URL 对象
          document.body.removeChild(link)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, filename)
        }
        self.downloadLoading = false
      })
    }
  }
}
</script>
