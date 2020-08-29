<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="表名">
                <a-input v-model="query.name" placeholder=""/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" style="float: right, overflow: hidden">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        row-key="name"
        :data="loadData"
      >

        <a-table-column key="index" title="序号">
          <template slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
        </a-table-column>
        <a-table-column key="name" title="表名" data-index="name" />
        <a-table-column key="comment" title="描述" data-index="comment" />
        <a-table-column key="collation" title="字符集" data-index="collation" />
        <a-table-column key="createTime" title="创建时间" data-index="createTime" />
        <a-table-column key="action" title="操作" fiexd="right">
          <template slot-scope="text, record">
            <a @click="generate(record)">生成代码</a>
          </template>
        </a-table-column>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import * as TableApi from '@/api/generate/table'
export default {
  name: 'Generate',
  components: { STable },
  data () {
    return {
      query: {},
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return TableApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      }
    }
  },
  methods: {
    generate (record) {
      this.$router.push({ name: 'GenerateCode', query: { tableName: record.name } })
    }
  }
}
</script>
