<template>
  <v-card class="py-2 px-4">
    <div>
      <v-btn fab small :class="getLayout.color + ' accent-4'" right absolute @click="selectors.search = !selectors.search">
        <v-icon dark>search</v-icon>
      </v-btn>
      <v-btn style="margin-right:50px;" fab small right absolute 
        :class="getLayout.color + ' accent-4'" 
        @click="refreshActividades()">
        <v-icon dark>refresh</v-icon>
      </v-btn>
    </div>
    
    <v-layout row justify-center>
      <v-flex xs4 v-show="selectors.search" class="pr-2">
        <v-text-field append-icon="search" label="Buscar..." single-line hide-details v-model="search"></v-text-field>
      </v-flex>
    </v-layout>

    <loader v-show="loading"></loader>

    <v-data-table v-show="!loading" v-bind:headers="headers" v-bind:items="items" :search="search" v-bind:pagination.sync="pagination" item-key="codigo" class="elevation-1" rows-per-page-text="items por pagina" :rows-per-page-items="pag">
      <template slot="items" scope="props">
        <tr :active="props.selected">
          <td class="text-xs-left">{{ props.item.id_actividad }}</td>
          <td class="text-xs-left">{{ props.item.nombre }}</td>
          <td class="text-xs-center">{{ props.item.avance }}</td>
          <td class="text-xs-center">{{ props.item.valor_proporcional }}</td>
          <td>
            <v-layout>
              <v-flex xs12 sm3>
                <v-btn flat icon color="indigo" @click="showActividadInfo(props.item)">
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
import { mapGetters } from 'vuex'
import loader from '../shared/Loader.vue'
import http from '@/http/actividad'
export default {
  name: 'ActividadesLista',
  components: { loader },
  props: {
    obra: { type: Object, required: true }
  },
  data () {
    return {
      pagination: {
        sortBy: 'id_actividad'
      },
      selectors: { search: false },
      search: '',
      selected: [],
      items: [],
      headers: [
        { text: 'Codigo', align: 'left', value: 'id_actividad' },
        { text: 'Nombre', align: 'left', value: 'nombre' },
        { text: 'Avance Total', align: 'center', value: 'avance' },
        { text: 'Valor Proporcional', align: 'center', value: 'valor_proporcional' },
        { text: '', sortable: false, value: '' }
      ],
      pag: [10, 20, 50, { text: 'Todos', value: -1 }]
    }
  },
  methods: {
    showActividadInfo (actividad) {
      this.$store.dispatch('setActividadSelected', actividad)
      let valores = { obras: false, actividades: true, tareas: true, revisiones: false }
      this.$store.dispatch('setDisplay', valores)
    },
    refreshActividades () {
      this.loading = true
      http.actividadesObra(this.obra.id_obra).then(res => {
        this.items = res.data
        this.loading = false
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    }
  },
  watch: {
    getDisplay (newVal, oldVal) {
      if (newVal.obras) {
        this.refreshActividades()
      }
    },
    getDisplayActividades (newVal, oldVal) {
      if (newVal.listado) {
        this.refreshActividades()
      }
    }
  },
  computed: {
    ...mapGetters(['getLayout', 'getDisplayActividades', 'getDisplay', 'getActividadSelected'])
  },
  created () {
    this.refreshActividades()
  }
}
</script>