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
http.tareasActividad = function (actividad) {
  return http.get('tarea/poractividad/' + actividad)
}
http.tareasActivasActividad = function (actividad) {
  return http.get('tarea/activasPorActividad/' + actividad)
}
http.tareaCreate = function (tarea) {
  tarea += `&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('tarea/create', tarea)
}
http.rehabilitarTarea = function (idTarea) {
  let tarea = `id_tarea=${idTarea}&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('tarea/rehabilitar', tarea)
}
/* http.revisionesTarea = function (tarea) {
  return http.get('servicios/getrevisionestarea/' + tarea)
} */

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
