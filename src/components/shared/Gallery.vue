<template>
  <v-layout row>
    <v-flex xs12 sm12>
      <v-card class="grid">
        <v-container fluid grid-list-sm>
          <v-layout row wrap>
            <v-flex :class="makeClass()" v-for="image in images" id="imagesContainer"  :key="image.id">
              <img height="300px" width="100%" v-img="{ title: makeTitle(image) }" :src="makeImage(image)">
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import config from '@/config'

export default {
  name: 'gallery',
  components: { config },
  props: {
    // type: { type: String, required: true },
    id_tarea: { type: String, required: false },
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
