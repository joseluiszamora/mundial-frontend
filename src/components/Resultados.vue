<template lang="pug">
  v-container
    v-layout(row, justify-center)
      v-flex(xs5)
        v-card
          v-toolbar(color='primary', dark)
            v-toolbar-title.text-xs-center Partidos de Fase
            v-spacer
            v-tooltip(top)
              v-btn(icon, @click='refreshLive()', slot='activator')
                v-icon refresh
              span Actualizar
          loader(v-show='loading')
          v-layout(row, justify-center, style="overflow:auto;height:600px;")
            v-flex(xs12)
              v-card(color="blue-grey darken-1" class="white--text", v-for='item in itemsLive', v-bind:key='item.idMatch', @click="showApuestas")
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
                v-layout(row, justify-center, py-4)
                  v-flex(xs2)
                    v-btn(slot='activator', class='green', dark, large, @click="showApuestas(item)") Ver Apuestas
                //v-card(color="blue-grey lighten-4")
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

      v-flex(xs4, pl-5)
        v-card
          v-toolbar(color='primary', dark)
            v-toolbar-title.text-xs-center Apuestas
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
import ImageProfile from '@/components/shared/ImageProfile'
// import proyectoResumen from '@/components/proyecto/Resumen'
// import infoLinea from '@/components/proyecto/InformacionLinea'

export default {
  name: 'resultados',
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
    showApuestas (element) {
      this.refreshApuestas(element.idMatch)
    },
    puedoBorrar (apuesta) { // si se puede borrar o no
      console.log(apuesta.partidoId)
      var flag = false
      this.itemsLive.forEach(function (item) {
        console.log(item)
        if ((apuesta.partidoId.toString() === item.idMatch.toString()) && !(item.periodo in [0, 1, 2])) {
          flag = true
        }
      }, this)
      return flag
    },
    refreshApuestas (idPartido) {
      this.itemsApuesta = []
      this.loadingApuestas = true
      httpApuesta.getApuestas().then(res => {
        // console.log(res.data)
        res.data.forEach(function (element) {
          // console.log(element)
          if (element.partidoId.toString() === idPartido.toString() && element.baja_logica === 0) {
            // console.log(element)
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
      if (!(partido.periodo in [0, 1, 2])) { // si esta en un periodo valido
        this.itemsApuesta.forEach(function (elementApuesta) { // si existe en las apuestas
          // console.log(partido.idMatch + ' === ' + elementApuesta.partidoId)
          if (partido.idMatch.toString() === elementApuesta.partidoId.toString()) {
            flag = false
          }
        }, this)
      }
      return flag
    },
    refreshLive () {
      this.itemsLive = []
      this.loading = true
      httpFifa.getTodos().then(res => {
        console.log(res.data)
        res.data.Results.forEach(function (element) {
          if (element.IdCompetition === '17' && element.Away != null && element.Home != null) {
            console.log(element)
            var tmpMatch = {
              idMatch: element.IdMatch,
              estadio: element.Stadium.Name[0].Description + ' (' + element.Stadium.CityName[0].Description + ')',
              arbitro: 'codigo',
              tiempo: element.MatchTime,
              periodo: 0,
              puedeApostar: true,
              dialog: false,
              grupo: element.GroupName[0].Description + ' (' + element.StageName[0].Description + ')',
              awayTeam: {
                idTeam: element.Away.IdTeam,
                nombre: element.Away.TeamName[0].Description,
                codigo: element.Away.IdCountry.toLowerCase(),
                numGoles: element.AwayTeamScore,
                numGolesApuesta: 0,
                image: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.Away.IdCountry.toLowerCase()
              },
              homeTeam: {
                idTeam: element.Home.IdTeam,
                nombre: element.Home.TeamName[0].Description,
                codigo: element.Home.IdCountry.toLowerCase(),
                numGoles: element.Home.Score,
                numGolesApuesta: 0,
                image: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.Home.IdCountry.toLowerCase()
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
    // this.refreshApuestas()
    this.refreshLive()
  }
}
</script>
