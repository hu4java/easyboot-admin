<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名称">
                <a-input v-model="query.name" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="query.status" placeholder="请选择" default-value="0" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.query = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <!-- <a-button icon="sync" @click="getList">刷新</a-button> -->
      </div>

      <s-table
        ref="table"
        row-key="id"
        :data="loadData"
      >
        <a-table-column key="name" title="角色名称" data-index="name" :width="220"/>
        <a-table-column key="code" title="角色代码" data-index="code" :width="150"/>
        <a-table-column key="status" title="状态" data-index="status" :width="120" align="center">
          <template slot-scope="status">
            <a-tag color="#87d068" v-if="status === 0">正常</a-tag>
            <a-tag color="#f50" v-else>禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="remark" title="备注" data-index="remark" />
        <a-table-column key="action" title="操作" :width="180" fixed="right" >
          <template slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="remove(record)">删除</a>
          </template>
        </a-table-column>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import * as RoleApi from '@/api/system/role'

export default {
  name: 'RoleList',
  components: { STable },
  data () {
    return {
      query: { name: '', status: undefined },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return RoleApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      }
    }
  },
  created () {
  },
  methods: {
    add () {
      this.$router.push({ name: 'RoleAdd' })
    },
    edit (record) {
      this.$router.push({ name: 'RoleEdit', query: { id: record.id } })
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
            RoleApi.remove(record.id).then(() => {
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
