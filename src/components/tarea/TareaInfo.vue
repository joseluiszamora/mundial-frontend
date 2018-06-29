<template>
  <v-card>
    <v-layout row wrap>
      <v-flex class="md12">
        <v-slide-x-transition mode="out-in">
          <v-list two-line>
            <v-list-tile avatar ripple>
              <v-list-tile-content>
                <v-list-tile-title class="text-xs-center">{{ tareaSelected.nombre }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>{{ tareaSelected.descripcion }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Fecha Inicio</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ tareaSelected.fecha_creacion }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Fecha Conclusión (Estimado)</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ tareaSelected.fecha_conclusion }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-slide-x-transition>
      </v-flex>
    </v-layout>

  </v-card>
</template>

<script>
export default {
  name: 'tareaInfo',
  props: {
    tareaSelected: { type: Object, required: true }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
