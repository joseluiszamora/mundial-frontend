<template lang="pug">
  v-container(fluid)
    v-slide-y-transition(mode='out-in')
      v-card
        v-card-text
          v-toolbar(color='primary')
            v-toolbar-title.white--text Crear Bloque de Tareas
          v-container(fluid)
            v-layout(row, justify-center)
              v-flex(xs12, sm2)
                v-select.px-2(label='Linea', :items='lineas', v-model='lineaSelected', item-text='nombre', item-value='codigo_linea', autocomplete)
              v-flex(xs12, sm3)
                v-select.px-2(label='Obra', :items='obras', v-model='obraSelected', item-text='nombre', item-value='id_obra', autocomplete)
              v-flex(xs12, sm3)
                v-select.px-2(label='Actividad', :items='actividades', v-model='actividadSelected', item-text='nombre', item-value='id_actividad', autocomplete)
              //v-flex(xs12, sm4)
                v-select.px-2(label='Tarea', :items='tareas', v-model='tareaSelected', item-text='nombre', autocomplete)
            v-layout(row, justify-center, v-if="validate")
              v-flex(xs4, sm4, pr-3)
                v-toolbar(color='primary')
                  v-toolbar-title.white--text Tareas Existentes
                v-data-table.elevation-1(v-bind:headers='headersTareas', v-bind:items='tareas', :rows-per-page-items="pag")
                  template(slot='items', scope='props')
                    tr(:active='props.selected')
                      td.text-xs-left {{ props.item.nombre }}
                      td.text-xs-center
                        v-chip(color='green', text-color='white', v-if="props.item.estado==='concluido'") {{ props.item.estado }}
                        v-chip(color='secondary', text-color='white', v-else) {{ props.item.estado }}
                      td.text-xs-center(v-if="props.item.estado==='concluido'")
                        v-tooltip(top)
                          v-btn.blue(slot='activator', fab, small, right, @click='enabledTarea(props.item.id_tarea)')
                            v-icon(dark) refresh
                          span Rehabilitar esta tarea
              v-flex(xs8, sm8)
                v-toolbar(color='primary')
                  v-toolbar-title.white--text Crear Tareas
                div(style='float:right')
                  v-tooltip(top)
                    v-btn.teal(slot='activator', fab, small, right, @click='removeObras', v-show='this.selected.length > 0')
                      v-icon(dark) remove
                    span Remover todas las seleccionadas
                  v-tooltip(top)
                    v-btn.blue(slot='activator', fab, small, right, @click='addTarea')
                      v-icon(dark) add
                    span Agregar Nuevo
                  v-tooltip(top)
                    v-btn.teal(slot='activator', fab, small, right, @click='dialogOtraLinea = true')
                      v-icon(dark) get_app
                    span Importar tareas
                  v-tooltip(top)
                    v-btn.green(slot='activator', fab, small, right, @click='saveObras')
                      v-icon(dark) save
                    span Guardar todas las tareas completas
                
                v-dialog(v-model='dialogOtraLinea', persistent='', scrollable='', max-width='400px')
                  v-card
                    v-card-title Importar tareas desde:
                    v-divider
                    div
                      v-select.px-2(style='margin:0 0 0;', label='Linea', :items='lineasImport', v-model='lineaSelectedImport', item-text='nombre', item-value='codigo_linea', autocomplete)
                    v-divider
                    div
                      v-select.px-2(style='margin:0 0 0;', label='Obra', :items='obrasImport', v-model='obraSelectedImport', item-text='nombre', item-value='id_obra')
                    v-divider
                    div
                      v-select.px-2(style='margin:0 0 0;', label='Actividad', :items='actividadesImport', v-model='actividadSelectedImport', item-text='nombre', item-value='id_actividad')
                    v-divider
                    v-card-text(style='max-height: 300px;')
                      v-subheader Tareas
                      div(v-for='actividad in tareasParaImportar', v-bind:key='actividad.id_actividad', style='height:30px;')
                        v-checkbox(:label='actividad.nombre', v-model='actividad.select', light='')
                    v-divider
                    v-card-actions
                      v-spacer
                      v-btn(color='grey darken-1', flat='', @click.native='dialogOtraLinea = false') Cancelar
                      v-btn(color='green darken-1', flat='', @click='importarObras') Importar({{ countTareasparaImportar() }})
                
                v-data-table.elevation-1(:headers='headers', :items='items', v-model='selected', item-key='id', select-all, hide-actions)
                  template(slot='headerCell', scope='props')
                    v-tooltip(bottom='')
                      span(slot='activator')
                        | {{ props.header.text }}
                      span
                        | {{ props.header.text }}
                  template(slot='items', scope='props')
                    td
                      div
                        v-checkbox(primary='', hide-details='', v-model='props.selected')
                    td.text-xs-center
                      v-text-field(style='width: 150pxmargin: 0 auto', v-model='props.item.nombre')
                    td.text-xs-center
                      v-text-field(style='width: 90pxmargin: 0 auto', label='2018-01-31', v-model='props.item.fecha_revision')
                    td.text-xs-center
                      v-text-field(v-model='props.item.descripcion')
                    td.text-xs-center
                      v-icon(v-show='checkObra(props.item)', small='', color='green darken-2') check
</template>

<script>
import httpLinea from '@/http/linea'
import httpObra from '@/http/obra'
import httpActividad from '@/http/actividad'
import httpTarea from '@/http/tarea'
import { mapGetters } from 'vuex'
export default {
  name: 'crearBloque',
  data () {
    return {
      selected: [],
      headersTareas: [
        { text: 'Tareas', align: 'left', value: 'nombre' }
      ],
      headers: [
        { text: 'Nombre de la Tarea *', align: 'center', sortable: false, value: 'name' },
        { text: 'Fecha de Revisión', align: 'center', sortable: false, value: 'fecha_revision' },
        { text: 'Descripción', align: 'center', sortable: false, value: 'descripcion' }
      ],
      pag: [10, 20, 50, { text: 'Todos', value: -1 }],
      items: [],
      tiposDeObra: ['Estación', 'Torre', 'Obras Complementarias'],
      lineas: [],
      lineaSelected: null,
      obras: [],
      obraSelected: null,
      actividades: [],
      actividadSelected: null,
      lineasImport: [],
      lineaSelectedImport: null,
      obrasImport: [],
      obraSelectedImport: null,
      actividadesImport: [],
      actividadSelectedImport: null,
      tareas: [],
      tareaSelected: null,
      tareasParaImportar: [],
      dialogOtraLinea: false,
      obrasParaImportar: []
    }
  },
  methods: {
    enabledTarea (idTarea) {
      console.log('***************> ' + idTarea)
      httpTarea.rehabilitarTarea(idTarea).then(
        res => {
          this.getTareasPorActividad(this.actividadSelected)
        },
        error => {
          this.showError = true
          console.log(error)
        }
      )
    },
    getLineasPorFase (fase) {
      httpLinea.getPorFase(fase).then(
        res => {
          this.lineas = res.data.data
          this.lineasImport = res.data.data
        },
        error => {
          console.log(error)
        }
      )
    },
    getObrasPorLinea (codigoLinea) {
      httpObra.obrasLinea(codigoLinea, { estadoSelected: '', tipodeObraSelected: '' })
        .then(
          res => {
            this.obras = res.data
          },
          error => {
            console.log(error)
          }
        )
    },
    updateObrasImport (codigoLinea) {
      httpObra.obrasLinea(codigoLinea, { estadoSelected: '', tipodeObraSelected: '' })
        .then(
          res => {
            this.obrasImport = res.data
          },
          error => {
            console.log(error)
          }
        )
    },
    getActividadesPorObra (idObra) {
      httpActividad.actividadesObra(idObra).then(
        res => {
          this.actividades = res.data
        },
        error => {
          this.showError = true
          console.log(error)
        }
      )
    },
    updateActividadesimport (idObra) {
      httpActividad.actividadesObra(idObra).then(
        res => {
          this.actividadesImport = res.data
        },
        error => {
          this.showError = true
          console.log(error)
        }
      )
    },
    getTareasPorActividad (idActividad) {
      httpTarea.tareasActividad(idActividad).then(
        res => {
          this.tareas = res.data
        },
        error => {
          this.showError = true
          console.log(error)
        }
      )
    },
    updateTareasImport (idActividad) {
      this.tareasParaImportar = []
      httpTarea.tareasActividad(idActividad).then(
        res => {
          res.data.forEach(function (element) {
            let temp = { select: true, id_tarea: element.id_tarea, nombre: element.nombre, fecha_revision: element.fecha_revision, descripcion: element.descripcion }
            this.tareasParaImportar.push(temp)
          }, this)
        },
        error => {
          this.showError = true
          console.log(error)
        }
      )
    },
    clear () {
      this.lineaSelected = null
      this.obraSelected = null
      this.actividadSelected = null
      this.tareaSelected = null
      this.obras = []
      this.actividades = []
      this.tareas = []
    },
    addTarea () {
      this.items.push(this.createBlankTarea())
    },
    addObraObj (obra) {
      this.items.push(obra)
    },
    createBlankTarea () {
      return {
        id: this.getId(),
        nombre: '',
        fecha_revision: '',
        descripcion: ''
      }
    },
    removeObras () {
      // remueve todas las obras seleccionadas
      this.selected.forEach(function (element) {
        this.removeObra(element.id)
      }, this)
    },
    getId () {
      // da un id para nueva obra
      let index = 1
      this.items.forEach(function (element) {
        if (element.id >= index) {
          index = element.id + 1
        }
      }, this)
      return index
    },
    removeObra (id) {
      // elimina una obra especifica basada en el id de la onbra
      let tempArray = []
      this.items.forEach(function (element, index) {
        if (element.id !== id) {
          tempArray.push(element)
        }
      }, this)
      this.items = tempArray
    },
    checkObra (obra) {
      // verifica si los datos de la obra estan completos
      if (
        obra.tipo !== '' &&
        obra.codigo !== '' &&
        obra.nombre !== '' &&
        obra.fecha_inicio !== '' &&
        obra.fecha_fin !== ''
      ) {
        return true
      }
      return false
    },
    checkTarea (tarea) {
      // verifica si los datos de la obra estan completos
      if (
        tarea.nombre !== '' &&
        this.actividadSelected !== '' &&
        this.actividadSelected !== null
      ) {
        return true
      }
      return false
    },
    saveObras () {
      if (this.actividadSelected !== '' && this.actividadSelected !== null) {
        // guarda las obras en bloque
        this.items.forEach(function (element) {
          if (this.checkTarea(element)) {
            const tarea = `id_actividad=${this.actividadSelected}&nombre=${element.nombre}&descripcion=${element.descripcion}&fecha_revision=${element.fecha_revision}`
            httpTarea.tareaCreate(tarea).then(
              res => {
                this.$snotify.success(
                  'Se creo la tarea ' + element.nombre,
                  'Tarea Creada'
                )
                this.removeObra(element.id)
              },
              error => {
                this.showError = true
                console.log(error)
              }
            )
          }
        }, this)
        // update list
        this.getTareasPorActividad(this.actividadSelected)
      } else {
        this.$snotify.error(
          'Debe seleccionar una actividad',
          'Error'
        )
      }
    },
    countTareasparaImportar () {
      let counter = 0
      this.tareasParaImportar.forEach(function (element) {
        if (element.select) {
          counter++
        }
      }, this)
      return counter
    },
    importarObras () {
      this.tareasParaImportar.forEach(function (element) {
        if (element.select) {
          this.items.push({
            id: element.id_tarea,
            nombre: element.nombre,
            fecha_revision: element.fecha_revision,
            descripcion: element.descripcion
          })
        }
      }, this)
      this.dialogOtraLinea = false
      this.lineaSelectedImport = null
      this.obraSelectedImport = null
      this.actividadSelectedImport = null
      this.tareasParaImportar = []
    },
    submit () {
    }
  },
  watch: {
    lineaSelected (newVal, oldVal) {
      this.obraSelected = null
      this.actividadSelected = null
      this.getObrasPorLinea(newVal)
    },
    obraSelected (newVal, oldVal) {
      this.getActividadesPorObra(newVal)
    },
    actividadSelected (newVal, oldVal) {
      this.getTareasPorActividad(newVal)
    },
    lineaSelectedImport (newVal, oldVal) {
      this.obraSelectedImport = null
      this.actividadSelectedImport = null
      this.updateObrasImport(newVal)
    },
    obraSelectedImport (newVal, oldVal) {
      this.actividadSelectedImport = null
      this.updateActividadesimport(newVal)
    },
    actividadSelectedImport (newVal, oldVal) {
      this.updateTareasImport(newVal)
    }
  },
  computed: {
    ...mapGetters(['getCodigoLinea']),
    validate () {
      if (this.lineaSelected != null && this.obraSelected != null && this.actividadSelected != null) {
        return true
      }
      return false
    }
  },
  created () {
    this.getLineasPorFase('fase2')
  }
}
</script>