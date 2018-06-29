<template lang="pug">
  v-card(color='grey lighten-4', flat)
    v-toolbar(color='primary')
      v-toolbar-side-icon
      v-toolbar-title.white--text Avance Lineas Fase 2
      v-spacer
      v-tooltip(top)
        a(href="http://ssp.miteleferico.bo/reportes/exportlineapdf/", target="_blank", slot='activator')
          v-btn(icon)
            v-icon(dark) print
        span Generar documento PDF
    v-container(fluid)
      v-layout(row, wrap)
        v-flex(xs12, sm12)
          v-data-table.elevation-1(:headers='headers', :items='items', hide-actions)
            template(slot='items', scope='props')
              td.text-xs-left {{ props.item.nombre }}
              td.text-xs-right {{ props.item.avance + '%' }}
</template>

<script>
import http from '@/http/linea.js'
export default {
  name: 'reportePorFase',
  data () {
    return {
      headers: [
        { text: 'Linea', align: 'left', sortable: false, value: 'nombre' },
        { text: 'Avance Total', align: 'center', sortable: false, value: 'avance' }
      ],
      items: []
    }
  },
  methods: {
    getLineasPorFase (fase) {
      http.getPorFase(fase).then(res => {
        this.items = res.data.data
      })
    }
  },
  created () {
    this.getLineasPorFase('fase2')
  }
}
</script>