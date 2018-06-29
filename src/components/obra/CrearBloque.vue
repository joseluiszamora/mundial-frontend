<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <div style="float:right;">
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="teal" @click="removeObras" v-show="this.selected.length > 0">
              <v-icon dark>remove</v-icon>
            </v-btn>
            <span>Remover todas las seleccionadas</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="teal" @click="dialogOtraLinea = true">
              <v-icon dark>get_app</v-icon>
            </v-btn>
            <span>Importar obras desde otra Linea</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="green" @click="saveObras">
              <v-icon dark>save</v-icon>
            </v-btn>
            <span>Guardar todas las obras completas</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="blue" @click="addObra">
              <v-icon dark>add</v-icon>
            </v-btn>
            <span>Agregar Nuevo</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="red" @click="close">
              <v-icon dark>close</v-icon>
            </v-btn>
            <span>Volver al listado de Obras</span>
          </v-tooltip>
        </div>

        <v-dialog v-model="dialogOtraLinea" persistent scrollable max-width="400px">
          <v-card>
            <v-card-title>Importar obras desde una Linea</v-card-title>
            <v-divider></v-divider>
            <div>
              <v-select class="px-2" style="margin:0 0 0;"
                label="Linea"
                v-model="lineaSelected"
                :items="lineas"
              ></v-select>
            </div>
            <v-divider></v-divider>
            <v-card-text style="max-height: 300px;">
              <v-subheader>Estaciones</v-subheader>
              <div v-for="obra in obrasParaImportar" v-bind:key="obra.id_obra" v-if="obra.tipo_de_obra === 'Estación'" style="height:30px;">
                <v-checkbox :label="obra.nombre" v-model="obra.select" light></v-checkbox>
              </div>
              <v-subheader>Torres</v-subheader>
              <div v-for="obra in obrasParaImportar" v-bind:key="obra.id_obra" v-if="obra.tipo_de_obra === 'Torre'" style="height:30px;">
                <v-checkbox :label="obra.nombre" v-model="obra.select" light></v-checkbox>
              </div>
              <v-subheader>Obras Complementarias</v-subheader>
              <div v-for="obra in obrasParaImportar" v-bind:key="obra.id_obra" v-if="obra.tipo_de_obra === 'Obras Complementarias'" style="height:30px;">
                <v-checkbox :label="obra.nombre" v-model="obra.select" light></v-checkbox>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" flat @click.native="dialogOtraLinea = false">Cancelar</v-btn>
              <v-btn color="green darken-1" flat @click="importarObras">Importar({{ countObrasparaImportar() }})</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <v-data-table
          :headers="headers"
          :items="items"
          v-model="selected"
          item-key="id"
          select-all
          hide-actions
          class="elevation-1"
        >
          <template slot="headerCell" scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                {{ props.header.text }}
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" scope="props">
            <td>
              <div>
                <v-checkbox
                  primary
                  hide-details
                  v-model="props.selected"
                ></v-checkbox>
              </div>
            </td>
            <td class="text-xs-center">
              <v-select
                label="Tipo de Obra"
                v-model="props.item.tipo"
                :items="tiposDeObra"
                required
              ></v-select>
            </td>
            <td class="text-xs-center">
              <v-text-field  style="width: 80px;margin: 0 auto;"
              v-model="props.item.codigo"
              ></v-text-field>
            </td>
            <td class="text-xs-center">
              <v-text-field  style="width: 150px;margin: 0 auto;"
              v-model="props.item.nombre"
              ></v-text-field>
            </td>
            <td class="text-xs-center">
              <v-text-field  style="width: 90px;margin: 0 auto;"
              label="2018-01-31"
              v-model="props.item.fecha_inicio"
              ></v-text-field>
            </td>
            <td class="text-xs-center">
              <v-text-field  style="width: 90px;margin: 0 auto;"
              label="2018-01-31"
              v-model="props.item.fecha_fin"
              ></v-text-field>
            </td>
            <td class="text-xs-center">
              <v-text-field 
              v-model="props.item.descripcion"
              ></v-text-field>
            </td>
            <td class="text-xs-center">
              <v-icon v-show="checkObra(props.item)" small color="green darken-2">check</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import http from '@/http/obra'
import httpLinea from '@/http/linea'
import { mapGetters } from 'vuex'
export default {
  name: 'crearBloque',
  data () {
    return {
      selected: [],
      headers: [
        { text: 'Tipo de Obra', align: 'center', sortable: false, value: 'name' },
        { text: 'Codigo de Obra', align: 'center', sortable: false, value: 'name' },
        { text: 'Nombre de la Obra', align: 'center', sortable: false, value: 'name' },
        { text: 'Inicio', align: 'center', sortable: false, value: 'name' },
        { text: 'Conclusión', align: 'center', sortable: false, value: 'name' },
        { text: 'Descripción', align: 'center', sortable: false, value: 'name' }
      ],
      items: [],
      tiposDeObra: ['Estación', 'Torre', 'Obras Complementarias'],
      lineas: [],
      lineaSelected: null,
      dialogOtraLinea: false,
      obrasParaImportar: []
    }
  },
  methods: {
    addObra () {
      this.items.push(this.createBlankObra())
    },
    addObraObj (obra) {
      this.items.push(obra)
    },
    createBlankObra () {
      return {
        id: this.getId(),
        tipo: '',
        codigo: '',
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: ''
      }
    },
    removeObras () { // remueve todas las obras seleccionadas
      this.selected.forEach(function (element) {
        this.removeObra(element.id)
      }, this)
    },
    getId () { // da un id para nueva obra
      let index = 1
      this.items.forEach(function (element) {
        if (element.id >= index) {
          index = element.id + 1
        }
      }, this)
      return index
    },
    removeObra (id) { // elimina una obra especifica basada en el id de la onbra
      let tempArray = []
      this.items.forEach(function (element, index) {
        if (element.id !== id) { tempArray.push(element) }
      }, this)
      this.items = tempArray
    },
    checkObra (obra) { // verifica si los datos de la obra estan completos
      if (obra.tipo !== '' && obra.codigo !== '' && obra.nombre !== '' && obra.fecha_inicio !== '' && obra.fecha_fin !== '') {
        return true
      }
      return false
    },
    saveObras () { // guarda las obras en bloque
      this.items.forEach(function (element) {
        if (this.checkObra(element)) {
          if (element.tipo === 'Estación') { element.tipo = 'estacion' }
          if (element.tipo === 'Torre') { element.tipo = 'torre' }
          if (element.tipo === 'Obras Complementarias') { element.tipo = 'obra_complementaria' }

          const obra = `codigo_linea=${this.getCodigoLinea}&codigo=${element.codigo}&tipo_de_obra=${element.tipo}&nombre=${element.nombre}&resumen=${element.descripcion}&fecha_inicio=${element.fecha_inicio}&fecha_fin=${element.fecha_fin}&latitud=0&longitud=0`

          http.obraCreate(obra).then(res => {
            this.$snotify.success('Se creo la obra ' + element.nombre, 'Obra Creada')
            this.removeObra(element.id)
          }, (error) => {
            this.showError = true
            console.log(error)
          })
        }
      }, this)
    },
    close () {
      let opciones = { informacion: true, actividades: false, galeria: false, formEdit: false }
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayObras', valores)
    },
    getLineasPorFase (fase) { // retorna todas las lineas de la fase
      httpLinea.getPorFase(fase).then(res => {
        // this.lineas = res.data.data
        res.data.data.forEach(function (element) {
          this.lineas.push(element.codigo_linea)
        }, this)
      }, (error) => {
        console.log(error)
      })
    },
    countObrasparaImportar () { // cuenta las obras para importar
      let counter = 0
      this.obrasParaImportar.forEach(function (element) {
        if (element.select) { counter++ }
      }, this)
      return counter
    },
    importarObras () {
      this.obrasParaImportar.forEach(function (element) {
        if (element.select) {
          this.addObraObj({
            id: this.getId(),
            tipo: element.tipo_de_obra,
            codigo: element.codigo,
            nombre: element.nombre,
            fecha_inicio: element.fecha_inicio,
            fecha_fin: element.fecha_fin,
            descripcion: element.resumen
          })
        }
      }, this)
      this.dialogOtraLinea = false
      this.lineaSelected = null
      this.obrasParaImportar = []
    }
  },
  watch: {
    lineaSelected (newVal, oldVal) {
      this.obrasParaImportar = []
      http.obrasLinea(newVal, { estadoSelected: '', tipodeObraSelected: '' }).then(res => {
        res.data.forEach(function (element) {
          if (element.tipo_de_obra === 'estacion') { element.tipo_de_obra = 'Estación' }
          if (element.tipo_de_obra === 'torre') { element.tipo_de_obra = 'Torre' }
          if (element.tipo_de_obra === 'obra_complementaria') { element.tipo_de_obra = 'Obras Complementarias' }
          let temp = { select: true, id_obra: element.id_obra, tipo_de_obra: element.tipo_de_obra, codigo: element.codigo, nombre: element.nombre, fecha_inicio: element.fecha_inicio, fecha_fin: element.fecha_fin, resumen: element.resumen }
          this.obrasParaImportar.push(temp)
        }, this)
      }, (error) => {
        console.log(error)
      })
    }
  },
  computed: {
    ...mapGetters(['getCodigoLinea'])
  },
  created () {
    this.getLineasPorFase('fase2')
  }
}
</script>
