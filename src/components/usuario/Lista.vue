<template>
  <v-card>
    <v-card-title>
      <div class="headline">Lista de Usuarios
        <v-btn icon @click="refresh">
          <v-icon>replay</v-icon>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Buscar..." single-line hide-details v-model="search"></v-text-field>
    </v-card-title>

    <loader v-show="loading"></loader>

    <v-data-table 
    v-show="!loading"
    v-bind:headers="headers" 
    v-bind:items="items" 
    :pagination.sync="pagination" 
    v-bind:search="search" 
    :rows-per-page-items="pag" 
    no-data-text="Ningun usuario" 
    rows-per-page-text="elementos por pagina" 
    v-model="selected" item-key="id_tarjeta" select-all class="elevation-1">

      <template slot="headers" scope="props">
        <tr>
          <th v-for="header in props.headers" 
          :key="header.text" 
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
            <v-icon>arrow_upward</v-icon>
            {{ header.text }}
          </th>
          <th>&nbsp;</th>
        </tr>
      </template>
      <template slot="items" scope="props">
        <tr>
          <td class="text-xs-center">{{ props.item.username }}</td>
          <td class="text-xs-center uppercase">{{ props.item.nombres + ' ' + props.item.apellidos }}</td>
          <td class="text-xs-center">{{ props.item.documento }}</td>
          <td class="text-xs-center">{{ props.item.cargo }}</td>
          <td class="text-xs-center">{{ props.item.tipo_usuario }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Loader from '../shared/Loader.vue'
import http from '@/http/usuario.js'
// import errors from '@/http/errors.js'

export default {
  name: 'usuariosLista',
  components: { Loader },
  data () {
    return {
      loading: false,
      search: '',
      pagination: {
        sortBy: 'id_usuario'
      },
      selected: [],
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Documento', value: 'paterno' },
        { text: 'Cargo', value: 'cargo' },
        { text: 'Tipo de Usuario', value: 'tipo_usuario' }
      ],
      items: [],
      pag: [10, 50, 100, { text: 'Todos', value: -1 }]
    }
  },
  computed: {
  },
  methods: {
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    refresh () {
      this.loading = true
      http.getAll().then(res => {
        this.items = res.data.data
        this.loading = false
      }, (error) => {
        let errorResponse = http.showError(error.response.data)
        this.$snotify.warning(errorResponse.subtitle, errorResponse.title)
        http.redirect(errorResponse.action)
        // console.log(error.response.data)
      })
    },
    catchErrors (errormessage) {
      console.log(errormessage.data)
      console.log(errormessage.data.message)
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped>

</style>
