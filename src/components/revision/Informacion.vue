<template lang="pug">
  v-layout(row)
    v-flex
      v-slide-x-transition(mode='out-in')
        v-list(two-line)
          v-list-tile
            v-list-tile-content
              v-list-tile-title Fecha de la Revisión
              v-list-tile-sub-title {{ data.fecha_revision }}
          v-divider
          v-list-tile
            v-list-tile-content
              v-list-tile-title Descripción
              span {{ data.descripcion }}
          v-divider
          div(v-if="data.usuario")
            v-list-tile
              v-list-tile-content
                v-list-tile-title Revisado por
                v-list-tile-sub-title {{ data.id_usuario }} {{ data.usuario }}
            v-divider
          //v-list-tile
            v-list-tile-content
              v-list-tile-title Tipo Revisión
              v-list-tile-sub-title {{ data.tipo_revision }}
          v-divider
          div(v-if="data.tipo_revision === 'actividad'")
            v-list-tile
              v-list-tile-content
                v-list-tile-title Actividad
                v-list-tile-sub-title {{ data.actividad }}
            v-divider
          div(v-if="data.tipo_revision === 'tarea'")
            v-list-tile
              v-list-tile-content
                v-list-tile-title Tarea
                v-list-tile-sub-title {{ data.tarea }}
            v-divider
</template>

<script>
import config from '@/config'

export default {
  name: 'informacion',
  components: { config },
  props: {
    type: { type: String, required: true },
    id_tarea: { type: String, required: false },
    data: { type: Object, required: false }
  },
  data () {
    return {
    }
  }
}
</script>