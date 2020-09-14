<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{span: 5}" :wrapper-col="{span:18}">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="操作人">
                <a-input v-model="query.name" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="query.status" placeholder="请选择" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">成功</a-select-option>
                  <a-select-option value="1">失败</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select v-model="query.type" placeholder="请选择" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="type in typeList" :key="type.value" :value="type.value">
                    {{ type.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="操作时间">
                <a-range-picker @change="dateChange" style="width:100%;"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" :offset="8" style="text-align:right">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px;margin-right: 18px;" @click="() => this.query = {}">重置</a-button>
            </a-col>
          </a-row>

        </a-form>
      </div>
      <div class="table-operator"/>
      <s-table
        ref="table"
        row-key="id"
        :data="loadData"
        :scroll="{ x: 1500 }"
      >
        <a-table-column key="id" title="ID" data-index="id" :width="100" fixed="left"/>
        <a-table-column key="operateTime" title="操作时间" data-index="operateTime" :width="200" fixed="left"/>
        <a-table-column key="description" title="描述" data-index="description" :width="200" />
        <a-table-column key="type" title="操作类型" data-index="type" :width="150">
          <template slot-scope="type">
            {{ type | typeFilter }}
          </template>
        </a-table-column>
        <a-table-column key="operateUser" title="操作人" data-index="operateUser" :width="180"/>
        <a-table-column key="ip" title="IP" data-index="ip" :width="160"/>
        <a-table-column
          key="status"
          title="状态"
          data-index="status"
          :width="120"
          align="center"
          fixed="right">
          <template slot-scope="status">
            <a-tag color="#87d068" v-if="status === 0">成功</a-tag>
            <a-tag color="#f50" v-else>失败</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" :width="200" fixed="right" >
          <template slot-scope="text, record">
            <a @click="view(record)">查看</a>
          </template>
        </a-table-column>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import * as OperationLogApi from '@/api/system/operationLog'
export default {
  name: 'OperateLog',
  components: { STable },
  filters: {
    typeFilter (type) {
      switch (type) {
      case 1:
        return '保存'
      case 2:
        return '更新'
      case 3:
        return '删除'
      default:
        return '未知'
      }
    }
  },
  data () {
    return {
      query: {
        startTime: '',
        endTime: ''
      },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return OperationLogApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      typeList: [
        { title: '保存', value: 1 },
        { title: '更新', value: 2 },
        { title: '删除', value: 3 }
      ]
    }
  },
  methods: {
    view (record) {
      this.$router.push({ name: 'OperateLogDetail', query: { id: record.id } })
    },
    dateChange (date, dateString) {
      this.query.startTime = dateString[0]
      this.query.endTime = dateString[1]
    }
  }
}
</script>
