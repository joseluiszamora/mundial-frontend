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
            <span>Importar actividades desde otra obra</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="green" @click="save">
              <v-icon dark>save</v-icon>
            </v-btn>
            <span>Guardar todas las actividades completas</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" fab small right class="blue" @click="add">
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
            <v-card-title>Importar actividades desde una Obra</v-card-title>
            <v-divider></v-divider>
            <div>
              <v-select class="px-2" style="margin:0 0 0;"
                label="Linea"
                v-model="lineaSelected"
                :items="lineas"
              ></v-select>
            </div>
            <v-divider></v-divider>
            <div>
              <v-select class="px-2" style="margin:0 0 0;"
                label="Obra"
                v-model="obraSelected"
                :items="obras"
                item-text="nombre"
                item-value="id_obra"
              ></v-select>
            </div>
            <v-divider></v-divider>
            <v-card-text style="max-height: 300px;">
              <v-subheader>Actividades</v-subheader>
              <div v-for="actividad in actividadesParaImportar" v-bind:key="actividad.id_actividad" style="height:30px;">
                <v-checkbox :label="actividad.nombre" v-model="actividad.select" light></v-checkbox>
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
              <v-icon v-show="check(props.item)" small color="green darken-2">check</v-icon>
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
import httpActividad from '@/http/actividad'
import { mapGetters } from 'vuex'
export default {
  name: 'crearBloque',
  data () {
    return {
      selected: [],
      headers: [
        { text: 'Nombre de la Actividad', align: 'center', sortable: false, value: 'name' },
        { text: 'Inicio', align: 'center', sortable: false, value: 'name' },
        { text: 'Conclusión', align: 'center', sortable: false, value: 'name' },
        { text: 'Descripción', align: 'center', sortable: false, value: 'name' }
      ],
      items: [],
      lineas: [],
      obras: [],
      lineaSelected: null,
      obraSelected: null,
      dialogOtraLinea: false,
      actividadesParaImportar: []
    }
  },
  methods: {
    add () {
      this.items.push(this.createBlankObra())
    },
    addObraObj (obra) {
      this.items.push(obra)
    },
    createBlankObra () {
      return {
        id: this.getId(),
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
    check (obra) { // verifica si los datos de la obra estan completos
      if (obra.nombre !== '' && obra.fecha_inicio !== '' && obra.fecha_fin !== '') {
        return true
      }
      return false
    },
    save () { // guarda las obras en bloque
      this.items.forEach(function (element) {
        if (this.check(element)) {
          const actividad = `id_obra=${this.getObraSelected.id_obra}&nombre=${element.nombre}&descripcion=${element.descripcion}&fecha_inicio=${element.fecha_inicio}&fecha_fin=${element.fecha_fin}`
          httpActividad.actividadCreate(actividad).then(res => {
            this.$snotify.success('Se creo la actividad ' + element.nombre, 'Actividad Creada')
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
      this.actividadesParaImportar.forEach(function (element) {
        if (element.select) { counter++ }
      }, this)
      return counter
    },
    importarObras () {
      this.actividadesParaImportar.forEach(function (element) {
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
      this.actividadesParaImportar = []
    }
  },
  watch: {
    lineaSelected (newVal, oldVal) {
      this.actividadesParaImportar = []
      http.obrasLinea(newVal, { estadoSelected: '', tipodeObraSelected: '' }).then(res => {
        res.data.forEach(function (element) {
          let temp = { select: true, id_obra: element.id_obra, tipo_de_obra: element.tipo_de_obra, codigo: element.codigo, nombre: element.nombre, fecha_inicio: element.fecha_inicio, fecha_fin: element.fecha_fin, resumen: element.resumen }
          this.obras.push(temp)
        }, this)
      }, (error) => {
        console.log(error)
      })
    },
    obraSelected (newVal, oldVal) {
      this.actividadesParaImportar = []
      httpActividad.actividadesObra(newVal).then(res => {
        res.data.forEach(function (element) {
          let temp = { select: true, id_obra: element.id_obra, nombre: element.nombre, fecha_inicio: element.fecha_inicio, fecha_fin: element.fecha_fin, resumen: element.descripcion }
          this.actividadesParaImportar.push(temp)
        }, this)
      }, (error) => {
        console.log(error)
      })
    }
  },
  computed: {
    ...mapGetters(['getCodigoLinea', 'getObraSelected'])
  },
  created () {
    this.getLineasPorFase('fase2')
  }
}
</script>
