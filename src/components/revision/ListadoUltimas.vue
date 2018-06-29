<template lang="pug">
  div
    loader(v-show='loading')
    v-list(three-line, v-if='items', style="height:400px;overflow:auto;")
      template(v-for='item in items')
        v-list-tile(avatar, :key='item.id_revision')
          v-list-tile-avatar
            v-tooltip(top)
              // v-btn(dark, color='primary', slot='activator') Top
              image-profile(:documento="item.documento_usuario || 'null'", :width="100", slot='activator')
              span {{ item.usuario }}
          v-list-tile-content
            v-list-tile-title(style='height:37px !important;')
              v-chip(:color='makeTitleAndColor(item.linea)', text-color='white') {{ item.obra }}
              v-chip(:color='makeTitleAndColor(item.linea)', text-color='white') {{ item.actividad }}
              v-chip(:color='makeTitleAndColor(item.linea)', text-color='white') {{ item.tarea }}
            v-list-tile-sub-title(v-html='item.fecha_revision')
            v-list-tile-sub-title(v-html='item.descripcion')
        v-divider
</template>

<script>
import loader from '../shared/Loader.vue'
import http from '@/http/revision.js'
import ImageProfile from '@/components/shared/ImageProfile'
export default {
  name: 'listadoRevisiones',
  components: { loader, ImageProfile },
  data () {
    return {
      loading: false,
      items: []
    }
  },
  methods: {
    listadoRevisiones () {
      this.loading = true
      http.getAll({ limite: 20, linea: '', obra: '', actividad: '' }).then(res => {
        this.items = res.data
        this.loading = false
      }, (error) => {
        console.log(error.response.data)
      })
    },
    makeTitleAndColor (destiny) {
      console.log('1--> ' + destiny)
      let newColor = null
      if (destiny === 'linea_roja') {
        newColor = 'red'
      }
      if (destiny === 'linea_amarilla') {
        newColor = 'yellow'
      }
      if (destiny === 'linea_verde') {
        newColor = 'green'
      }
      if (destiny === 'linea_blanca') {
        newColor = 'blue-grey'
      }
      if (destiny === 'linea_azul') {
        newColor = 'blue'
      }
      if (destiny === 'linea_morada') {
        newColor = 'purple'
      }
      if (destiny === 'linea_cafe') {
        newColor = 'brown'
      }
      if (destiny === 'linea_celeste') {
        newColor = 'light-blue'
      }
      if (destiny === 'linea_naranja') {
        newColor = 'orange'
      }
      if (destiny === 'edificios') {
        newColor = 'cyan'
      }
      console.log('2--> ' + newColor)
      return newColor
    }
  },
  created () {
    this.listadoRevisiones()
  }
}
</script>