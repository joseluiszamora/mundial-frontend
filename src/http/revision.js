import axios from 'axios'
import config from '../config'
import store from '../store'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Authorization': 'Bearer ' + store.getters.getSession.token
  }
})

// Tareas
http.revisionesTarea = function (tarea) {
  return http.get('revision/portarea/' + tarea)
}
http.revisionCreate = function (revision) {
  return http.post('revision/create', revision)
}
http.getAll = function (filtered) {
  const params = `linea=${filtered.linea}&obra=${filtered.obra}&actividad=${filtered.actividad}&limite=${filtered.limite}`

  return http.get('revision/listado?' + params)
}

export default http
