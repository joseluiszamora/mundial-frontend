<template lang="pug">
  div
    v-toolbar(floating, dense, style="z-index: 2; margin-top: 50px;")
      v-avatar(style="margin: 1px 2px 0px -18px; width: 65px; height: 65px;")
        img(src="/static/logo2.jpg")
      v-btn(icon)
        v-icon my_location
      v-btn(icon, @click.native="showSearch = !showSearch")
        v-icon search
      v-text-field(hide-details, single-line, v-if="showSearch")
      v-btn(icon, @click.native='showMenu = !showMenu')
        v-icon {{ showMenu ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
      v-slide-y-transition
        div(v-if="showMenu", style="width: 600px;margin-top:15px;")
          v-select(:items='lineas', v-model='linea', label='Linea', no-data-text="Niguna Linea", item-text="nombre", item-value="codigo_linea", autocomplete, style="width: 200px;float:left;")
          v-select(:items='tiposDeObra', v-model='tipoDeObra', label='Tipo de Obra', autocomplete, style="width: 200px;float:left;")
          v-select(:items='avances', v-model='avance', label='Avance %', autocomplete, style="width: 200px;float:left;")

    v-dialog(v-model='dialog', max-width='600')
      v-card
        v-toolbar(color='primary', dark)
          v-avatar
            img(src='/static/logo2.jpg', alt='John')
          v-toolbar-title Estacion XXX
          v-spacer
          v-toolbar-title Avance: 20%
        v-card-text Estacion en lugar X
        v-expansion-panel
          v-expansion-panel-content(v-for='(item,i) in 5', :key='i', expand-icon='mdi-menu-down')
            div(slot='header') Item (20%)
            v-card
              v-card-text.grey.lighten-3
                | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

        v-card-actions
          v-spacer
          v-btn(color='green darken-1', flat='', @click.native='dialog = false') Ok

    loader(message="Cargando Obras ...", v-if="loading")
    gmap-map(:center='getCenter()', :zoom='zoom', map-type-id='terrain', style='width: 102%; height: 100%; min-height: 920px; margin-top:-130px; margin-left: -17px;', v-else)
      gmap-info-window(:options='infoOptions', :position='infoWindowPos', :opened='infoWinOpen', @closeclick='infoWinOpen=false') {{ infoContent }}
      gmap-marker(:key='index', v-for='(m, index) in getMarkers()', :position='m.position', :clickable='true', :draggable='false', :icon='getIcon(m, index)', @click='clickMarker(m, index)', @mouseover='toggleInfoWindow(m, index)')
</template>

<script>
import http from '@/http/linea.js'
import httpReporte from '@/http/reporte.js'
import loader from '../shared/LoaderMessage.vue'
export default {
  name: 'mapa',
  components: { loader },
  data () {
    return {
      fase: 'fase2',
      lineas: [],
      linea: null,
      tiposDeObra: ['estaciones', 'torres', 'complementarias'],
      tipoDeObra: null,
      avances: ['0 - 20', '20 - 40', '40 - 60', '60-80', '80-100'],
      obras: [],
      loading: false,
      dialog: false,
      avance: null,
      showSearch: false,
      showMenu: false,
      latitud: -16.505484,
      longitud: -68.129256,
      zoom: 14,
      markers: [],
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      infoContent: 'ttttttttttttttt',
      a1: null,
      states: [
        'Alabama', 'Alaska', 'American Samoa', 'Arizona',
        'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ]
    }
  },
  methods: {
    getLineasPorFase () {
      http.getPorFase(this.fase).then(res => {
        // console.log(res.data.data)
        res.data.data.forEach(function (element) {
          // element.show = false
          // element.edit = false
          this.lineas.push(element)
        }, this)
      })
    },
    getObras () {
      httpReporte.obrasgeo().then(res => {
        this.obras = res.data
        this.markers = []
        res.data.return.forEach(function (element) {
          let temp = {
            position: { lat: +element.latitud, lng: +element.longitud },
            infoText: element.nombre,
            linea: element.codigo_linea,
            tipo: element.tipo_de_obra
          }
          this.markers.push(temp)
        }, this)
      })
    },
    reload () {
      this.loading = true
      this.getLineasPorFase(this.fase)
      this.getObras()
      this.loading = false
    },
    getCenter () {
      return { lat: this.latitud, lng: this.longitud }
    },
    getIcon (m, index) {
      let icon = m.tipo === 'torre' ? '/static/mapa/torre_' + m.linea + '.png' : '/static/mapa/estacion_' + m.linea + '.png'
      return icon
    },
    getMarkers () {
      return this.markers
    },
    clickMarker (m, index) {
      console.log('0000000000000000000')
      this.dialog = true
    },
    toggleInfoWindow (marker, idx) {
      this.infoWindowPos = marker.position
      // this.infoContent = marker.infoText
      this.infoContent = marker.infoText
      this.content = marker.infoText
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    }
  },
  created () {
    this.reload()
  }
}
</script>