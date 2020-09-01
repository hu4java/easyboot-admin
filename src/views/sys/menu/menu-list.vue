<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="add(0)">新建</a-button>
        <a-button icon="sync" @click="getList">刷新</a-button>
      </div>

      <a-table
        ref="table"
        row-key="id"
        :data-source="list"
        :loading="loading"
        :scroll="{ x: 1500, y: 300 }"
      >
        <a-table-column key="title" title="标题" data-index="title" fixed="left" />
        <a-table-column key="code" title="授权码" data-index="code" :width="150"/>
        <a-table-column key="type" title="类型" data-index="type" align="center" :width="100">
          <template slot-scope="type">
            <a-tag color="#108ee9" v-if="type === 1">目录</a-tag>
            <a-tag color="#2db7f5" v-if="type === 2">菜单</a-tag>
            <a-tag color="#87d068" v-if="type === 3">按钮</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="status" title="状态" data-index="status" :width="100" align="center">
          <template slot-scope="status">
            <a-tag color="#87d068" v-if="status === 0">正常</a-tag>
            <a-tag color="#f50" v-else>禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="hidden" title="显示/隐藏" data-index="hidden" :width="100" align="center">
          <template slot-scope="hidden">
            <a-tag color="#87d068" v-if="hidden === 0">显示</a-tag>
            <a-tag color="#f50" v-else>隐藏</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="path" title="路由地址" data-index="path" />
        <a-table-column key="action" title="操作" fixed="right" >
          <template slot-scope="text, record">
            <a @click="add(record.id)">新建</a>
            <a-divider type="vertical" />
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="dev(record)">删除</a>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as MenuApi from '@/api/system/menu'

export default {
  name: 'MenuList',
  data () {
    return {
      loading: false,
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.loading = true
      const resp = await MenuApi.getList()
      if (resp.success) {
        this.list = resp.data
      }
      this.loading = false
    },
    add (pid) {
      this.$router.push({ name: 'MenuAdd', query: { pid: pid } })
    },
    edit (record) {
      this.$router.push({ name: 'MenuEdit', query: { id: record.id } })
    },
    del (record) {

    }
  }
}
</script>
