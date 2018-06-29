<template>
  <v-layout row text-center justify-center style="padding: 25px 0;">
    <v-flex xs12>
      <semipolar-spinner :size="65" color="#01579b" style="margin: 0 auto;" />
      <br>
      <p v-if="message" style="text-align:center;width:100%;margin:0 auto;">{{ message }}</p>
      <p v-if="!message" style="text-align:center;width:100%;margin:0 auto;">Cargando...</p>
    </v-flex>
  </v-layout>
</template>

<script>
import { SemipolarSpinner } from 'epic-spinners'

export default {
  props: {
    message: { type: String, required: false }
  },
  components: { SemipolarSpinner },
  name: 'loader'
}
</script>