<template lang="pug">
  div
    v-layout(row, justify-space-around)
      v-flex(xs12)
        v-card
          v-toolbar(color='primary', dark)
            v-toolbar-title.text-xs-center Apuestas
            v-spacer
            v-text-field(append-icon='search', label='Buscar...', single-line, hide-details, v-model='search')
            v-tooltip(top)
              v-btn(icon, @click='refreshLive()', slot='activator')
                v-icon refresh
              span Actualizar
            v-tooltip(top)
              v-btn(icon, @click='refreshAllMatches()', slot='activator', color="primary")
                v-icon refresh
              span Actualizar Todo
          loader(v-show='loading')
          template
          v-data-table(item-key='id_revision', v-show='!loading', :headers='headers', :items='itemsApuesta', :search='search', :pagination.sync='pagination', :rows-per-page-items='pag', no-data-text='Ninguna revisión', rows-per-page-text='revisiones por pagina')
            template(slot='items', scope='props')
              tr
                td.text-xs-center {{ props.item.partidoId }}
                td.text-xs-center
                  v-tooltip(top)
                    image-profile(:documento="props.item.docJugador || 'null'", :width="40", slot='activator')
                    span {{ props.item.jugador }}
                  | {{ props.item.jugador }}
                td.text-xs-center {{ props.item.equipoLocalCodigo }}
                td.text-xs-center {{ props.item.equipoVisitaCodigo }}
                td.text-xs-center {{ props.item.equipoLocalGoles }}
                td.text-xs-center {{ props.item.equipoVisitaGoles }}
                td.text-xs-center {{ props.item.equipoLocalGolesReales }}
                td.text-xs-center {{ props.item.equipoVisitaGolesReales }}
                td.text-xs-center {{ props.item.puntos }}
</template>

<script>
import httpFifa from '@/http/fifa'
import httpApuesta from '@/http/apuesta'
import loader from './shared/Loader.vue'
import { mapGetters } from 'vuex'
import store from '../store'
import ImageProfile from '@/components/shared/ImageProfile'

export default {
  name: 'ranking',
  components: { loader, ImageProfile },
  data () {
    return {
      loading: false,
      loadingApuestas: false,
      flagView: true,
      itemsApuesta: [],
      search: '',
      animationInfinite: {
        classes: 'bounce',
        delay: 1000,
        duration: 1000,
        iteration: 'infinite'
      },
      pagination: { sortBy: 'fecha_revision', 'descending': true },
      headers: [
        { text: 'Partido', value: 'partidoId' },
        { text: 'jugador', value: 'jugador' },
        { text: 'Local', value: 'equipoLocalCodigo' },
        { text: 'Visita', value: 'equipoVisitaCodigo' },
        { text: 'Apuesta Local', value: 'equipoLocalGoles' },
        { text: 'Apuesta Visita', value: 'equipoVisitaGoles' },
        { text: 'Goles Local', value: 'equipoLocalGolesReales' },
        { text: 'Goles Visita', value: 'equipoVisitaGolesReales' },
        { text: 'Puntos Ganados', value: 'puntos' }
      ],
      items: [],
      pag: [10, 50, 100, { text: 'Todos', value: -1 }]
    }
  },
  methods: {
    refreshAllMatches () {
      console.log('ok')
    },
    getApuestas () {
      this.itemsApuesta = []
      httpApuesta.getApuestas().then(res => {
        this.itemsApuesta = res.data
      }, (error) => {
        console.log(error)
      })
    },
    showEstado (estado) {
      switch (estado.toString()) {
        case '0':
          return 'Período de evento desconocido.'
        case '1':
          return 'Período de evento programado'
        case '2':
          return 'Previo al partido'
        case '3':
          return 'Primer Tiempo'
        case '4':
          return 'Medio Tiempo'
        case '5':
          return 'Segundo Tiempo'
        case '6':
          return 'Tiempo extra'
        case '7':
          return 'Periodo extra de la primera mitad del evento'
        case '8':
          return 'Periodo extra de medio tiempo'
        case '9':
          return 'Tiempo adicional'
        case '10':
          return 'Tiempo completo'
        case '11':
          return 'Penales'
        case '12':
          return 'Partido Finalizado'
        default:
          return ''
      }
    },
    deleteApuesta (apuesta) {
      console.log(apuesta)
      this.loadingApuestas = true
      const apuestaObj = `id=${apuesta.id}&baja_logica=${1}`
      httpApuesta.editApuesta(apuestaObj).then(res => {
        this.refreshApuestas()
        this.refreshLive()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    refreshApuestas () {
      this.itemsApuesta = []
      this.loadingApuestas = true
      httpApuesta.getApuestas().then(res => {
        console.log(res.data)
        res.data.forEach(function (element) {
          if (element.jugador === store.getters.getSession.username && element.baja_logica === 0) {
            console.log(element)
            var tmpMatch = {
              id: element.id,
              partidoId: element.partidoId,
              jugador: element.jugador,
              docJugador: element.docJugador,
              localCodigo: element.equipoLocalCodigo.toUpperCase(),
              localGoles: element.equipoLocalGoles,
              localImage: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.equipoLocalCodigo,
              visitaCodigo: element.equipoVisitaCodigo.toUpperCase(),
              visitaGoles: element.equipoVisitaGoles,
              visitaImage: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.equipoVisitaCodigo
            }
            this.itemsApuesta.push(tmpMatch)
          }
        }, this)
        // this.grupos = res.data
        this.loadingApuestas = false
      })
    },
    puedeApostar (partido) {
      // console.log(partido)
      var flag = true
      if ((partido.periodo in [0, 1, 2])) { // si esta en un periodo valido
        this.itemsApuesta.forEach(function (elementApuesta) { // si existe en las apuestas
          // console.log(partido.idMatch + ' === ' + elementApuesta.partidoId)
          if (partido.idMatch.toString() === elementApuesta.partidoId.toString()) {
            flag = false
          }
        }, this)
      } else {
        flag = false
      }
      return flag
    },
    refreshLive () {
      this.itemsLive = []
      this.loading = true
      httpFifa.getProximos().then(res => {
        res.data.Results.forEach(function (element) {
          // console.log(res.data.Results)
          if (element.IdCompetition === '17') {
            var tmpMatch = {
              idMatch: element.IdMatch,
              estadio: element.Stadium.Name[0].Description + ' (' + element.Stadium.CityName[0].Description + ')',
              arbitro: 'codigo',
              tiempo: element.MatchTime,
              periodo: element.Period,
              puedeApostar: true,
              dialog: false,
              grupo: element.GroupName[0].Description + ' (' + element.StageName[0].Description + ')',
              awayTeam: {
                idTeam: element.AwayTeam.IdTeam,
                nombre: element.AwayTeam.TeamName[0].Description,
                codigo: element.AwayTeam.IdCountry.toLowerCase(),
                numGoles: element.AwayTeam.Score,
                numGolesApuesta: 0,
                image: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.AwayTeam.IdCountry.toLowerCase(),
                goles: element.AwayTeam.Goals
              },
              homeTeam: {
                idTeam: element.HomeTeam.IdTeam,
                nombre: element.HomeTeam.TeamName[0].Description,
                codigo: element.HomeTeam.IdCountry.toLowerCase(),
                numGoles: element.HomeTeam.Score,
                numGolesApuesta: 0,
                image: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.HomeTeam.IdCountry.toLowerCase(),
                goles: element.HomeTeam.Goals
              }
            }
            this.itemsLive.push(tmpMatch)
          }
        }, this)
        // this.grupos = res.data
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  created () {
    this.getApuestas()
    // this.refreshLive()
  }
}
</script>
