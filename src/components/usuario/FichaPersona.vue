<template lang="pug">
  v-layout(row, justify-center)
    v-flex.xs5
      img(width="100%" :src="setImage(persona)" @error="imageLoadOnError" v-show="avatarStatus")
      img(width="100%" src="../../assets/teleferico.png" v-show="!avatarStatus")
    v-flex.xs5
      v-list(subheader)
        v-list-tile(avatar)
          v-list-tile-content
            v-list-tile-title Nombres
            v-list-tile-sub-title {{ persona.p_nombre + ' ' + persona.s_nombre }}
        v-list-tile(avatar)
          v-list-tile-content
              v-list-tile-title Apellidos
              v-list-tile-sub-title {{ persona.p_apellido + ' ' + persona.s_apellido }}
        v-list-tile(avatar)
          v-list-tile-content
            v-list-tile-title Documento
            v-list-tile-sub-title {{ persona.ci }}
        v-list-tile(avatar)
          v-list-tile-content
            v-list-tile-title Correo Electrónico
            v-list-tile-sub-title {{ persona.e_mail_inst }}
        v-list-tile(avatar)
          v-list-tile-content
            v-list-tile-title Cargo
            v-list-tile-sub-title {{ persona.cargo }}
        v-list-tile(avatar)
          v-list-tile-content
            v-list-tile-title Genero
            v-list-tile-sub-title {{ setGenero(persona.genero) }}
</template>

<script>
// import http from '@/http/obra'

export default {
  name: 'fichaPersona',
  props: {
    persona: { type: Object, required: true }
  },
  data () {
    return {
      avatarStatus: true
    }
  },
  methods: {
    imageLoadOnError () {
      this.avatarStatus = false
    },
    setImage (persona) {
      this.avatarStatus = true
      return 'http://rrhh.miteleferico.bo/images/personal/' + persona.ci + '.jpg'
    },
    setGenero (genero) {
      if (genero === 'M') {
        return 'Masculino'
      } else {
        return 'Femenino'
      }
    }
  },
  computed: {
  },
  created () {
    console.log(this.persona)
  }
}
</script>