<template>
  <v-card v-if="getActividadSelected" class="py-1 px-2">
    <!-- Información de la Actividad -->
    <actividad-info v-show="getDisplayActividades.opciones.informacion" v-if="getActividadSelected" :actividadSelected="getActividadSelected"></actividad-info>
    <!-- Listado de Actividades -->
    <tareas v-show="getDisplayActividades.opciones.actividades" v-if="getActividadSelected" :actividad="getActividadSelected"></tareas>
    <!-- Galeria -->
    <gallery v-show="getDisplayActividades.opciones.galeria"></gallery>

    <!-- <actividades-main v-show="getDisplay.tareas"></actividades-main> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ActividadInfo from '../actividad/ActividadInfo.vue'
import Tareas from '../tarea/Index.vue'
import gallery from '../shared/Gallery.vue'
/* import ObraInfo from '../obra/ObraInfo.vue' */
// import ActividadesLista from '../actividad/ActividadesLista.vue'
/* import ActividadesMain from '@/actividades/ActividadesMain.vue' */
export default {
  name: 'actividadMain',
  // components: { ObraInfo, Actividades },
  components: { ActividadInfo, Tareas, gallery },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters(['getDisplayActividades', 'getActividadSelected'])
  }
}
</script>