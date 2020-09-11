<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-button icon="rollback" @click="cancel">返回</a-button>
      <a-divider />
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item prop="id" hidden>
          <a-input v-model="form.id" />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="上级菜单" prop="pid">
              <a-tree-select
                v-model="form.pid"
                allowClear
                style="width: 100%"
                :dropdown-style="{ overflow: 'auto' }"
                :tree-data="menuList"
                :replaceFields="{key: 'id', value: 'id'}"
                placeholder="请选择"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="菜单标题" prop="title">
              <a-input v-model="form.title"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="菜单类型" prop="type">
              <a-radio-group v-model="form.type" button-style="solid">
                <a-radio-button :value="1">目录</a-radio-button>
                <a-radio-button :value="2">菜单</a-radio-button>
                <a-radio-button :value="3">按钮</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="图标" prop="icon">
              <a-input-search
                v-model="form.icon"
                enter-button="选择图标"
                @search="onSearchIcons"
              >
                <a-icon slot="prefix" v-if="svg" :component="svg" />
                <a-icon slot="prefix" v-else :type="form.icon" />
              </a-input-search>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="form.type !== 1">
            <a-form-model-item label="权限标识" prop="code">
              <a-input v-model="form.code"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" v-if="form.type !== 3">
            <a-form-model-item label="路由地址" prop="path">
              <a-input v-model="form.path"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="form.type === 1">
            <a-form-model-item label="重定向" prop="redirect">
              <a-input v-model="form.redirect"/>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row v-if="form.type !== 3">
          <a-col :span="12">
            <a-form-model-item label="路由名" prop="routeName" extra="请使用英文字母填写">
              <a-input v-model="form.routeName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="组件" prop="component">
              <a-radio-group v-model="defaultComponent">
                <a-radio :value="true">默认</a-radio>
                <a-radio :value="false">手动输入</a-radio>
              </a-radio-group>
              <a-select
                v-if="defaultComponent"
                v-model="form.component"
                show-search
                placeholder="请选择"
                option-filter-prop="children"
              >
                <a-select-option v-for="router in routers" :key="router.value" :value="router.value">
                  {{ router.title }}
                </a-select-option>
              </a-select>
              <a-input v-else v-model="form.component" addon-before="@/view/" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-model-item label="是否隐藏" prop="hidden">
              <a-radio-group v-model="form.hidden" :default-value="false">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="状态" prop="status">
              <a-radio-group v-model="form.status" :default-value="0">
                <a-radio :value="0">启用</a-radio>
                <a-radio :value="1">禁用</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-model-item label="排序" prop="orderNum">
              <a-input-number v-model="form.orderNum" :min="1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="form.type === 1">
            <a-form-model-item label="强转菜单" prop="hideChildrenInMenu" extra="强制菜单显示为Item而不是SubItem">
              <a-switch v-model="form.hideChildrenInMenu" default-checked />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 9 }">
          <a-button type="primary" v-if="isEdit" @click="submitForm" :loading="submitLoading">{{ submitLoading ? '更新中':'更新' }}</a-button>
          <a-button type="primary" v-else @click="submitForm" :loading="submitLoading">{{ submitLoading ? '提交中':'提交' }}</a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
      <a-modal :visible="visible" title="选择图标" :closable="false" width="55%">
        <template v-slot:footer>
          <a-button key="back" @click="visible = false">取消</a-button>
          <a-button key="submit" type="primary" @click="selectDone">确定</a-button>

        </template>
        <IconSelector @change="onChangeIcon"/>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { IconSelector } from '@/components'
import * as MenuApi from '@/api/system/menu'
import routers from '@/router/router-map'
import svgIcons from '@/core/icons'

export default {
  name: 'MenuForm',
  components: { IconSelector },
  data () {
    return {
      isEdit: false,
      visible: false,
      submitLoading: false,
      defaultComponent: true,
      svg: null,
      selectIcon: '',
      svgIcons,
      form: {
        id: '',
        title: '',
        routeName: '',
        pid: 0,
        type: 1,
        hidden: false,
        icon: '',
        code: '',
        path: '',
        redirect: '',
        component: '',
        status: 0,
        orderNum: 1,
        hideChildrenInMenu: false
      },
      menuList: [],
      routers,
      rules: {
        title: [
          { required: true, message: '请填写菜单标题' }
        ],
        path: [
          { required: true, message: '请填写路由地址' }
        ],
        permission: [
          { required: true, message: '请填写权限标识' }
        ],
        routeName: [
          { required: true, message: '请填写路由名称' }
        ],
        component: [
          { required: true, message: '请填写视图组件' }
        ],
        orderNum: [
          { required: true, message: '请填写排序' }
        ]
      }
    }
  },
  created () {
    const pid = this.$route.query.pid
    if (pid) {
      this.form.pid = pid
    }
    this.getMenuList()
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.getMenu(id)
    }
  },
  methods: {
    async getMenuList () {
      const resp = await MenuApi.getList()
      if (resp.success) {
        this.menuList = resp.data
        this.menuList.unshift({ id: '0', title: '无', pid: '0', value: '0' })
      }
    },
    async getMenu (id) {
      const menuData = await MenuApi.detail(id)
      if (menuData.success) {
        this.form = menuData.data
        this.svg = this.svgIcons[this.form.icon]
      }
    },
    onSearchIcons (value) {
      this.visible = true
      this.selectIcon = value
    },
    onChangeIcon (icon) {
      this.selectIcon = icon
    },
    selectDone () {
      this.visible = false
      this.form.icon = this.selectIcon
      this.svg = this.svgIcons[this.form.icon]
    },
    submitForm () {
      const self = this
      self.$refs.form.validate(async (valid) => {
        if (!valid) {
          return
        }
        self.submitLoading = true
        if (self.isEdit) {
          self.update()
        } else {
          self.save()
        }
      })
    },
    async save () {
      const self = this
      const resp = await MenuApi.save(this.form)
      if (resp.success) {
        self.$message.success('保存成功')
        self.$confirm({
          title: '提示',
          content: '保存成功',
          okText: '继续新增',
          okType: 'primary',
          cancelText: '返回上一页',
          centered: true,
          onOk () {
            self.$refs.form.resetFields()
            self.form.icon = 'none'
            self.selectIcon = 'none'
            self.svg = null
            self.getMenuList()
          },
          onCancel () {
            self.cancel()
          }
        })
      }
      self.submitLoading = false
    },
    async update () {
      const self = this
      const resp = await MenuApi.update(this.form)
      if (resp.success) {
        self.$message.success('更新成功')
      }
      self.$nextTick(() => {
        self.submitLoading = false
      })
    },
    cancel () {
      this.$router.push({ name: 'MenuList' })
    }
  }
}
</script>
