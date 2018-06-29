<template>
  <div style="Width:100px; height: 500px; padding: 20px;">
    <gmap-map 
      :center="center"
      :zoom="zoom" 
      map-type-id="terrain" 
      style="width: 100%; height: 100%"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="false"
        :draggable="false"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBvWE_sIwKbWkiuJQOf8gSk9qzpO96fhfY'
  }
})

export default {
  name: 'mapCustom',
  props: {
    latitud: { type: String, required: true },
    longitud: { type: String, required: true }
  },
  data () {
    return {
      zoom: 16,
      center: { lat: +this.latitud, lng: +this.longitud },
      markers: [{ position: { lat: +this.latitud, lng: +this.longitud } }]
    }
  },
  methods: {
  },
  created () {
  }
}
</script>
