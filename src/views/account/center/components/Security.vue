<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
    <change-password ref="pwd"/>
  </a-list>
</template>

<script>
import ChangePassword from './ChangePassword'
export default {
  components: { ChangePassword },
  data () {
    return {
      data: [
        { title: '账户密码', description: '已设置', value: '', actions: { title: '修改', callback: () => { this.$refs.pwd.show() } } }
      ]
    }
  }
}
</script>

<style scoped>

</style>
