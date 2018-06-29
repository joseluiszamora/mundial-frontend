<template>
  <div style="min-width: 300px;min-height: 300px;">
    <loader v-show="loading"></loader>
    <charts v-show="!loading" :options="option"></charts>
  </div>
</template>

<script>
import loader from '../shared/Loader.vue'
import charts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

export default {
  name: 'avances',
  components: { charts, loader },
  props: {
    fase: { type: String, required: true },
    graficoDataX: { type: Array, required: true },
    graficoDataY: { type: Array, required: true },
    graficoColors: { type: Array, required: true }
  },
  data () {
    let datax = this.graficoDataX
    let datay = this.graficoDataY
    let colors = this.graficoColors
    return {
      loading: true,
      items: [],
      listaColores: [],
      listaNombres: [],
      listaValores: [],
      option: {
        title: {
          x: 'center',
          text: 'ECharts例子个数统计',
          subtext: 'Rainbow bar example',
          link: 'http://echarts.baidu.com/doc/example.html'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['Sales']
        },
        xAxis: {
          data: datax,
          type: 'category',
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [{
          name: 'Avance',
          type: 'bar',
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = colors
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{b}\n{c}%'
              }
            }
          },
          data: datay
        }],
        animationDuration: 4000
      }
    }
  },
  methods: {
  },
  computed: {
  },
  created () {
    let main = this
    setTimeout(function () {
      main.loading = false
    }, 100)
  }
}
</script>

<style scoped>

</style>
