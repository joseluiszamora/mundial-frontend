<template lang="pug">
  v-layout(row, text-center, justify-center, style='padding: 50px 0;')
    v-flex(xs12)
      semipolar-spinner(:size='65', color='#01579b', style='margin: 0 auto;')
        br
        p(style='width: 65px; margin: 0 auto;') Cargando...


</template>

<script>
  import { SemipolarSpinner } from 'epic-spinners'
  
  export default {
    components: { SemipolarSpinner },
    name: 'loader'
  }
</script>
<style scoped>
</style>