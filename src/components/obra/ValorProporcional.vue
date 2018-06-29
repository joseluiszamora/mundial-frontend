<template>
  <v-card class="py-2 px-4">
    <v-toolbar>
      <v-spacer></v-spacer>
      <porcentaje :valor="valorTotal"></porcentaje>
      <v-tooltip top>
        <v-btn icon  slot="activator" v-show="valorTotal===100" class="primary" color="green" @click="save">
          <v-icon dark>save</v-icon>
        </v-btn>
        <span>Guardar los valores proporcionales</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn icon  slot="activator" class="primary" color="red" @click="close">
          <v-icon dark>close</v-icon>
        </v-btn>
        <span>Cancelar</span>
      </v-tooltip>
    </v-toolbar>
    <v-container style="min-height: 300px;max-height: 450px" class="scroll-y">
    <!-- <v-container> -->
      <loader v-show="loading"></loader>
      <v-layout row wrap v-show="!loading" v-if="tipo == 'obra'">
        <!-- Estaciones -->
        <v-flex class="md4">
          <v-card>
            <v-list subheader>
              <v-subheader>Estaciones</v-subheader>
              <v-list-tile avatar v-for="item in itemsEstaciones" v-bind:key="item.title">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.nombre"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <div style="width:50px;">
                    <input class="numberfield" type="number" min="0" max="100" v-model="item.valor_proporcional">
                  </div>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
        <!-- Torres -->
        <v-flex class="md4 px-2">
          <v-card>
            <v-list subheader>
              <v-subheader>Torres</v-subheader>
              <v-list-tile avatar v-for="item in itemsTorres" v-bind:key="item.title">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.nombre"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <div style="width:50px;">
                    <input class="numberfield" type="number" min="0" max="100" v-model="item.valor_proporcional">
                  </div>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
        <!-- Obras Complementarias -->
        <v-flex class="md4">
          <v-card>
            <v-list subheader>
              <v-subheader>Obras Complementarias</v-subheader>
              <v-list-tile avatar v-for="item in itemsObrasc" v-bind:key="item.title">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.nombre"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <div style="width:50px;">
                    <input class="numberfield" type="number" min="0" max="100" v-model="item.valor_proporcional">
                  </div>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row justify-center v-show="!loading" v-if="tipo == 'actividad'">
        <v-flex class="md8">
          <v-card>
            <v-list subheader>
              <v-subheader>Actividades</v-subheader>
              <v-list-tile avatar v-for="item in itemsActividades" v-bind:key="item.nombre">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.nombre"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <div style="width:50px;">
                    <input class="numberfield" type="number" min="0" max="100" v-model="item.valor_proporcional">
                  </div>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>
  </v-card>
</template>

<script>
import httpObra from '@/http/obra'
import httpActividad from '@/http/actividad'
import Porcentaje from '../shared/Porcentaje.vue'
import Loader from '../shared/Loader.vue'

export default {
  name: 'valorProporcional',
  components: { Porcentaje, Loader },
  props: {
    tipo: { type: String, required: true },
    codigoLinea: { type: String, required: false },
    obra: { type: Object, required: false }
  },
  data () {
    return {
      contadorGeneral: 50,
      loading: false,
      items: [],
      itemsEstaciones: [],
      itemsTorres: [],
      itemsObrasc: [],
      itemsActividades: []
    }
  },
  methods: {
    refreshObra () {
      httpObra.getValorProporcionalObra(this.codigoLinea).then(res => {
        res.data.forEach(function (element) {
          if (element.tipo_de_obra === 'estacion') {
            this.itemsEstaciones.push(element)
          }
          if (element.tipo_de_obra === 'torre') {
            this.itemsTorres.push(element)
          }
          if (element.tipo_de_obra === 'obra_complementaria') {
            this.itemsObrasc.push(element)
          }
        }, this)
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    refreshActividad () {
      httpActividad.getValorProporcionalActividad(this.obra.id_obra).then(res => {
        this.itemsActividades = res.data
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    save () {
      this.loading = true
      let valorActividades = ''
      if (this.tipo === 'obra') {
        this.itemsEstaciones.forEach(function (element) {
          valorActividades += element.id_obra + '-' + element.valor_proporcional + '*'
        }, this)
        this.itemsTorres.forEach(function (element) {
          valorActividades += element.id_obra + '-' + element.valor_proporcional + '*'
        }, this)
        this.itemsObrasc.forEach(function (element) {
          valorActividades += element.id_obra + '-' + element.valor_proporcional + '*'
        }, this)

        httpObra.saveValorProporcionalObra(valorActividades).then(res => {
          console.log(res.data)
          this.loading = false
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      }
      if (this.tipo === 'actividad') {
        this.itemsActividades.forEach(function (element) {
          valorActividades += element.id_actividad + '-' + element.valor_proporcional + '*'
        }, this)
        httpActividad.saveValorProporcionalActividad(valorActividades).then(res => {
          console.log(res.data)
          this.loading = false
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      }
    },
    close () {
      let valores = { listado: true, form: false, valorProporcional: false }
      if (this.tipo === 'obra') { this.$store.dispatch('setDisplayObras', valores) }
      if (this.tipo === 'actividad') { this.$store.dispatch('setDisplayActividades', valores) }
    }
  },
  computed: {
    valorTotal () {
      let total = 0

      if (this.tipo === 'obra') {
        this.itemsEstaciones.forEach(function (element) {
          total += parseInt(element.valor_proporcional)
        }, this)
        this.itemsTorres.forEach(function (element) {
          total += parseInt(element.valor_proporcional)
        }, this)
        this.itemsObrasc.forEach(function (element) {
          total += parseInt(element.valor_proporcional)
        }, this)
      }
      if (this.tipo === 'actividad') {
        this.itemsActividades.forEach(function (element) {
          total += parseInt(element.valor_proporcional)
        }, this)
      }
      return total
    }
  },
  created () {
    if (this.tipo === 'obra') {
      this.refreshObra()
    } else {
      if (this.tipo === 'actividad') {
        this.refreshActividad()
      }
    }
  }
}
</script>
<style scoped>
  .input-group {
    padding: 0 !important;
  }
  .input-group input {
    text-align: center !important;
  }
  .numberfield {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
</style>
