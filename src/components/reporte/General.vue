<template lang="pug">
  v-card(color='grey lighten-4', flat)
    v-card-text
      v-toolbar(color='primary')
        v-toolbar-title.white--text Seleccione Tarea
      v-container(fluid)
        v-layout(row, wrap)
          v-flex(xs12, sm2)
            v-select.px-2(label='Linea', :items='values.lineas', v-model='lineaSelected', item-text='nombre', item-value='codigo_linea', autocomplete, no-data-text="Ninguna Linea")
          v-flex(xs12, sm3)
            v-select.px-2(label='Obra', :items='values.obras', v-model='obraSelected', item-text='nombre', item-value='id_obra', autocomplete, no-data-text="Ninguna Obra")
          v-flex(xs12, sm3)
            v-select.px-2(label='Actividad', :items='values.actividades', v-model='actividadSelected', item-text='nombre', item-value='id_actividad', autocomplete, no-data-text="Ninguna Actividad")
          v-flex(xs12, sm4)
            v-select.px-2(label='Tarea', :items='values.tareas', v-model='tareaSelected', item-text='nombre', autocomplete, no-data-text="Ninguna Tarea")
</template>

<script>
import httpLinea from '@/http/linea'
import httpObra from '@/http/obra'
import httpActividad from '@/http/actividad'
import httpTarea from '@/http/tarea'

export default {
  name: 'reporte',
  data  () {
    return {
      values: {
        lineas: [],
        obras: [],
        actividades: [],
        tareas: []
      },
      lineaSelected: null,
      obraSelected: null,
      actividadSelected: null,
      tareaSelected: null
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
    }
  },
  methods: {
    getLineasPorFase (fase) {
      httpLinea.getPorFase(fase).then(res => {
        this.values.lineas = res.data.data
      })
    },
    getObrasPorLinea (codigoLinea) {
      httpObra.obrasLinea(codigoLinea, { estadoSelected: '', tipodeObraSelected: '' }).then(res => {
        this.values.obras = res.data
      })
    },
    getActividadesPorObra (idObra) {
      httpActividad.actividadesObra(idObra).then(res => {
        this.values.actividades = res.data
      })
    },
    getTareasPorActividad (idActividad) {
      httpTarea.tareasActividad(idActividad).then(res => {
        this.values.tareas = res.data
      })
    }
  },
  created () {
    this.getLineasPorFase('fase2')
  }
}
</script>