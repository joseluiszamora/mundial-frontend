import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// Tareas
http.saveImage = function (image) {
  return http.post('archivo/saveimage/', image)
}

http.galeriaObra = function (idObra) {
  return http.get('archivo/galeriaobra/' + idObra)
}

export default http
