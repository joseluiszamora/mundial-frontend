<template lang="pug">
  div
    v-card
      v-card-title
        span.headline {{ codigo_linea }}
      chart(:options='polar')
    //loader(v-show='loading')
    v-toolbar(color='primary', dense)
      v-toolbar-title.white--text Avances Programados {{ codigo_linea }}
      v-spacer
      v-tooltip(top)
        v-btn(icon, slot='activator', @click="refresh")
          v-icon(dark) refresh
        span Recargar
      v-tooltip(top)
        v-btn(icon, slot='activator', @click.native.stop="dialog = true")
          v-icon(dark) add_circle_outline
        span Nuevo Lote
    v-card
      v-dialog(v-model='dialog', max-width='500px', persistent)
        v-card
          v-card-title
            span.headline {{ formTitle }}
          v-card-text
            v-container(grid-list-md)
              v-layout(wrap)
                v-flex(xs12, sm12, md12)
                  v-select(label='Linea', v-model='editedItem.codigo_linea', :items='lineas', item-text="nombre" , item-value="codigo_linea" )
                v-flex(xs12, sm12, md12)
                  v-menu(ref='menu', lazy, :close-on-content-click='false', v-model='menu', transition='scale-transition', offset-y, full-width, :nudge-right='40', min-width='290px')
                    v-text-field(slot='activator', v-model='editedItem.fecha', prepend-icon='event', readonly)
                    v-date-picker(ref='picker', v-model='editedItem.fecha', @change.native="menu = false", min='2014-01-01', :max='new Date().toISOString().substr(0, 10)', locale="es-419")
                v-flex(xs11, sm11, md11)
                  v-slider(label='Avance', v-model='editedItem.avance', thumb-color='red', thumb-label='')
                v-flex(xs1, sm1, md1)
                  // v-text-field(v-model='editedItem.avance')
                  span.title {{ editedItem.avance + '%' }}
                v-flex(xs12, sm12, md12)
                  v-text-field(label='Descripción', v-model='editedItem.descripcion' )
          v-card-actions
            v-spacer
            v-btn(color='blue darken-1', flat, @click.native='close') Cancelar
            v-btn(color='blue darken-1', flat, @click.native='save') Guardar
      v-data-table.elevation-1(:headers='headers', :items='items', :loading="loading", :pagination.sync="pagination" )
        v-progress-linear(slot='progress', color='blue', indeterminate)
        template(slot='items', scope='props')
          td.text-xs-center {{ props.item.codigo_linea }}
          td.text-xs-center {{ props.item.fecha }}
          td.text-xs-center {{ props.item.avance }}
          td.text-xs-center {{ props.item.descripcion }}

          td.justify-center.layout.px-0
            v-btn.mx-0(icon, @click='editItem(props.item)')
              v-icon(color='teal') edit
            v-btn.mx-0(icon, @click='deleteItem(props.item)')
              v-icon(color='pink') delete
        template(slot='no-data')
          v-btn(color='primary', @click='initialize') Reset
</template>

<script>
import http from '@/http/programacion'
import httpLinea from '@/http/linea'
import loader from '../shared/Loader.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

export default {
  name: 'formProgramacion',
  components: { loader },
  data () {
    return {
      loading: false,
      dialog: false,
      menu: false,
      codigo_linea: 'linea_naranja',
      headers: [
        { text: 'Linea', align: 'center', value: 'codigo_linea' },
        { text: 'Fecha', align: 'center', value: 'fecha' },
        { text: 'Avance', align: 'center', value: 'avance' },
        { text: 'Descripción', align: 'center', value: 'descripcion' },
        { text: '', value: '', sortable: false }
      ],
      pagination: {'sortBy': 'fecha', 'descending': true, 'rowsPerPage': 10},
      items: [],
      editedIndex: -1,
      editedItem: {
        codigo_linea: null,
        fecha: null,
        avance: 0,
        descripcion: ''
      },
      defaultItem: {
        codigo_linea: null,
        fecha: null,
        avance: 0,
        descripcion: ''
      },
      lineas: [],
      polar: {
        xAxis: {
          type: 'category',
          // data: ['01/2018', '02/2018', '03/2018', '04/2018', '05/2018', '06/2018', '07/2018', '08/2018', '09/2018']
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          // data: [0, 15, 25, 32, 56, 72, 88, 95, 100],
          data: [],
          type: 'line'
        }]
      }
    }
  },
  methods: {
    refresh () {
    },
    initialize () {
      this.getLineasPorFase('fase2')
      this.getPorLinea(this.codigo_linea)
    },
    getLineasPorFase (fase) {
      httpLinea.getPorFase(fase).then(res => {
        this.lineas = res.data.data
      })
    },
    getPorLinea (linea) {
      this.loading = true
      http.progs(linea).then(res => {
        this.items = res.data.data

        res.data.data.forEach(function (element) {
          this.polar.xAxis.data.push(element.fecha)
          this.polar.series[0].data.push(element.avance)
        }, this)

        this.polar.xAxis.data.sort()
        this.polar.series[0].data.sort()

        this.loading = false
      })
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        console.log('edit')
        this.editar(this.editedItem)
      } else {
        console.log('save')
        this.guardar(this.editedItem)
      }
      this.close()
    },
    guardar (item) {
      this.loading = true
      let objectReturn = `codigo_linea=${item.codigo_linea}&fecha=${item.fecha}&avance=${item.avance}&descripcion=${item.descripcion}`
      http.save(objectReturn).then(res => {
        this.loading = false
        this.initialize()
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    editar (item) {
      this.loading = true
      let objectReturn = `id=${item.id}&codigo_linea=${item.codigo_linea}&fecha=${item.fecha}&avance=${item.avance}&descripcion=${item.descripcion}`
      http.edit(objectReturn).then(res => {
        this.loading = false
        this.initialize()
      }, (error) => {
        this.error = true
        console.log(error)
      })
    }
  },
  created () {
    this.initialize()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Programación' : 'Editar Programación'
    }
  }
}
</script>