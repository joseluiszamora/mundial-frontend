<template>
  <v-card class="py-2 px-4">
    {{ tarea.nombre }}
    <div>
      <v-btn fab small :class="getLayout.color + ' accent-4'" right absolute @click="selectors.search = !selectors.search">
        <v-icon dark>search</v-icon>
      </v-btn>
    </div>

    <v-layout row justify-center>
      <v-flex xs4 v-show="selectors.search" class="pr-2">
        <v-text-field append-icon="search" label="Buscar..." single-line hide-details v-model="search"></v-text-field>
      </v-flex>
    </v-layout>

    <v-data-table v-bind:headers="headers" v-bind:items="items" :search="search" v-bind:pagination.sync="pagination" item-key="codigo" class="elevation-1" rows-per-page-text="items por pagina" :rows-per-page-items="pag">
      <template slot="items" scope="props">
        <tr :active="props.selected">
          <td class="text-xs-left">{{ props.item.id_tarea }}</td>
          <td class="text-xs-left">{{ props.item.nombre }}</td>
          <td class="text-xs-center">{{ props.item.descripcion }}</td>
          <td class="text-xs-center">{{ props.item.estado }}</td>
          <td>
            <v-layout>
              <v-flex xs12 sm3>
                <v-btn flat icon color="indigo" @click="showTareaInfo(props.item)">
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
import http from '@/http/revision'
export default {
  name: 'TareasLista',
  props: {
    tarea: { type: Object, required: true }
  },
  data () {
    return {
      pagination: {
        sortBy: 'id_tarea'
      },
      selectors: { search: false },
      search: '',
      selected: [],
      items: [],
      headers: [
        { text: 'Codigo', align: 'left', value: 'id_actividad' },
        { text: 'Nombre', align: 'left', value: 'nombre' },
        { text: 'Descripción', align: 'center', value: 'descripcion' },
        { text: 'Estado', align: 'center', value: 'estado' },
        { text: '', sortable: false, value: '' }
      ],
      pag: [10, 20, 50, { text: 'Todos', value: -1 }]
    }
  },
  methods: {
    showTareaInfo (tarea) {
      this.$store.dispatch('setTareaSelected', tarea)
      let valores = { obras: false, actividades: true, tareas: true, revisiones: true }
      this.$store.dispatch('setDisplay', valores)
    },
    refreshRevisiones () {
      http.revisionesTarea(this.tarea.id_tarea).then(res => {
        console.log(res.data)
        this.items = res.data
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    }
  },
  computed: {
    ...mapGetters(['getLayout'])
  },
  created () {
    this.refreshRevisiones()
  }
}
</script>