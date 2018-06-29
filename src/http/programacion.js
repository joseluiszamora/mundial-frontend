import axios from 'axios'
import config from '../config'
import router from '../router'
import store from '../store'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Authorization': 'Bearer ' + store.getters.getSession.token
  }
})

http.progs = function (codigoLinea) {
  return http.get('programacion/porlinea/' + codigoLinea)
}

http.save = function (programacion) {
  return http.post('/programacion/create', programacion)
}

http.edit = function (programacion) {
  return http.post('/programacion/edit', programacion)
}

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
