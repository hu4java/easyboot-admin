<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{span: 5}" :wrapper-col="{span:18}">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="query.name" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="query.mobile" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="性别">
                <a-select v-model="query.gender" placeholder="请选择" default-value="0" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">男</a-select-option>
                  <a-select-option value="2">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="人事状态">
                <a-select v-model="query.state" placeholder="请选择" allow-clear>
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="state in personnelStates" :key="state.value" :value="state.value">
                    {{ state.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="生日">
                <a-date-picker v-model="query.birthday" placeholder="请选择" value-format="YYYY-MM-DD" style="width:100%"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="所属部门">
                <a-tree-select
                  v-model="query.deptId"
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="deptList"
                  :replaceFields="{key: 'id', title: 'name', value: 'id'}"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="角色">
                <a-select
                  allowClear
                  v-model="query.roleId"
                  style="width: 100%"
                  placeholder="请选择"
                  optionFilterProp="label"
                >
                  <a-select-option v-for="role in roleList" :key="role.id">
                    {{ role.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24" :offset="18" style="text-align:right">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px;margin-right: 18px;" @click="() => this.query = {}">重置</a-button>
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
        <a-table-column key="state" title="人事状态" data-index="stateFormat" :width="180"/>
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
import { personnelStates } from '@/utils/const'
import * as DeptApi from '@/api/system/dept'
import * as RoleApi from '@/api/system/role'
import * as UserApi from '@/api/system/user'

export default {
  name: 'UserList',
  components: { STable },
  data () {
    return {
      advanced: false,
      personnelStates,
      deptList: [],
      roleList: [],
      query: {
        name: '',
        state: '',
        gender: '',
        deptId: '',
        startBirthday: '',
        endBirthday: ''
      },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return UserApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      }
    }
  },
  async created () {
    const depts = await DeptApi.getList()
    if (depts.success) {
      this.deptList = depts.data
    }
    const roles = await RoleApi.getSelectList()
    if (roles.success) {
      this.roleList = roles.data
    }
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
