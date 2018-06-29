<template lang="pug">
  div
    v-layout(row, justify-center)
      v-flex(xs7)
        v-card
          v-toolbar(color='primary', dark)
            v-toolbar-title.text-xs-center Ahora en Vivo
            v-spacer
            v-tooltip(top='')
              v-btn(icon='', @click='refreshLive()', slot='activator')
                v-icon refresh
              span Actualizar
          loader(v-show='loading')
          // v-layout(row, justify-center, my-3, v-if="itemsLive.length = 0")
            v-flex(xs12)
              .text-xs-center 
                .title Ningún partido en vivo
          v-list(subheader, v-for='item in itemsLive', v-bind:key='item.idMatch')
            v-layout(row, justify-center, mt-4)
              v-flex(xs5)
                .text-xs-center
                  .headline(style='float:right', color="red") (6)
                  img(:src="item.homeTeam.image", alt='trevor', style='float:right;width:60px;')
                  .subheading {{ item.homeTeam.nombre }}
              v-flex(xs2)
                .text-xs-center(style="margin-top:-5px;margin-x:5px;")
                  .display-1 {{ item.homeTeam.numGoles }} - {{ item.awayTeam.numGoles }}
              v-flex(xs5)
                .text-xs-center
                  .headline(style='float:left', color="red") (6)
                  img(:src="item.awayTeam.image", alt='trevor', style='float:left;width:60px;')
                  .subheading {{ item.awayTeam.nombre }}
            v-layout(row, justify-space-around, mt-2)
              v-flex(xs6)
                .text-xs-center
                  .subheading Estadio: {{ item.estadio }}
              v-flex(xs1)
                .text-xs-center
                  .subheading Tiempo: {{ item.tiempo }}
              v-flex(xs5)
                .text-xs-center
                  .subheading {{ item.grupo }}
            v-layout(row, justify-space-around, mt-2)
              v-flex(xs5, px-2)
                .body-2(v-for='gol in item.homeTeam.goles') Gol: {{ gol.Minute }}
              v-flex(xs5, px-2)
                .body-2(v-for='gol in item.awayTeam.goles') Gol: {{ gol.Minute }}
          v-divider
            //v-list-tile(avatar)
              v-tooltip(top)
                v-list-tile-avatar(slot='activator')
                  img(:src="'/static/45'")
                span Ver
              v-list-tile-content
                v-list-tile-title
                  | scsdc
              v-list-tile-action
                v-chip(color='light-green', text-color='white', v-html="fsfsdf")
            //v-list-tile(avatar='', v-for='item in items', v-bind:key='item.title', @click='showLinea(item.codigo_linea)')
              v-tooltip(top='')
                v-list-tile-avatar(slot='activator')
                  img(:src="'/static/' + item.imagen")
                span Ver {{ item.nombre }}
              v-list-tile-content
                v-list-tile-title(v-html='item.nombre')
              v-list-tile-action
                v-chip(color='light-green', text-color='white', v-html="item.avance + '%'")
</template>

<script>
import httpFifa from '@/http/fifa'
import loader from './shared/Loader.vue'
// import proyectoResumen from '@/components/proyecto/Resumen'
// import infoLinea from '@/components/proyecto/InformacionLinea'

export default {
  name: 'dashboard',
  components: { loader },
  data () {
    return {
      loading: false,
      flagView: true,
      itemsLive: [],
      animationInfinite: {
        classes: 'bounce',
        delay: 1000,
        duration: 1000,
        iteration: 'infinite'
      }
    }
  },
  methods: {
    refreshLive () {
      this.itemsLive = []
      this.loading = true
      httpFifa.getLive().then(res => {
        res.data.Results.forEach(function (element) {
          // console.log(res.data.Results)
          if (element.IdCompetition === '17') {
            console.log(element)
            var tmpMatch = {
              idMatch: element.IdMatch,
              estadio: element.Stadium.Name[0].Description + ' (' + element.Stadium.CityName[0].Description + ')',
              arbitro: 'codigo',
              tiempo: element.MatchTime,
              grupo: element.GroupName[0].Description + ' (' + element.StageName[0].Description + ')',
              awayTeam: {
                nombre: element.AwayTeam.TeamName[0].Description,
                codigo: element.AwayTeam.IdCountry.toLowerCase(),
                numGoles: element.AwayTeam.Score,
                image: 'https://api.fifa.com/api/v1/picture/flags-fwc2018-4/' + element.AwayTeam.IdCountry.toLowerCase(),
                goles: element.AwayTeam.Goals
              },
              homeTeam: {
                nombre: element.HomeTeam.TeamName[0].Description,
                codigo: element.HomeTeam.IdCountry.toLowerCase(),
                numGoles: element.HomeTeam.Score,
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
  created () {
    this.refreshLive()
  }
}
</script>
