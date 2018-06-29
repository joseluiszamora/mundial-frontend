<template lang="pug">
    img(:src="'http://rrhh.miteleferico.bo/images/personal/' + documento + '.jpg'", @error="imageLoadOnError", v-if="visible", :width="width")
    img(src="/static/mundial.png", v-else, :width="width")
</template>

<script>
export default {
  props: {
    documento: { type: String, required: true },
    width: { type: Number, required: false }
  },
  name: 'image-profile',
  data () {
    return {
      visible: true
    }
  },
  methods: {
    imageLoadOnError () {
      this.visible = false
    }
  },
  created () {
    if (this.documento === null || this.documento === '' || this.documento === 'null') {
      this.visible = false
    }
  }
}
</script>