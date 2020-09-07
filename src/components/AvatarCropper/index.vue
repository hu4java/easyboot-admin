<template>

  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button icon="upload">选择图片</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button icon="plus" @click="changeScale(1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="minus" @click="changeScale(-1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="undo" @click="rotateLeft"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="redo" @click="rotateRight"/>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish()">确定</a-button>
      </a-col>
    </a-row>
  </a-modal>

</template>
<script>
export default {
  data () {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {},
      previewStyle: {}
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    cancel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload (file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)

      return false
    },

    // 上传图片（点击上传按钮）
    finish () {
      //   console.log('finish')
      //   const _this = this
      //   const formData = new FormData()
      //   // 输出
      //   if (type === 'blob') {
      //     this.$refs.cropper.getCropBlob((data) => {
      //       const img = window.URL.createObjectURL(data)
      //       this.model = true
      //       this.modelSrc = img
      //       formData.append('file', data, this.fileName)
      //       this.$http.post('https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      //         .then((response) => {
      //           console.log('upload response:', response)
      //           // var res = response.data
      //           // if (response.status === 'done') {
      //           //   _this.imgFile = ''
      //           //   _this.headImg = res.realPathList[0] // 完整路径
      //           //   _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
      //           //   _this.$message.success('上传成功')
      //           //   this.visible = false
      //           // }
      //           _this.$message.success('上传成功')
      //           _this.$emit('complete', response.url)
      //           _this.visible = false
      //         })
      //     })
      //   } else {
      //     this.$refs.cropper.getCropData((data) => {
      //       this.model = true
      //       this.modelSrc = data
      //     })
      //   }
      const self = this
      self.$refs.cropper.getCropData((data) => {
        self.$emit('complete', data)
        self.visible = false
      })
    },
    okHandel () {
      const self = this
      self.confirmLoading = true
      setTimeout(() => {
        self.confirmLoading = false
        self.close()
      }, 2000)
    },
    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    margin: 20% auto;
    position: relative;
    // top: 50%;
    // transform: translate(50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 5px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
