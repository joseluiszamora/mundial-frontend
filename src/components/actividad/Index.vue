<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <v-toolbar :class="getLayout.color + ' lighten-2' || 'light-blue darken-4'">
          <v-toolbar-title class="white--text">
            <div v-if="!getDisplay.tareas">
              {{ localTitle }}
            </div>
            <div v-if="getDisplay.tareas">
              Actividad: {{ getActividadSelected.nombre }}
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div v-if="!getDisplay.tareas">
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayActividades.listado)" @click="showListado">
                <v-icon dark>list</v-icon>
              </v-btn>
              <span>Listado de Actividades</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayActividades.form)" @click="showForm">
                <v-icon dark>add_circle_outline</v-icon>
              </v-btn>
              <span>Nueva Actividad</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayActividades.creacionBloque)" @click="showCreacionBloque">
                <v-icon dark>playlist_add</v-icon>
              </v-btn>
              <span>Crear varias Actividades</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayActividades.valorProporcional)" @click="showValorProporcional">
                <v-icon dark>trending_up</v-icon>
              </v-btn>
              <span>Asignar Valor Proporcional</span>
            </v-tooltip>
          </div>
          <div v-if="getDisplay.tareas">
            <v-tooltip top>
              <v-btn icon  slot="activator" :class="getClass(getDisplayActividades.opciones.informacion)" @click="showActividadOpciones('informacion')">
                <v-icon dark>info</v-icon>
              </v-btn>
              <span>Información de la actividad {{ getActividadSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayActividades.opciones.actividades)" @click="showActividadOpciones('actividades')">
                <v-icon dark>menu</v-icon>
              </v-btn>
              <span>Tareas de la actividad {{ getActividadSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayActividades.opciones.galeria)" @click="showActividadOpciones('galeria')">
                <v-icon dark>image</v-icon>
              </v-btn>
              <span>Galeria de la actividad {{ getActividadSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" class="red" @click="closeActividad()">
                <v-icon dark>close</v-icon>
              </v-btn>
              <span>Volver al listado de Actividades</span>
            </v-tooltip>
          </div>
        </v-toolbar>

        <v-layout row wrap>
          <v-flex class="md12">
            <div v-show="!getDisplay.tareas">
              <!-- Lista Expandida de Obras -->
              <actividades-lista :obra="getObraSelected" v-show="getDisplayActividades.listado"></actividades-lista>
              <!-- Formulario de Obras -->
              <actividad-form v-show="getDisplayActividades.form" :action="'create'"></actividad-form>
              <!-- Crear Obras en Bloque -->
              <crear-bloque v-show="getDisplayActividades.creacionBloque"></crear-bloque>
              <!-- Valor Proporcional de Obras -->
              <valor-proporcional v-show="getDisplayActividades.valorProporcional" :tipo="'actividad'" :obra="getObraSelected"></valor-proporcional>
            </div>
            <!-- Obras Main -->
            <v-slide-x-transition mode="out-in" v-show="getDisplay.tareas">
              <actividad-main></actividad-main>
            </v-slide-x-transition>
          </v-flex>
        </v-layout>
      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ActividadesLista from '../actividad/ActividadesLista.vue'
import ActividadForm from '../actividad/Form.vue'
import CrearBloque from '../actividad/CrearBloque.vue'
import ValorProporcional from '../obra/ValorProporcional.vue'
import ActividadMain from '../actividad/ActividadMain.vue'

export default {
  components: { ActividadesLista, ActividadForm, ValorProporcional, ActividadMain, CrearBloque },
  name: 'actividades',
  data () {
    return {
      localTitle: 'Actividades',
      items: []
    }
  },
  methods: {
    showListado () {
      this.localTitle = 'Actividades'
      this.display('informacion', 'listado')
    },
    showForm () {
      this.localTitle = 'Nueva Actividad'
      this.display('informacion', 'form')
    },
    showCreacionBloque () {
      this.localTitle = 'Crear actividades en bloque'
      this.display('informacion', 'creacionBloque')
    },
    showValorProporcional () {
      this.localTitle = 'Asignar Valor Proporcional'
      this.display('informacion', 'valorProporcional')
    },
    closeActividad () {
      this.$store.dispatch('setActividadSelected', null)
      let valores = { obras: false, actividades: true, tareas: false, revisiones: true }
      this.$store.dispatch('setDisplay', valores)
    },
    getClass (val) {
      if (val) {
        return this.getLayout.color + ' accent-4'
      }
    },
    display (opcion, valor) {
      let opciones = { informacion: false, actividades: false, galeria: false, formEdit: false }
      opciones[opcion] = true
      let valores = { listado: false, form: false, creacionBloque: false, valorProporcional: false, opciones: opciones }
      valores[valor] = true
      this.$store.dispatch('setDisplayActividades', valores)
    },
    showActividadOpciones (selected) {
      let opciones = { informacion: false, actividades: false, galeria: false }
      opciones[selected] = true
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayActividades', valores)
    }
  },
  computed: {
    ...mapGetters(['getLayout', 'getDisplay', 'getDisplayActividades', 'getObraSelected', 'getActividadSelected'])
  }
}
</script>
<style scoped>
</style>