<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="query.name" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="性别">
                <a-select v-model="query.status" placeholder="请选择" default-value="0" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="2">男</a-select-option>
                  <a-select-option value="2">女</a-select-option>
                </a-select>
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
              <a-form-item label="部门">
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
        <a-button icon="sync" @click="$refs.table.refresh(true)">刷新</a-button>
      </div>

      <s-table
        ref="table"
        row-key="id"
        size="middle"
        :data="loadData"
        :scroll="{ x: 1500 }"
      >
        <!-- <a-table-column key="avatar" title="头像" data-index="avatar" :width="150" fixed="left">
          <template slot-scope="text">
            {{ text }}
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </template>
        </a-table-column> -->
        <a-table-column key="name" title="姓名" data-index="name" :width="200" fixed="left"/>
        <a-table-column key="gender" title="性别" data-index="gender" :width="80">
          <template slot-scope="text">
            {{ text|gender }}
          </template>
        </a-table-column>
        <a-table-column key="mobile" title="手机号" data-index="mobile" :width="180"/>
        <a-table-column key="code" title="员工编号" data-index="code" :width="150">
          <template slot-scope="code">
            {{ code || '未知' }}
          </template>
        </a-table-column>

        <a-table-column key="email" title="邮箱" data-index="email" :width="260"/>
        <a-table-column key="birthday" title="生日" data-index="birthday" :width="180">
          <template slot-scope="birthday">
            {{ birthday || '未知' }}
          </template>
        </a-table-column>
        <a-table-column key="state" title="人事状态" data-index="state" :width="180"/>
        <a-table-column key="contractExpireDate" title="合同到期" data-index="contractExpireDate" :width="200"/>
        <a-table-column key="createTime" title="创建时间" data-index="createTime" :width="200"/>
        <!-- <a-table-column
          key="status"
          title="状态"
          data-index="status"
          :width="120"
          align="center"
          fixed="right">
          <template slot-scope="status">
            <a-tag color="#87d068" v-if="status === 0">正常</a-tag>
            <a-tag color="#f50" v-else>禁用</a-tag>
          </template>
        </a-table-column> -->
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
import * as UserApi from '@/api/system/user'

export default {
  name: 'RoleList',
  components: { STable },
  data () {
    return {
      query: { name: '', status: undefined },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return UserApi.getList(requestParameters)
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
      this.$router.push({ name: 'UserAdd' })
    },
    edit (record) {
      this.$router.push({ name: 'UserEdit', query: { id: record.id } })
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
            UserApi.remove(record.id).then(() => {
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
