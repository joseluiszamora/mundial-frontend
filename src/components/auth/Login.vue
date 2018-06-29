<template lang="pug">
  v-app(light)
    v-parallax(src="../../static/back.jpg", height='1000', jumbotron)
    v-dialog(:value='true', persistent, max-width='450px', v-if='showRegister')
      v-card(color='grey lighten-5', flat)
        v-toolbar.primary
          v-toolbar-title
            span#textFormLogin
              v-icon(x-large, dark) filter_tilt_shift
              | Mundial Rusia 2018
        v-card-media
          v-card-text.pt-4
            v-form(v-model='valid', ref='form', v-show='!loading')
              v-text-field(label='Usuario', v-model='name', :rules='nameRules', required)
              v-text-field(name='password', label='Contraseña*', v-model='password', v-on:keyup='keymonitor', :rules='passwordRules', :append-icon="hidePassword ? 'visibility' : 'visibility_off'", :append-icon-cb='() => (hidePassword = !hidePassword)', :type="hidePassword ? 'password' : 'text'", counter)
              v-select(label="Grupo", v-model="grupoSelected", :items="grupos", item-text="nombre", required)
              .text-xs-center
                v-btn(@click='register', :class='{ green: valid, red: !valid }', dark, large) Registrarme
                v-btn(outline='', color='primary', @click.native.stop="showRegister = false") Estoy registrado
                
            loader(v-show='loading')
    v-dialog(:value='true', persistent, max-width='450px', v-else)
      v-card(color='grey lighten-5', flat)
        v-toolbar.primary
          v-toolbar-title
            span#textFormLogin
              v-icon(x-large, dark) filter_tilt_shift
              | Mundial Rusia 2018
        v-card-media
          v-card-text.pt-4
            v-form(v-model='valid', ref='form', v-show='!loading')
              v-text-field(label='Usuario', v-model='name', :rules='nameRules', required)
              v-text-field(name='password', label='Contraseña*', v-model='password', v-on:keyup='keymonitor', :rules='passwordRules', :append-icon="hidePassword ? 'visibility' : 'visibility_off'", :append-icon-cb='() => (hidePassword = !hidePassword)', :type="hidePassword ? 'password' : 'text'", counter)
              .text-xs-center
                v-btn(@click='submit', :class='{ green: valid, red: !valid }', dark, large) Ingresar
                v-btn(outline='', color='primary', @click.native.stop="showRegister = true") Registrarme

            loader(v-show='loading')
</template>

<script>
  // import rrhhService from '@/http/rrhh.js'
  // import usuarioService from '@/http/usuario.js'
  import http from '@/http/auth'
  import httpGrupos from '@/http/grupos'
  import httpUsuario from '@/http/usuario'
  import config from '@/config'
  import loader from '../shared/Loader.vue'
  import { mapMutations } from 'vuex'

  export default {
    components: { config, loader },
    name: 'login',
    data () {
      return {
        showRegister: false,
        valid: false,
        name: '',
        password: '',
        loading: false,
        error: true,
        grupoSelected: null,
        grupos: [],
        nameRules: [
          (v) => !!v || 'Usuario es requerido',
          (v) => v && v.length >= 4 || 'Usuario debe tener al menos 4 caracteres.'
        ],
        passwordRules: [
          (v) => !!v || 'Password es requerido',
          (v) => v && v.length >= 5 || 'Password debe tener al menos 5 caracteres.'
        ],
        hidePassword: true,
        checkbox: false
      }
    },
    methods: {
      ...mapMutations(['loginNewSuccess']),
      register () {
        this.loading = true
        http.login(this.name, this.password).then(res => {
          // make request
          if (res.data.result === 1) {
            const usuario = `username=${this.name}&tipo_usuario=jugador&ci=${res.data.token.data.ci}&nombre=${res.data.token.data.nombres.toLowerCase()}&grupo=${this.grupoSelected.nombre}&baja_logica=0`
            httpUsuario.usuarioCreate(usuario).then(res => {
              this.loginNewSuccess({
                username: res.data.username,
                tipoUsuario: res.data.tipo_usuario,
                ci: res.data.ci,
                nombreCompleto: res.data.nombre,
                grupo: res.data.grupo
              })
            }, (error) => {
              console.log(error)
            })
          } else {
            this.error = true
            this.loading = false
            this.$snotify.error(res.data.msj, '')
          }
          this.loading = false
        }, (error) => {
          this.error = true
          this.loading = false
          this.$snotify.error('Datos Incorrectos, Intentelo de nuevo.', '')

          console.log(error)
        })
      },
      refreshGrupos () {
        this.loading = true
        httpGrupos.getGrupos().then(res => {
          this.grupos = res.data
          this.loading = false
        })
      },
      submit () {
        this.loading = true
        httpUsuario.getAll().then(userRes => {
          userRes.data.forEach(function (element) {
            var group = userRes.data.grupo
            // console.log(element.username)
            if (element.username === this.name) {
              http.login(this.name, this.password).then(res => {
                // make request
                if (res.data.result === 1) {
                  this.loginNewSuccess({
                    username: this.name,
                    tipoUsuario: 'jugador',
                    ci: res.data.token.data.ci,
                    nombreCompleto: res.data.token.data.nombres.toLowerCase(),
                    grupo: group
                  })
                } else {
                  this.error = true
                  this.loading = false
                  this.$snotify.error(res.data.msj, '')
                }
                this.loading = false
              }, (error) => {
                this.error = true
                this.loading = false
                this.$snotify.error('Datos Incorrectos, Intentelo de nuevo.', '')
                console.log(error)
              })
            } else {
              this.error = true
              this.loading = false
              this.$snotify.error('Usuario no existente.', '')
            }
          }, this)
        }, (error) => {
          console.log(error)
        })
        /* http.login(this.name, this.password).then(res => {
          // make request
          console.log(res.data)
          this.loginSuccess({
            token: res.data.token,
            username: res.data.nombre_usuario,
            tipoUsuario: res.data.tipo_usuario,
            ci: res.data.ci,
            nombreCompleto: res.data.nombre_completo,
            idUsuario: res.data.id_usuario
          })
          this.loading = false
        }, (error) => {
          this.error = true
          this.loading = false
          this.$snotify.error('Datos Incorrectos, Intentelo de nuevo.', '')

          console.log(error)
        }) */
      },
      keymonitor: function (event) {
        if (event.key === 'Enter') {
          this.submit()
        }
      }
    },
    created () {
      this.refreshGrupos()
      console.log(config.publicUrl)
      // si existe mensajes de error
      if (this.$route.query.message) {
        if (this.$route.query.message === 'Expired_token') {
          this.$snotify.error('La sesión expiró, Ingrese de nuevo por favor.', '')
        }
      }
    }
  }
</script>

<style scoped>
  body {
    background: #ccc;
  }
  .card--flex-toolbar {
    margin-top: -64px;
  }
  img.logo {
    height: auto;
    width: 120px;
    display: block;
    margin: 0 auto;
  }
  #textFormLogin {
    color: #fff;
  }
  .loaderContainer {
    height: 50px;
    width: 100%;
  }
  .loader {
    margin: -34px auto 0px !important;
  }
  form {
    position: relative;
  }
</style>
