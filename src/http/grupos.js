import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {'content-type': 'application/json'}
})

// Grupos
http.getGrupos = function (codigoLinea) {
  return http.get('grupos')
}

export default http
