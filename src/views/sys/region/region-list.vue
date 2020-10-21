<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="query.name" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="等级">
                <a-select v-model="query.status" placeholder="请选择" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">省</a-select-option>
                  <a-select-option value="2">市</a-select-option>
                  <a-select-option value="3">区/县</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (this.query = {})">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <a-button icon="sync" @click="$refs.table.refresh(true)">刷新</a-button>
      </div>
      <s-table ref="table" row-key="id" :data="loadData" :scroll="{ x: 1500 }">
        <a-table-column key="id" title="编号" data-index="id" :width="120" fixed="left" />
        <a-table-column key="name" title="名称" data-index="name" :width="220" fixed="left" />
        <a-table-column key="code" title="代码" data-index="code" :width="180" />
        <a-table-column key="shortName" title="简称" data-index="shortName" :width="100" />
        <a-table-column key="level" title="等级" data-index="level" :width="100">
          <template slot-scope="text">
            {{ text | levelFilter }}
          </template>
        </a-table-column>
        <a-table-column key="firstLetter" title="首字母" data-index="firstLetter" :width="100" />
        <a-table-column key="mergerName" title="合称" data-index="mergerName" />
        <a-table-column key="action" title="操作" :width="180" fixed="right">
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
import * as RegionApi from '@/api/system/region'
export default {
  name: 'RegionList',
  components: { STable },
  filters: {
    levelFilter(val) {
      switch (val) {
        case 1:
          return '省'
        case 2:
          return '市'
        case 3:
          return '区/县'
        default:
          return ''
      }
    },
  },
  data() {
    return {
      query: {},
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return RegionApi.getList(requestParameters).then((response) => {
          return response.data
        })
      },
      selectList: [],
    }
  },
  mounted() {
    this.getSelectList()
  },
  methods: {
    getSelectList() {
      RegionApi.getSelectList().then((response) => {
        if (response.success) {
          this.selectList = response.data
        }
      })
    },
    add() {
      this.$router.push({ name: 'RegionAdd' })
    },
    edit(record) {
      this.$router.push({ name: 'RegionEdit', query: { id: record.id } })
    },
    remove(record) {
      const self = this
      self.$confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '删除',
        okType: 'danger',
        centered: true,
        onOk() {
          return new Promise((resolve, reject) => {
            RegionApi.remove(record.id)
              .then(() => {
                self.$refs.table.refresh(true)
                resolve()
              })
              .catch((err) => {
                reject(err)
              })
          })
        },
      })
    },
  },
}
</script>
