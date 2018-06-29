<template lang="pug">
  div
    v-layout(row, v-if="images.length > 0")
      v-flex(xs12, sm12)
        v-card.grid
          v-container(fluid, grid-list-sm)
            loader(message="Cargando Imagenes...", v-if="loader")
            v-layout(row, wrap)
              v-flex#imagesContainer(:class='makeClass()', v-for='image in images', :key='image.id')
                img(height='300px', width='100%', v-img='{ title: makeTitle(image) }', :src='makeImage(image)')
    v-card(v-else)
      v-container(style="min-height: 200px;")
        v-layout(justify-center)
          v-icon(x-large) photo
        v-layout(justify-center)
          .headline Ninguna imagen encontrada
</template>

<script>
import http from '@/http/archivo'
import config from '@/config'
import loader from '../shared/LoaderMessage.vue'

export default {
  name: 'gallery-obra',
  components: { config, loader },
  props: {
    obra: { type: Object, required: true }
  },
  data () {
    return {
      images: [],
      loader: true
    }
  },
  created () {
    this.galeriaObra(this.obra.id_obra)
  },
  methods: {
    galeriaObra (idObra) {
      http.galeriaObra(idObra).then(res => {
        console.log(res.data)
        console.log(res.data.length)
        this.images = res.data
        this.loader = false
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    makeTitle (image) {
      return '[' + image.actividad + '] ' + '[' + image.tarea + '] ' + '(' + image.fecha + ') ' + image.descripcion
    },
    makeImage (image) {
      return config.publicUrl + image.archivo
    },
    makeClass () {
      if (this.images.length >= 3) {
        return 'xs3'
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
