<template lang="pug">
  v-layout(row)
    v-flex(xs12, sm12)
      v-card.grid
        v-container(fluid, grid-list-sm)
          h2 FFF
          loader
          v-layout(row, wrap)
            v-flex#imagesContainer(:class='makeClass()', v-for='image in images', :key='image.id')
              img(height='300px', width='100%', v-img='{ title: makeTitle(image) }', :src='makeImage(image)')
</template>

<script>
import config from '@/config'
import loader from '../shared/Loader.vue'

export default {
  name: 'gallery',
  components: { config, loader },
  props: {
    images: { type: Array, required: false }
  },
  data () {
    return {
    }
  },
  methods: {
    makeTitle (image) {
      return '(' + image.fecha_creacion + ') ' + image.descripcion
    },
    makeImage (image) {
      return config.publicUrl + image.directorio + image.nombre
    },
    makeClass () {
      if (this.images.length >= 3) {
        return 'xs4'
      } else {
        if (this.images.length === 1) {
          return 'xs12'
        } else {
          return 'xs6'
        }
      }
    }
  }
}
</script>

<style scoped>
  #imagesContainer > img {
    margin: 0 auto;
    display: block;
  }
</style>
