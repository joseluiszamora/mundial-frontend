<template>
  <div>
    <v-layout column align-center>
      <v-flex xs10>
        <loader v-show="loading"></loader>
        <chart-linea v-show="!loading" v-if="items" :fase="fase" :graficoDataX="graficoDataX" :graficoDataY="graficoDataY" :graficoColors="graficoColors"></chart-linea>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import loader from '../shared/Loader.vue'
import chartLinea from '@/components/reporte/ChartLinea'
import charts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

import http from '@/http/linea.js'
import router from '@/router'
export default {
  name: 'chartAvance',
  components: { chartLinea, charts, loader },
  data () {
    return {
      fase: 'fase2',
      loading: false,
      loadingChart: false,
      items: [],
      graficoDataX: [],
      graficoDataY: [],
      graficoColors: []
    }
  },
  methods: {
    lineasPorFase () {
      this.loading = true
      this.items = []
      http.getPorFase(this.fase).then(res => {
        this.items = res.data.data
        this.makeChartData(res.data.data)
        this.loading = false
      }, (error) => {
        console.log(error)
        // this.lineasPorFase()
        /* let errorResponse = http.showError(error.response.data)
        this.$snotify.warning(errorResponse.subtitle, errorResponse.title) */
      })
    },
    makeChartData (datares) {
      datares.forEach(function (element) {
        this.graficoDataX.push(element.nombre)
        this.graficoDataY.push(element.avance)
        this.graficoColors.push(element.estilo)
      }, this)
    },
    showLinea (codigoLinea) {
      router.push('/linea/' + codigoLinea)
    }
  },
  created () {
    this.lineasPorFase()
  }
}
</script>

<style scoped>
</style>
