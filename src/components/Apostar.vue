<template lang="pug">
  div
    v-layout(row, justify-space-around)
      v-flex(xs7)
        v-card
          v-toolbar(color='primary', dark)
            v-toolbar-title.text-xs-center Partidos de Hoy
            v-spacer
            v-tooltip(top)
              v-btn(icon, @click='refreshLive()', slot='activator')
                v-icon refresh
              span Actualizar
          loader(v-show='loading')
          v-list(subheader, v-for='item in itemsLive', v-bind:key='item.idMatch')
            v-card(color="blue-grey darken-2" class="white--text")
              v-layout(row, justify-center, py-4)
                v-flex(xs5)
                  .text-xs-center
                    img(:src="item.homeTeam.image", alt='trevor', style='float:right;width:60px;')
                    .subheading {{ item.homeTeam.nombre }}
                v-flex(xs2)
                  .text-xs-center(style="margin-top:-5px;margin-x:5px;")
                    .display-1 {{ item.homeTeam.numGoles }} - {{ item.awayTeam.numGoles }}
                v-flex(xs5)
                  .text-xs-center
                    img(:src="item.awayTeam.image", alt='trevor', style='float:left;width:60px;')
                    .subheading {{ item.awayTeam.nombre }}
              v-layout(row, justify-center, mt-2)
                  v-dialog(v-model='item.dialog', persistent='', max-width='500px')
                    v-btn(slot='activator', class='green', dark, large, v-if="puedeApostar(item)") Apostar
                    v-card
                      v-card-title
                        span.headline {{ item.homeTeam.nombre }} - {{ item.awayTeam.nombre }}
                      v-card-text
                        v-container(grid-list-md)
                          v-layout(row, justify-space-around)
                            v-flex(xs3)
                              v-select(:items="[0,1,2,3,4,5,6,7,8,9,'+10']", label='Goles', v-model="item.homeTeam.numGolesApuesta")
                            v-flex(xs4, mt-3)
                              img(:src="item.homeTeam.image", alt='trevor', style='float:left;width:60px;')
                              img(:src="item.awayTeam.image", alt='trevor', style='float:right;width:60px;')
                            v-flex(xs3)
                              v-select(:items="[0,1,2,3,4,5,6,7,8,9,'+10']", label='Goles', v-model="item.awayTeam.numGolesApuesta")
                      v-card-actions
                        v-spacer
                        v-btn(color='blue darken-1', flat='', @click.native='item.dialog = false') Cancelar
                        v-btn(color='blue darken-1', flat='', @click='saveApuesta(item)') Guardar

            v-card(color="blue-grey lighten-1" class="white--text")
              v-layout(row, justify-space-around, py-2)
                v-flex(xs5, px-2)
                  .body-2(v-for='gol in item.homeTeam.goles') Gol: {{ gol.Minute }}
                v-flex(xs5, px-2)
                  .body-2(v-for='gol in item.awayTeam.goles') Gol: {{ gol.Minute }}
            v-card(color="blue-grey lighten-4")
              v-layout(row, justify-space-around, py-3)
                v-flex(xs12)
                  .text-xs-center
                    .subheading Estadio: {{ item.estadio }}
                v-flex(xs12)
                  .text-xs-center
                    .subheading Tiempo: {{ item.tiempo }}
                    .subheading {{ showEstado(item.periodo) }}
                v-flex(xs12)
                  .text-xs-center
                    .subheading {{ item.grupo }}
            v-divider

      v-flex(xs3)
        v-card
          v-toolbar(color='primary', dark)
            v-toolbar-title.text-xs-center Mis Apuestas
            v-spacer
            v-tooltip(top='')
              v-btn(@click="refreshApuestas()", icon='', slot='activator')
                v-icon refresh
              span Actualizar
          loader(v-show='loadingApuestas')
          v-list(subheader, v-for='item in itemsApuesta', v-bind:key='item.id', v-show='!loadingApuestas')
            v-layout(row, justify-center, mt-4)
              v-flex(xs1)
                v-tooltip(top)
                  image-profile(:documento="item.docJugador || 'null'", :width="40", slot='activator')
                  span {{ item.jugador }}
              v-flex(xs2)
                .text-xs-center
                  v-tooltip(top)
                    img(:src="item.localImage", :alt='item.localCodigo', style='float:right;width:60px;', slot="activator")
                    span {{ item.localCodigo }}
              v-flex(xs3)
                .text-xs-center(style="margin-top:-5px;margin-x:5px;")
                  .display-1 {{ item.localGoles }} - {{ item.visitaGoles }}
              v-flex(xs2)
                .text-xs-center
                  v-tooltip(top)
                    img(:src="item.visitaImage", :alt='item.visitaCodigo', style='float:left;width:60px;', slot="activator")
                    span {{ item.visitaCodigo }}
              v-flex(xs2, v-if="puedoBorrar(item)")
                v-tooltip(top)
                  v-btn(@click="deleteApuesta(item)", icon='', slot='activator')
                    v-icon clear
                  span Eliminar esta apuesta
</template>

<script>
import httpFifa from '@/http/fifa'
import httpApuesta from '@/http/apuesta'
import loader from './shared/Loader.vue'
import { mapGetters } from 'vuex'
import store from '../store'
import ImageProfile from '@/components/shared/ImageProfile'
// import proyectoResumen from '@/components/proyecto/Resumen'
// import infoLinea from '@/components/proyecto/InformacionLinea'

export default {
  name: 'apostar',
  components: { loader, ImageProfile },
  data () {
    return {
      loading: false,
      loadingApuestas: false,
      flagView: true,
      itemsLive: [],
      itemsApuesta: [],
      animationInfinite: {
        classes: 'bounce',
        delay: 1000,
        duration: 1000,
        iteration: 'infinite'
      }
    }
  },
  methods: {
    puedoBorrar (apuesta) { // si se puede borrar o no
      console.log(apuesta.partidoId)
      var flag = false
      this.itemsLive.forEach(function (item) {
        console.log(item)
        if ((apuesta.partidoId.toString() === item.idMatch.toString()) && (item.periodo in [0, 1, 2])) {
          flag = true
        }
      }, this)
      return flag
    },
    saveApuesta (partido) {
      // console.log(partido)
      // console.log(partido.homeTeam.numGolesApuesta + ' - ' + partido.awayTeam.numGolesApuesta)
      partido.dialog = false
      const apuesta = `jugador=${store.getters.getSession.username}&docJugador=${store.getters.getSession.ci}&partidoId=${partido.idMatch}&equipoLocalId=${partido.homeTeam.idTeam}&equipoLocalCodigo=${partido.homeTeam.codigo}&equipoLocalGoles=${partido.homeTeam.numGolesApuesta}&equipoVisitaId=${partido.awayTeam.idTeam}&equipoVisitaCodigo=${partido.awayTeam.codigo}&equipoVisitaGoles=${partido.awayTeam.numGolesApuesta}`
      console.log(apuesta)
      httpApuesta.saveApuesta(apuesta).then(res => {
        this.$snotify.success('Se creo la apuesta de manera correcta.', '')
        this.refreshLive()
        this.refreshApuestas()
      }, (error) => {
        this.showError = true
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
    this.refreshApuestas()
    this.refreshLive()
  }
}
</script>
