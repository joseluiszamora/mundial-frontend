import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// Grupos
http.getLive = function (codigoLinea) {
  return http.get('now?language=es-ES')
}

// Save apuesta
http.saveApuesta = function (apuesta) {
  return http.post('/apuesta', apuesta)
}

// Edit apuesta
http.editApuesta = function (apuesta) {
  return http.patch('/apuesta', apuesta)
}

// Get Apuestas
http.getApuestas = function () {
  return http.get('/apuesta')
}

// Proximos
http.getProximos = function (codigoLinea) {
  return http.get('/recent/17/254645?language=es-ES')
}

export default http
