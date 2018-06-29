<template>
  <transition mode="out-in">
    <div v-if="valor<100">
      <span class="subheading">La suma de valores debe alcanzar 100%</span>
      <v-chip color="orange">
        <span class="white--text headline">{{ valor }}%</span>
      </v-chip>
    </div>
    <v-chip v-if="valor===100" color="green" text-color="white">
      <span class="white--text headline">{{ valor }}%</span>
      <v-icon right>check_circle</v-icon>
    </v-chip>
    <div v-if="valor>100">
      <span class="subheading">La suma de valores no debe sobrepasar 100%</span>
      <v-chip color="red">
        <span class="white--text headline">{{ valor }}%</span>
      </v-chip>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'porcentaje',
  props: {
    valor: { type: Number, required: true }
  }
}
</script>
