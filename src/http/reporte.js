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

// Tareas
http.obrasgeo = function (actividad) {
  return http.get('reporte/obrasgeo')
}

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
