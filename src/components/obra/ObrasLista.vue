<template>
  <v-card class="py-2 px-4">
    <div>
      <v-btn fab small right absolute 
        :class="getLayout.color + ' accent-4'" 
        @click="selectors.filter = !selectors.filter">
        <v-icon dark>filter_list</v-icon>
      </v-btn>
    </div>
    <v-btn style="margin-right:50px;" fab small right absolute 
      :class="getLayout.color + ' accent-4'" 
      @click="selectors.search = !selectors.search">
      <v-icon dark>search</v-icon>
    </v-btn>

    <v-btn style="margin-right:100px;" fab small right absolute 
      :class="getLayout.color + ' accent-4'" 
      @click="clearAndRefresh()">
      <v-icon dark>refresh</v-icon>
    </v-btn>

    <v-layout row justify-center>
      <v-flex xs4 v-show="selectors.search" class="pr-2">
        <v-text-field append-icon="search" label="Buscar..." single-line hide-details v-model="search"></v-text-field>
      </v-flex>
      <v-flex xs3 v-show="selectors.filter" class="pr-2">
        <v-select label="Tipo de Obra" v-model="tipodeObraSelected" :items="filterTipodeObra"></v-select>
      </v-flex>
      <v-flex xs2 v-show="selectors.filter">
        <v-select label="Estado" v-model="estadoSelected" :items="filterEstado"></v-select>
      </v-flex>
      <v-flex xs1 v-show="selectors.filter">
        <v-tooltip top>
          <v-btn flat icon slot="activator" @click="resetFilters">
            <v-icon color="red">highlight_off</v-icon>
          </v-btn>
          <span>Reiniciar Formulario</span>
        </v-tooltip>
      </v-flex>
    </v-layout>

    <loader v-show="loading"></loader>

    <v-data-table 
      v-show="!loading"
      v-bind:headers="headers" 
      v-bind:items="items" 
      :search="search" 
      v-bind:pagination.sync="pagination" 
      item-key="codigo" 
      class="elevation-1" 
      rows-per-page-text="items por pagina" 
      :rows-per-page-items="pag">
      <template slot="items" scope="props">
        <tr :active="props.selected">
          <td class="text-xs-left">{{ props.item.codigo }}</td>
          <td class="text-xs-center">{{ props.item.tipo_de_obra }}</td>
          <td class="text-xs-center">{{ props.item.nombre }}</td>
          <td class="text-xs-left">{{ props.item.estado }}</td>
          <td class="text-xs-center">{{ props.item.avance_total }}%</td>
          <td class="text-xs-right">{{ props.item.valor_proporcional }}%</td>
          <td>
            <v-layout>
              <v-flex xs12 sm8>
                <v-btn flat icon color="indigo" @click="showActividades(props.item)">
                  <v-icon v-html="props.expanded ? 'chevron_left' : 'chevron_right'"></v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import loader from '../shared/Loader.vue'
import { mapGetters } from 'vuex'
import http from '@/http/obra'
export default {
  name: 'obrasLista',
  components: { loader },
  props: {
    linea: { type: String, required: true }
  },
  data () {
    return {
      pagination: {
        sortBy: 'id_obra'
      },
      selectors: { filter: false, search: false },
      filterTipodeObra: ['Estación', 'Torre', 'Obras Complementarias'],
      filterEstado: ['en ejecución', 'concluido'],
      estadoSelected: '',
      tipodeObraSelected: '',
      search: '',
      loading: false,
      selected: [],
      items: [],
      headers: [
        { text: 'Codigo', align: 'left', value: 'codigo' },
        { text: 'Tipo de Obra', align: 'center', value: 'tipo_de_obra' },
        { text: 'Nombre', align: 'center', value: 'nombre' },
        { text: 'Estado', align: 'center', value: 'estado' },
        { text: 'Avance', align: 'center', value: 'avance_total' },
        { text: 'Valor', align: 'right', value: 'valor_proporcional' },
        { text: '', sortable: false, value: '' }
      ],
      pag: [10, 20, 50, { text: 'Todos', value: -1 }]
    }
  },
  methods: {
    showActividades (obra) {
      this.$store.dispatch('setObraSelected', obra)
      let valores = { obras: false, actividades: true, tareas: false, revisiones: true }
      this.$store.dispatch('setDisplay', valores)
    },
    resetFilters () {
      this.estadoSelected = ''
      this.tipodeObraSelected = ''
      this.returnFilters.estadoSelected = ''
      this.returnFilters.tipodeObraSelected = ''

      this.refreshObras(this.linea, this.returnFilters)
    },
    refreshObras (linea, filters) {
      this.loading = true
      http.obrasLinea(linea, filters).then(res => {
        this.items = res.data
        this.loading = false
      })
    },
    clearAndRefresh () {
      this.resetFilters()
      this.refreshObras(this.linea, this.returnFilters)
    }
  },
  computed: {
    ...mapGetters(['getLayout', 'getDisplayObras', 'getDisplay']),
    returnFilters () {
      let filteredArray = {
        estadoSelected: this.estadoSelected,
        tipodeObraSelected: this.tipodeObraSelected
      }
      return filteredArray
    },
    btnColors () {
      return 'darken-2'
    }
  },
  watch: {
    getDisplay (newVal, oldVal) {
      if (newVal.obras) {
        this.refreshObras(this.linea, this.returnFilters)
      }
    },
    getDisplayObras (newVal, oldVal) {
      if (newVal.listado) {
        this.refreshObras(this.linea, this.returnFilters)
      }
    },
    estadoSelected (newVal, oldVal) {
      this.returnFilters.estadoSelected = newVal
      this.refreshObras(this.linea, this.returnFilters)
    },
    tipodeObraSelected (newVal, oldVal) {
      if (newVal === 'Estación') { this.returnFilters.tipodeObraSelected = 'estacion' }
      if (newVal === 'Torre') { this.returnFilters.tipodeObraSelected = 'torre' }
      if (newVal === 'Obras Complementarias') { this.returnFilters.tipodeObraSelected = 'obra_complementaria' }
      this.refreshObras(this.linea, this.returnFilters)
    }
  },
  created () {
    this.refreshObras(this.linea, this.returnFilters)
  }
}
</script>