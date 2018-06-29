<template>
  <v-layout column wrap>
    <obras></obras>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Obras from '../obra/Index.vue'

export default {
  name: 'Linea',
  components: { Obras },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created () {
    /* if (this.$route.params.id_tarjeta) {
      http.getSingleTarjeta(this.$route.params.id_tarjeta).then(res => {
        // set valores en el template
        this.setValoresTarjeta(res.data[0])
        this.editarTarjeta = true
      }, (error) => {
        this.error = true
        console.log(error)
        router.push('/listado_tarjeta')
      })
    }
    this.selectTemplate() */
  },
  computed: {
    ...mapGetters(['getDisplay', 'getCodigoLinea'])
  }
}
</script>

<style scoped>
</style>
