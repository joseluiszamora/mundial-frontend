<template>
  <div>
    <v-layout column align-center>
      <v-flex xs10>
        <loader v-show="loading"></loader>
        <chart-avances v-show="!loading" v-if="items" :fase="fase" :graficoDataX="graficoDataX" :graficoDataY="graficoDataY" :graficoColors="graficoColors"></chart-avances>
      </v-flex>
    </v-layout>
    <v-layout row justify-space-between>
      <v-flex xs5>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title class="text-xs-center">Lineas Fase 2</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <v-btn icon @click="lineasPorFase()" slot="activator">
                <v-icon>refresh</v-icon>
              </v-btn>
              <span>Recargar</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn icon @click="actualizarAvancesTotales()" color="warning" text-color="white" slot="activator">
                <v-icon>refresh</v-icon>
              </v-btn>
              <span>Actualizar todos los datos de obras, actividades y tareas</span>
            </v-tooltip>
          </v-toolbar>
          <v-list subheader v-if="items">
            <v-list-tile avatar v-for="item in items" v-bind:key="item.title" @click="showLinea(item.codigo_linea)">
              <v-tooltip top>
                <v-list-tile-avatar slot="activator">
                  <img :src="'/static/' + item.imagen" />
                </v-list-tile-avatar>
                <span>Ver {{ item.nombre }}</span>
              </v-tooltip>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.nombre"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-chip color="light-green" text-color="white" v-html="item.avance + '%'">
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs5>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title class="text-xs-center">Ultimas Revisiones</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-tooltip top>
              <v-btn icon @click="lineasPorFase()" slot="activator">
                <v-icon>refresh</v-icon>
              </v-btn>
              <span>Recargar</span>
            </v-tooltip> -->
          </v-toolbar>
          <ultimas-revisiones></ultimas-revisiones>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import loader from '../shared/Loader.vue'
import chartAvances from '@/components/proyecto/chartAvances'
import charts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import ultimasRevisiones from '../revision/ListadoUltimas.vue'

import http from '@/http/linea.js'
import router from '@/router'
export default {
  name: 'resumen',
  components: { chartAvances, charts, loader, ultimasRevisiones },
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
      this.graficoDataX = []
      this.graficoDataY = []
      this.graficoColors = []
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
    actualizarAvancesTotales () {
      this.loading = true
      this.items = []
      this.graficoDataX = []
      this.graficoDataY = []
      this.graficoColors = []
      http.actualizarAvanceTotalPorFase(this.fase).then(res => {
        this.items = res.data.data
        this.makeChartData(res.data.data)
        this.loading = false
      }, (error) => {
        console.log(error)
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
