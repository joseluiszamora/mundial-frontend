import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiFifa,
  headers: {'content-type': 'application/json'}
})

// Grupos
http.getLive = function () {
  return http.get('live/football/now?language=es-ES')
}

// Proximos
http.getProximos = function () {
  return http.get('live/football/recent/17/254645?language=es-ES')
}

// TODOS
http.getTodos = function () {
  return http.get('calendar/matches?idSeason=254645&idCompetition=17&language=es-ES&count=100')
}

export default http
