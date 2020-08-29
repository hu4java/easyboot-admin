<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="表名">
                <a-input placeholder=""/>
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

      <a-table
        ref="table"
        row-key="name"
        :data-source="table.columnList"
        :pagination="false"
      >

        <a-table-column key="index" title="序号">
          <template slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
        </a-table-column>
        <a-table-column key="name" title="列名" data-index="name" />
        <a-table-column key="type" title="数据类型" data-index="type" />
        <a-table-column key="fieldName" title="字段名" data-index="fieldName" :width="200">
          <template slot-scope="text, record">
            <a-input v-model="record.fieldName"/>
          </template>
        </a-table-column>
        <a-table-column key="javaType" title="java类型" data-index="javaType">
          <template slot-scope="text, record">
            <a-select v-model="record.javaType" style="width:150px" default-value="String">
              <a-select-option value="String">
                String
              </a-select-option>
              <a-select-option value="Long">
                Long
              </a-select-option>
              <a-select-option value="Integer">
                Integer
              </a-select-option>
              <a-select-option value="BigDecimal">
                BigDecimal
              </a-select-option>
              <a-select-option value="Float">
                Float
              </a-select-option>
              <a-select-option value="Double">
                Double
              </a-select-option>
              <a-select-option value="Boolean">
                Boolean
              </a-select-option>
              <a-select-option value="LocalTime">
                LocalTime
              </a-select-option>
              <a-select-option value="LocalDate">
                LocalDate
              </a-select-option>
              <a-select-option value="LocalDateTime">
                LocalDateTime
              </a-select-option>
            </a-select>
          </template>
        </a-table-column>
        <a-table-column key="comment" title="注释" data-index="comment">
          <template slot-scope="text, record">
            <a-input v-model="record.comment"/>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as TableApi from '@/api/generate/table'
export default {
  name: 'GenerateCode',
  data () {
    return {
      table: {}
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
    }
  },
  methods: {
    generate (record) {
      this.$router.push()
    }
  }
}
</script>
