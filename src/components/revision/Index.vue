<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <v-toolbar :class="getLayout.color + ' lighten-3' || 'light-blue darken-4'">
          <v-toolbar-title class="white--text">
            Revisiones de la Tarea: {{ getTareaSelected.nombre }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
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
        </v-toolbar>

        <v-layout row wrap>
          <v-flex class="md12">
            <!-- Lista Expandida de Tareas -->
            <revisiones-lista :tarea="getTareaSelected" v-show="getDisplayTareas.listado"></revisiones-lista>
            <!-- Formulario de Tareas -->
            <!-- <tarea-form :actividad="getActividadSelected" v-show="getDisplayTareas.form"></tarea-form> -->
            <!-- Obras Main -->
            <!-- <v-slide-x-transition mode="out-in" v-show="getDisplay.revisiones">
              <tarea-main></tarea-main>
            </v-slide-x-transition> -->
          </v-flex>
        </v-layout>
      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import RevisionesLista from '../revision/RevisionesLista.vue'
/* import TareaForm from '../tarea/Form.vue'
import TareaMain from '../tarea/TareaMain.vue' */

export default {
  components: { RevisionesLista },
  name: 'revisiones',
  data () {
    return {
      localTitle: 'Revisiones',
      items: []
    }
  },
  methods: {
    getClass (val) {
      if (val) {
        return this.getLayout.color + ' accent-4'
      }
    },
    closeTarea () {
      this.$store.dispatch('setTareaSelected', null)
      let valores = { obras: false, actividades: true, tareas: true, revisiones: false }
      this.$store.dispatch('setDisplay', valores)
    }/* ,
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
    } */
  },
  computed: {
    ...mapGetters(['getLayout', 'getDisplay', 'getDisplayTareas', 'getActividadSelected', 'getTareaSelected'])
  },
  created () {
  }
}
</script>
<style scoped>
</style>