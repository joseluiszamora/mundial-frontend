<template lang="pug">
  v-card.py-2.px-5
    v-layout(row, justify-center)
      v-flex.xs10
        form
          v-layout(row, justify-space-between)
            v-flex.md5
              v-text-field(label='Documento de Identidad', v-model='documento', :error-messages='documentoErrors', @input='$v.documento.$touch()', @blur='getTelefericoData()', required)
            v-flex.md6
              v-select(label='Tipo de Usuario', v-model='tipoDeUsuario', :items='tiposDeUsuario', :error-messages='tipoDeUsuarioErrors', @change='$v.tipoDeUsuario.$touch()', @blur='$v.tipoDeUsuario.$touch()', required)
          ficha-persona(:persona="persona", v-show="showPersona" v-if="persona")
          v-layout(row, justify-center)
            v-flex.xs8
              v-btn(dark, color='deep-orange', @click='cancel')
                | Cancelar 
                v-icon clear
              v-btn(dark, color='orange', @click='clear')
                v-icon refresh
              v-btn(dark, color='green', @click='submit')
                | Guardar 
                v-icon save
</template>

<script>
import httpUsuario from '@/http/usuario'
import httpTeleferico from '@/http/teleferico'
import router from '@/router'
import fichaPersona from '../usuario/FichaPersona.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    documento: { required },
    tipoDeUsuario: { required }
  },
  components: { fichaPersona },
  data () {
    return {
      documento: null,
      tipoDeUsuario: null,
      tiposDeUsuario: ['administrador', 'supervisor', 'operador', 'visor'],
      showPersona: false,
      persona: null
    }
  },
  methods: {
    getTelefericoData () {
      httpTeleferico.getData(this.documento).then(res => {
        if (res.data.msm === 1) {
          this.persona = res.data
          this.showPersona = true
          this.$snotify.success('Usuario encontrado.', 'Usuario')
        } else {
          this.persona = null
          this.showPersona = false
          this.$snotify.warning('Usuario no encontrado.', 'Usuario')
        }
      }, (error) => {
        this.error = true
        console.log(error)
      })
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        if (this.persona) {
          const usuario = `username=${this.persona.username.toLowerCase()}&password=${this.persona.password}&nombres=${this.persona.p_nombre.toLowerCase() + ' ' + this.persona.s_nombre.toLowerCase()}&apellidos=${this.persona.p_apellido.toLowerCase() + ' ' + this.persona.s_apellido.toLowerCase()}&documento=${this.persona.ci}&email=${this.persona.e_mail_inst.toLowerCase()}&cargo=${this.persona.cargo.toLowerCase()}&genero=${this.persona.genero.toLowerCase()}&tipo_usuario=${this.tipoDeUsuario}`
          // Save Obra
          this.save(usuario)
        }
      } else {
        this.validate()
      }
    },
    validate () {
      if (this.persona == null) {
        this.$snotify.error('Introduzca un documento valido.', 'Error')
      } else {
        if (this.tipoDeUsuario == null) {
          this.$snotify.error('Seleccione el tipo de usuario.', 'Error')
        }
      }
    },
    save (usuario) {
      httpUsuario.usuarioCreate(usuario).then(res => {
        this.$snotify.success('Se creo el usuario ' + this.persona.username + ' de manera correcta.', 'Usuario creado')
        // this.clear()
        console.log(res.data)
        router.push('/usuarios')
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    clear () {
      this.$v.$reset()
      this.codigoDeObra = ''
      this.tipoDeObra = null
      this.nombreDeObra = ''
      this.fechaDeInicioDeObra = null
      this.fechaDeConclusionDeObra = null
      this.descripcionDeObra = ''
      this.latitudDeObra = ''
      this.longitudDeObra = ''
    },
    cancel () {
      console.log('cancel')
    }
  },
  computed: {
    documentoErrors () {
      const errors = []
      if (!this.$v.documento.$dirty) return errors
      !this.$v.documento.required && errors.push('Documento es requerido.')
      return errors
    },
    tipoDeUsuarioErrors () {
      const errors = []
      if (!this.$v.tipoDeUsuario.$dirty) return errors
      !this.$v.tipoDeUsuario.required && errors.push('Tipo de Obra es requerido.')
      return errors
    }
  },
  created () {
  }
}
</script>