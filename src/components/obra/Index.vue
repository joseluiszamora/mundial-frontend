<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <v-toolbar :class="getLayout.color + ' lighten-1' || 'light-blue darken-4'">
          <v-toolbar-title class="white--text">
            <div v-show="!getDisplay.actividades">
              {{ localTitle }}
            </div>
            <div v-if="getDisplay.actividades">
              <v-icon color="white" v-html="getObraSelected.tipo_de_obra==='estacion' ? 'domain' : 'title'"></v-icon>
              Obra: {{ getObraSelected.codigo + ' (' + getObraSelected.nombre + ')' }}
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div v-show="!getDisplay.actividades">
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayObras.listado)" @click="showListado">
                <v-icon dark>list</v-icon>
                <!-- :class="getLayout.color + ' accent-1'" -->
              </v-btn>
              <span>Listado de Obras</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayObras.form)" @click="showForm">
                <v-icon dark>add_circle_outline</v-icon>
              </v-btn>
              <span>Nueva Obra</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayObras.creacionBloque)" @click="showCreacionBloque">
                <v-icon dark>playlist_add</v-icon>
              </v-btn>
              <span>Crear varias Obras</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayObras.valorProporcional)" @click="showValorProporcional">
                <v-icon dark>trending_up</v-icon>
              </v-btn>
              <span>Asignar Valor Proporcional</span>
            </v-tooltip>
          </div>
          <div v-if="getDisplay.actividades">
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayObras.opciones.informacion)" @click="showObraOpciones('informacion')">
                <v-icon dark>info</v-icon>
              </v-btn>
              <span>Información de la obra {{ getObraSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayObras.opciones.actividades)" @click="showObraOpciones('actividades')">
                <v-icon dark>menu</v-icon>
              </v-btn>
              <span>Actividades de la obra {{ getObraSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayObras.opciones.galeria)" @click="showObraOpciones('galeria')">
                <v-icon dark>image</v-icon>
              </v-btn>
              <span>Galeria de la obra {{ getObraSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" class="red" @click="closeObra()">
                <v-icon dark>close</v-icon>
              </v-btn>
              <span>Volver al listado de Obras</span>
            </v-tooltip>
          </div>
        </v-toolbar>

        <v-layout row wrap>
          <v-flex class="md12">
            <div v-show="!getDisplay.actividades">
              <!-- Lista Expandida de Obras -->
              <obras-lista :linea="getCodigoLinea" v-show="getDisplayObras.listado"></obras-lista>
              <!-- Formulario de Obras -->
              <obra-form v-show="getDisplayObras.form" :action="'create'"></obra-form>
              <!-- Crear Obras en Bloque -->
              <crear-bloque v-show="getDisplayObras.creacionBloque"></crear-bloque>
              <!-- Valor Proporcional de Obras -->
              <valor-proporcional v-show="getDisplayObras.valorProporcional" :tipo="'obra'" :codigoLinea="getCodigoLinea"></valor-proporcional>
            </div>
            <!-- Obras Main -->
            <v-slide-x-transition mode="out-in" v-show="getDisplay.actividades">
              <obra-main></obra-main>
            </v-slide-x-transition>
          </v-flex>
        </v-layout>
      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ObrasLista from '../obra/ObrasLista.vue'
import ObraForm from '../obra/Form.vue'
import CrearBloque from '../obra/CrearBloque.vue'
import ValorProporcional from '../obra/ValorProporcional.vue'
import ObraMain from '../obra/ObraMain.vue'

export default {
  name: 'obras',
  components: { ObrasLista, ObraForm, CrearBloque, ValorProporcional, ObraMain },
  data () {
    return {
      localTitle: 'Obras',
      showActividadesTable: true,
      items: []
    }
  },
  methods: {
    showListado () {
      this.localTitle = 'Obras'
      this.displayObra('informacion', 'listado')
    },
    showForm () {
      this.localTitle = 'Nueva Obra'
      this.displayObra('informacion', 'form')
    },
    showCreacionBloque () {
      this.localTitle = 'Crear obras en bloque'
      this.displayObra('informacion', 'creacionBloque')
    },
    showValorProporcional () {
      this.localTitle = 'Asignar Valor Proporcional'
      this.displayObra('informacion', 'valorProporcional')
    },
    getClass (val) {
      if (val) {
        return this.getLayout.color + ' accent-4'
      }
    },
    closeObra () {
      this.$store.dispatch('setObraSelected', null)
      let valores = { obras: true, actividades: false, tareas: false, revisiones: true }
      this.$store.dispatch('setDisplay', valores)
    },
    showObraOpciones (selected) {
      this.displayObra(selected, 'listado')
    },
    displayObra (opcion, valor) {
      let opciones = { informacion: false, actividades: false, galeria: false, formEdit: false }
      opciones[opcion] = true
      let valores = { listado: false, form: false, creacionBloque: false, valorProporcional: false, opciones: opciones }
      valores[valor] = true
      this.$store.dispatch('setDisplayObras', valores)
    }
  },
  computed: {
    ...mapGetters(['getLayout', 'getDisplay', 'getDisplayObras', 'getCodigoLinea', 'getObraSelected'])
  },
  created () {
  }
}
</script>
