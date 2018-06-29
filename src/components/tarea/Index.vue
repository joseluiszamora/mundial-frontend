<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <v-toolbar :class="(getLayout.color || 'primary') + ' lighten-2' || 'light-blue darken-4'">
          <v-toolbar-title class="white--text">
            <div v-if="!getDisplay.revisiones">
              {{ localTitle }}
            </div>
            <div v-if="getDisplay.revisiones">
              Tarea: {{ getTareaSelected.nombre }}
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div v-if="!getDisplay.revisiones">
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayTareas.listado)" @click="showListado">
                <v-icon dark>list</v-icon>
              </v-btn>
              <span>Listado de Tareas</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayTareas.form)" @click="showForm">
                <v-icon dark>add_circle_outline</v-icon>
              </v-btn>
              <span>Nueva Tarea</span>
            </v-tooltip>
          </div>
          <div v-if="getDisplay.revisiones">
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayTareas.opciones.informacion)" @click="showTareaOpciones('informacion')">
                <v-icon dark>info</v-icon>
              </v-btn>
              <span>Información de la Tarea {{ getTareaSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayTareas.opciones.actividades)" @click="showTareaOpciones('actividades')">
                <v-icon dark>menu</v-icon>
              </v-btn>
              <span>Revisiones de la tarea {{ getTareaSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" :class="getClass(getDisplayTareas.opciones.galeria)" @click="showTareaOpciones('galeria')">
                <v-icon dark>image</v-icon>
              </v-btn>
              <span>Galeria de la Tarea {{ getTareaSelected.nombre }}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon slot="activator" class="red" @click="closeTarea()">
                <v-icon dark>close</v-icon>
              </v-btn>
              <span>Volver al listado de Tareas</span>
            </v-tooltip>
          </div>
        </v-toolbar>

        <v-layout row wrap>
          <v-flex class="md12">
            <div v-show="!getDisplay.revisiones">
              <!-- Lista Expandida de Tareas -->
              <tareas-lista :actividad="getActividadSelected" v-show="getDisplayTareas.listado"></tareas-lista>
              <!-- Formulario de Tareas -->
              <tarea-form :actividad="getActividadSelected" v-show="getDisplayTareas.form"></tarea-form>
            </div>
            <!-- Obras Main -->
            <v-slide-x-transition mode="out-in" v-show="getDisplay.revisiones">
              <tarea-main></tarea-main>
            </v-slide-x-transition>
          </v-flex>
        </v-layout>
      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TareasLista from '../tarea/TareasLista.vue'
import TareaForm from '../tarea/Form.vue'
import TareaMain from '../tarea/TareaMain.vue'

export default {
  components: { TareasLista, TareaForm, TareaMain },
  name: 'tareas',
  data () {
    return {
      localTitle: 'Tareas',
      items: []
    }
  },
  methods: {
    getClass (val) {
      if (val) {
        return this.getLayout.color + ' accent-4'
      } else {
        return 'primary accent-4'
      }
    },
    showListado () {
      this.localTitle = 'Tareas'
      let valores = { listado: true, form: false, valorProporcional: false }
      this.$store.dispatch('setDisplayTareas', valores)
    },
    showForm () {
      this.localTitle = 'Nueva Tarea'
      let valores = { listado: false, form: true, valorProporcional: false }
      this.$store.dispatch('setDisplayTareas', valores)
    },
    showTareaOpciones (selected) {
      let opciones = { informacion: false, actividades: false, galeria: false }
      opciones[selected] = true
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayTareas', valores)
    },
    closeTarea () {
      this.$store.dispatch('setTareaSelected', null)
      let valores = { obras: false, actividades: true, tareas: true, revisiones: false }
      this.$store.dispatch('setDisplay', valores)
    }
  },
  computed: {
    ...mapGetters(['getLayout', 'getDisplay', 'getDisplayTareas', 'getActividadSelected', 'getTareaSelected'])
  }
}
</script>
<style scoped>
</style>