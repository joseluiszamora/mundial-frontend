<template>
  <v-card v-if="getTareaSelected" class="py-1 px-2">
    <!-- Información de la Actividad -->
    <tarea-info v-show="getDisplayTareas.opciones.informacion" v-if="getTareaSelected" :tareaSelected="getTareaSelected"></tarea-info>
    <!-- Listado de Revisiones -->
    <revisiones v-show="getDisplayTareas.opciones.actividades" v-if="getTareaSelected" :tarea="getTareaSelected"></revisiones>
    <!-- Galeria -->
    <gallery v-show="getDisplayTareas.opciones.galeria"></gallery>

    <!-- <actividades-main v-show="getDisplay.tareas"></actividades-main> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import TareaInfo from '../tarea/TareaInfo.vue'
import Revisiones from '../revision/Index.vue'
import gallery from '../shared/Gallery.vue'
/* import ObraInfo from '../obra/ObraInfo.vue' */
// import ActividadesLista from '../actividad/ActividadesLista.vue'
/* import ActividadesMain from '@/actividades/ActividadesMain.vue' */
export default {
  name: 'TareaMain',
  components: { TareaInfo, Revisiones, gallery },
  // components: { ActividadInfo, Tareas, gallery },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters(['getDisplayTareas', 'getTareaSelected'])
  }
}
</script>