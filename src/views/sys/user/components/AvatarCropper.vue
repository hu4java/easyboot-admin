<template>
  <a-modal v-model="visible" title="Basic Modal">
    <vue-cropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"/>

  </a-modal>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'AvatarCropper',
  components: { VueCropper },
  data () {
    return {
      visible: false,
      option: {
        img: '',
        outputType: 'jpg'
      }
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>
