<template lang="pug">
  v-container(fluid)
    v-slide-y-transition(mode='out-in')
      v-card
        v-card-title
          .headline
            | Lista de Revisiones
            v-btn(icon, @click='refresh')
              v-icon replay
            v-btn(icon primary dark, @click.stop='showFilter = false', v-show="showFilter" )
              v-icon filter_list
            v-btn(icon, @click.stop='showFilter = true', v-show="!showFilter" )
              v-icon filter_list
          v-spacer
          v-text-field(append-icon='search', label='Buscar...', single-line, hide-details, v-model='search')
        v-card-title(v-show='showFilter')
          v-layout(row wrap)
            v-flex(md3)
              v-select.px-2(label='Linea', :items='lineas', v-model='lineaSelected', item-text='nombre', item-value='codigo_linea', autocomplete)
            v-flex(md3)
              v-select.px-2(label='Obra', :items='obras', v-model='obraSelected', item-text='nombre', item-value='id_obra', autocomplete)
            v-flex(md3)
              v-select.px-2(label='Actividad', :items='actividades', v-model='actividadSelected', item-text='nombre', item-value='id_actividad', autocomplete)
              
            v-flex(md2)
              v-flex(xs12, sm3)
                v-tooltip(top)
                  v-btn(flat, icon, color='indigo', slot='activator', @click='resetFilters')
                    v-icon(color='red') highlight_off
                  span Reiniciar Formulario

        loader(v-show="loading")
        template
          v-data-table(item-key='id_revision', v-show='!loading', :headers='headers', :items='items', :search='search', :pagination.sync='pagination', :rows-per-page-items='pag', no-data-text='Ninguna revisión', rows-per-page-text='revisiones por pagina')
            template(slot='items', scope='props')
              tr
                td.text-xs-center
                  v-chip(:color='makeTitleAndColor(props.item.linea)', text-color='white') {{ props.item.linea }}
                td.text-xs-center {{ props.item.obra }}
                td.text-xs-center {{ props.item.actividad }}
                td.text-xs-center {{ props.item.tarea }}
                td.text-xs-center
                  v-tooltip(top)
                    image-profile(:documento="props.item.documento_usuario || 'null'", :width="40", slot='activator')
                    span {{ props.item.usuario }}
                td.text-xs-center {{ props.item.tipo_revision }}
                td.text-xs-center {{ props.item.fecha_revision }}
                td.text-xs-center {{ props.item.archivos.length }}
                td
                  v-layout
                      v-btn(flat, icon, color='indigo', @click='props.expanded = !props.expanded')
                        v-icon(v-html="props.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'")
            template(slot='expand', scope='props')
              v-card(flat)
                v-layout(row wrap)
                  v-flex(px-1 xs12, :class="{sm4: props.item.archivos.length > 0}")
                    informacion(type="fromObject", :data="props.item", :id_tarea="props.item.id_tarea")
                  v-flex(xs12 sm8, v-if="props.item.archivos.length > 0")
                    gallery(type="fromArray", :images="props.item.archivos", :id_tarea="props.item.id_tarea")
</template>

<script>
import Loader from '../shared/Loader.vue'
import httpLinea from '@/http/linea'
import httpObra from '@/http/obra'
import httpActividad from '@/http/actividad'
import httpTarea from '@/http/tarea'
import http from '@/http/revision.js'
import informacion from '../revision/Informacion.vue'
import gallery from '../shared/Gallery.vue'
import ImageProfile from '@/components/shared/ImageProfile'
export default {
  components: { Loader, informacion, gallery, ImageProfile },
  name: 'listadoRevisiones',
  data () {
    return {
      loading: false,
      search: '',
      selected: [],
      showFilter: false,
      pagination: { sortBy: 'fecha_revision', 'descending': true },
      headers: [
        { text: 'Linea', value: 'linea' },
        { text: 'Obra', value: 'obra' },
        { text: 'Actividad', value: 'actividad' },
        { text: 'Tarea', value: 'tarea' },
        { text: 'Revisado por', value: 'usuario' },
        { text: 'Tipo', value: 'tipo_revision' },
        { text: 'Fecha', value: 'fecha_revision' },
        { text: 'Archivos', value: 'archivos' }
      ],
      items: [],
      pag: [10, 50, 100, { text: 'Todos', value: -1 }],
      lineas: [],
      lineaSelected: null,
      obras: [],
      obraSelected: null,
      actividades: [],
      actividadSelected: null
    }
  },
  methods: {
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    refresh () {
      this.loading = true
      http.getAll(this.returnFilters).then(res => {
        this.items = res.data
        this.loading = false
      }, (error) => {
        console.log(error.response.data)
      })
    },
    getLineasPorFase (fase) {
      httpLinea.getPorFase(fase).then(res => {
        this.lineas = res.data.data
      }, (error) => {
        console.log(error)
      })
    },
    getObrasPorLinea (codigoLinea) {
      httpObra.obrasLinea(codigoLinea, { estadoSelected: '', tipodeObraSelected: '' }).then(res => {
        this.obras = res.data
      }, (error) => {
        console.log(error)
      })
    },
    getActividadesPorObra (idObra) {
      httpActividad.actividadesObra(idObra).then(res => {
        this.actividades = res.data
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    getTareasPorActividad (idActividad) {
      httpTarea.tareasActividad(idActividad).then(res => {
        this.tareas = res.data
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    resetFilters () {
      this.returnFilters.linea = null
      this.returnFilters.obra = null
      this.returnFilters.actividad = null
      console.log('Reset')
      this.lineaSelected = null
      this.obraSelected = null
      this.actividadSelected = null
      this.refresh()
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
  computed: {
    returnFilters () {
      let filteredArray = {
        linea: this.lineaSelected,
        obra: this.obraSelected,
        actividad: this.actividadSelected
      }
      return filteredArray
    }
  },
  watch: {
    lineaSelected (newVal, oldVal) {
      this.obraSelected = null
      this.actividadSelected = null
      this.getObrasPorLinea(newVal)
      this.refresh()
    },
    obraSelected (newVal, oldVal) {
      this.actividadSelected = null
      this.getActividadesPorObra(newVal)
      this.refresh()
    },
    actividadSelected (newVal, oldVal) {
      this.getTareasPorActividad(newVal)
      this.refresh()
    }
  },
  created () {
    this.getLineasPorFase('fase2')
    this.refresh()
  }
}
</script>
<style scoped>
</style>