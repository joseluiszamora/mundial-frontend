<template lang="pug">
  v-card(color='grey lighten-4', flat)
    v-toolbar(color='primary')
      v-toolbar-side-icon
      v-toolbar-title.white--text Avance por Obra
      v-spacer
      v-select(:items='lineas', v-model='lineaSelected', item-text='nombre', item-value='codigo_linea', autocomplete, no-data-text="Ninguna Linea", xs4, dark)
      v-spacer
      v-tooltip(top, v-if="lineaSelected")
        a(:href="'http://ssp.miteleferico.bo/reportes/reporteactividadespdf/' + lineaSelected", target="_blank", slot='activator')
          v-btn(icon)
            v-icon(dark) print
        span Reporte Por Actividad documento PDF
      v-tooltip(top, v-if="lineaSelected")
        a(:href="'http://ssp.miteleferico.bo/reportes/reporteobraspdf/' + lineaSelected", target="_blank", slot='activator')
          v-btn(icon)
            v-icon(dark) print
        span Reporte Por Obra documento PDF
    v-container(fluid)
      v-layout(row, wrap)
        v-flex(xs12, sm12)
          v-data-table.elevation-1(:headers='headers', :items='obras', hide-actions)
            template(slot='items', scope='props')
              td.text-xs-left {{ props.item.nombre }}
              td.text-xs-left {{ props.item.tipo_de_obra }}
              td.text-xs-right {{ props.item.avance_total + '%' }}
</template>

<script>
import http from '@/http/linea.js'
import httpObra from '@/http/obra'

export default {
  name: 'reportePorObra',
  data () {
    return {
      lineas: [],
      obras: [],
      lineaSelected: null,
      headers: [
        { text: 'Obra', align: 'left', sortable: true, value: 'nombre' },
        { text: 'Tipo de Obra', align: 'left', sortable: true, value: 'tipo_de_obra' },
        { text: 'Avance Total', align: 'center', sortable: true, value: 'avance_total' }
      ]
    }
  },
  methods: {
    getLineasPorFase (fase) {
      http.getPorFase(fase).then(res => {
        this.lineas = res.data.data
      })
    },
    getObrasPorLinea (codigoLinea) {
      httpObra.obrasLinea(codigoLinea, { estadoSelected: '', tipodeObraSelected: '' }).then(res => {
        this.obras = res.data
      })
    }
  },
  watch: {
    lineaSelected (newVal, oldVal) {
      this.getObrasPorLinea(newVal)
    }
  },
  created () {
    this.getLineasPorFase('fase2')
  }
}
</script>