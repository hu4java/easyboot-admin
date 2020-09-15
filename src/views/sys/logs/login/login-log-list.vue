<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :label-col="{span: 5}" :wrapper-col="{span:18}">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="登录账号">
                <a-input v-model="query.account" allow-clear/>
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
              <a-form-item label="登录地点">
                <a-input v-model="query.location" allow-clear/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="登录时间">
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
        <a-table-column key="id" title="日志编号" data-index="id" :width="120" fixed="left"/>
        <a-table-column key="loginTime" title="登录时间" data-index="loginTime" :width="200" fixed="left"/>
        <a-table-column key="account" title="登录账号" data-index="account" :width="150" fixed="left"/>
        <a-table-column key="ip" title="IP" data-index="ip" :width="180"/>
        <a-table-column key="location" title="登录地址" data-index="location" :width="150">
          <template slot-scope="location">
            {{ location || '未知' }}
          </template>
        </a-table-column>
        <a-table-column key="browser" title="浏览器" data-index="browser" :width="150"/>
        <a-table-column key="os" title="操作系统" data-index="os" :width="180"/>
        <a-table-column
          key="status"
          title="状态"
          data-index="status"
          :width="120"
          align="center">
          <template slot-scope="status">
            <a-tag color="#87d068" v-if="status === 0">成功</a-tag>
            <a-tag color="#f50" v-else>失败</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="errorMsg" title="登录信息" data-index="errorMsg"/>
        <!-- <a-table-column key="action" title="操作" :width="200" fixed="right" >
          <template slot-scope="text, record">
            <a @click="view(record)">查看</a>
          </template>
        </a-table-column> -->
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import * as LoginLogApi from '@/api/system/login-log'
export default {
  name: 'LoginLog',
  components: { STable },
  data () {
    return {
      query: {
        startTime: '',
        endTime: ''
      },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.query)
        return LoginLogApi.getList(requestParameters)
          .then(res => {
            return res.data
          })
      }
    }
  }
}
</script>
