<template>
  <v-card v-if="getObraSelected" class="py-1 px-2">
    <!-- Información de la Obra -->
    <obra-info v-show="getDisplayObras.opciones.informacion" v-if="getObraSelected" :obraSelected="getObraSelected"></obra-info>
    <!-- Listado de Actividades -->
    <actividades v-show="getDisplayObras.opciones.actividades" v-if="getObraSelected" :obra="getObraSelected"></actividades>
    <!-- Galeria -->
    <gallery v-show="getDisplayObras.opciones.galeria" :obra="getObraSelected"></gallery>
    <!-- <actividades-main v-show="getDisplay.tareas"></actividades-main> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ObraInfo from '../obra/ObraInfo.vue'
import gallery from '../shared/GalleryObra.vue'
import Actividades from '../actividad/Index.vue'
// import ActividadesLista from '../actividad/ActividadesLista.vue'
/* import ActividadesMain from '@/actividades/ActividadesMain.vue' */
export default {
  name: 'obraMain',
  components: { ObraInfo, gallery, Actividades },
  computed: {
    ...mapGetters(['getDisplayObras', 'getObraSelected'])
  },
  created () {
    console.log('created')
    console.log(this.getObraSelected)
  },
  mounted () {
    console.log('mounted')
    console.log(this.getObraSelected)
  }
}
</script>