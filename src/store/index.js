import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import config from '../config'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layout: {
      title: '',
      miniVariant: false,
      clipped: false,
      color: null
    },
    codigoLinea: '',
    obraSelected: null,
    actividadSelected: null,
    tareaSelected: null,
    display: {
      obras: true,
      actividades: false,
      tareas: false,
      revisiones: false
    },
    displayObras: {
      listado: true,
      form: false,
      creacionBloque: false,
      valorProporcional: false,
      opciones: {
        informacion: true,
        actividades: false,
        galeria: false,
        formEdit: false
      }
    },
    displayActividades: {
      listado: true,
      form: false,
      creacionBloque: false,
      valorProporcional: false,
      opciones: {
        informacion: true,
        actividades: false,
        galeria: false,
        formEdit: false
      }
    },
    displayTareas: {
      listado: true,
      form: false,
      valorProporcional: false,
      opciones: {
        informacion: true,
        actividades: false,
        galeria: false
      }
    },
    menu: config.menu,
    baseURL: config.apiUrl,
    session: {
      isLoggedIn: !!localStorage.getItem('token'),
      token: localStorage.getItem('token') || '',
      username: localStorage.getItem('username') || '',
      tipoUsuario: localStorage.getItem('tipoUsuario') || '',
      ci: localStorage.getItem('ci') || '',
      nombreCompleto: localStorage.getItem('nombreCompleto') || '',
      grupo: localStorage.getItem('grupo') || ''
    }
  },
  mutations: {
    setCodigoLinea (state, payload) {
      state.codigoLinea = payload
    },
    setDisplay (state, payload) {
      state.display = payload
    },
    setDisplayObras (state, payload) {
      state.displayObras = payload
    },
    setDisplayActividades (state, payload) {
      state.displayActividades = payload
    },
    setDisplayTareas (state, payload) {
      state.displayTareas = payload
    },
    layoutMinivariant (state) {
      state.layout.miniVariant = !state.layout.miniVariant
    },
    layoutClipped (state) {
      state.layout.clipped = !state.layout.clipped
    },
    loginSuccess (state, payload) {
      // Change session values
      state.session.isLoggedIn = true
      state.session.token = payload.token
      state.session.username = payload.username
      state.session.tipoUsuario = payload.tipoUsuario
      state.session.ci = payload.ci
      state.session.nombreCompleto = payload.nombreCompleto
      state.session.idUsuario = payload.idUsuario
      // save fullname && Token in local Storage
      localStorage.setItem('token', payload.token || '')
      localStorage.setItem('username', payload.username || '')
      localStorage.setItem('tipoUsuario', payload.tipoUsuario || '')
      localStorage.setItem('ci', payload.ci || '')
      localStorage.setItem('nombreCompleto', payload.nombreCompleto || '')
      localStorage.setItem('idUsuario', payload.idUsuario || '')
      console.log('Welcome')
      router.push('/')
    },
    loginNewSuccess (state, payload) {
      console.log(payload)
      // Change session values
      state.session.isLoggedIn = true
      state.session.token = 'faketoken'
      state.session.username = payload.username
      state.session.tipoUsuario = payload.tipoUsuario
      state.session.ci = payload.ci
      state.session.nombreCompleto = payload.nombreCompleto
      state.session.grupo = payload.grupo
      // save fullname && Token in local Storage
      localStorage.setItem('token', 'faketoken' || '')
      localStorage.setItem('username', payload.username || '')
      localStorage.setItem('tipoUsuario', payload.tipoUsuario || '')
      localStorage.setItem('ci', payload.ci || '')
      localStorage.setItem('nombreCompleto', payload.nombreCompleto || '')
      localStorage.setItem('grupo', payload.grupo || '')
      console.log('Welcome')
      router.push('/')
    },
    logout (state) {
      state.session.isLoggedIn = false
      // remove localStorage
      localStorage.removeItem('username')
      localStorage.removeItem('tipoUsuario')
      localStorage.removeItem('ci')
      localStorage.removeItem('nombreCompleto')
      localStorage.removeItem('grupo')
      state.session.username = ''
      console.log('bye')
      router.push('/login')
    },
    setPageTitle (state, payload) {
      state.layout.title = payload
    },
    setPageColor (state, payload) {
      state.layout.color = payload
    },
    setObraSelected (state, payload) {
      state.obraSelected = payload
    },
    setActividadSelected (state, payload) {
      state.actividadSelected = payload
    },
    setTareaSelected (state, payload) {
      state.tareaSelected = payload
    }
  },
  getters: {
    getCodigoLinea (state) {
      return state.codigoLinea
    },
    getDisplay (state) {
      return state.display
    },
    getDisplayObras (state) {
      return state.displayObras
    },
    getDisplayActividades (state) {
      return state.displayActividades
    },
    getDisplayTareas (state) {
      return state.displayTareas
    },
    getLayout (state) {
      return state.layout
    },
    getMenu (state) {
      return state.menu
    },
    getSession (state) {
      return state.session
    },
    getObraSelected (state) {
      return state.obraSelected
    },
    getActividadSelected (state) {
      return state.actividadSelected
    },
    getTareaSelected (state) {
      return state.tareaSelected
    }
  },
  actions: {
    setCodigoLinea ({ commit, state }, values) {
      commit('setCodigoLinea', values)
    },
    setDisplay ({ commit, state }, values) {
      commit('setDisplay', values)
    },
    setDisplayObras ({ commit, state }, values) {
      commit('setDisplayObras', values)
    },
    setDisplayActividades ({ commit, state }, values) {
      commit('setDisplayActividades', values)
    },
    setDisplayTareas ({ commit, state }, values) {
      commit('setDisplayTareas', values)
    },
    checkPageTitle ({ commit, state }, name) {
      commit('setPageTitle', name)
    },
    checkPageColor ({ commit, state }, name) {
      commit('setPageColor', name)
    },
    setObraSelected ({ commit, state }, value) {
      commit('setObraSelected', value)
    },
    setActividadSelected ({ commit, state }, value) {
      commit('setActividadSelected', value)
    },
    setTareaSelected ({ commit, state }, value) {
      commit('setTareaSelected', value)
    }
  }
})

export default store
