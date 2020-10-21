<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="rollback" @click="cancel">返回</a-button>
      <a-divider />
      <a-spin size="large" :spinning="loading">
        <a-descriptions :title="`日志编号-${log.id}`" bordered>
          <a-descriptions-item label="操作人">
            {{ log.operateUser }}
          </a-descriptions-item>
          <a-descriptions-item label="操作人ID">
            {{ log.operateUserId }}
          </a-descriptions-item>
          <a-descriptions-item label="浏览器">
            {{ log.browser }}
          </a-descriptions-item>
          <a-descriptions-item label="请求时间">
            {{ log.operateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="访问IP">
            {{ log.ip }}
          </a-descriptions-item>
          <a-descriptions-item label="请求方法">
            {{ log.requestMethod }}
          </a-descriptions-item>
          <a-descriptions-item label="请求地址" :span="3">
            {{ log.requestUrl }}
          </a-descriptions-item>
          <a-descriptions-item label="执行方法" :span="2">
            {{ log.method }}
          </a-descriptions-item>
          <a-descriptions-item label="耗时(ms)">
            {{ log.time }}
          </a-descriptions-item>
          <a-descriptions-item label="描述">
            {{ log.description }}
          </a-descriptions-item>
          <a-descriptions-item label="操作类型">
            {{ log.type | typeFilter }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">

            <a-tag color="#87d068" v-if="log.status === 0">成功</a-tag>
            <a-tag color="#f50" v-else>失败</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="请求参数" :span="3">
            <vue-json-pretty
              :data="parameter"
              :deep="2"
              showLine>
            </vue-json-pretty>
          </a-descriptions-item>
          <a-descriptions-item label="响应数据" :span="3">
            <vue-json-pretty
              :data="returnBody"
              :deep="2"
              showLine>
            </vue-json-pretty>
          </a-descriptions-item>
          <a-descriptions-item label="错误信息" :span="3">
            <vue-json-pretty
              v-if="errorMsg"
              :data="errorMsg"
              :deep="2"
              showLine>
            </vue-json-pretty>
            <template v-else>
              {{ log.errorMsg }}
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import * as OperateLogApi from '@/api/system/operation-log'
export default {
  name: 'OperateLogDetail',
  components: { VueJsonPretty },
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
      loading: true,
      log: {
        id: ''
      }
    }
  },
  computed: {
    parameter () {
      if (this.log.parameter) {
        return JSON.parse(this.log.parameter)
      }
      return ''
    },
    returnBody () {
      if (this.log.returnBody) {
        return JSON.parse(this.log.returnBody)
      }
      return ''
    },
    errorMsg () {
      try {
        if (this.log.errorMsg) {
          return JSON.parse(this.log.errorMsg)
        }
        return ''
      } catch (e) {
      }
      return this.log.errorMsg
    }
  },
  mounted () {
    const id = this.$route.query.id
    if (id) {
      OperateLogApi.detail(id).then(response => {
        this.log = response.data
      }).finally(() => {
        this.loading = false
      })
    }
  },
  methods: {
    cancel () {
      this.$router.push({ name: 'OperateLogList' })
    }
  }
}
</script>
