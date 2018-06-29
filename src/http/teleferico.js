import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiTeleferico,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

http.getData = function (ci) {
  return http.get('datosusuario/' + ci)
}

export default http
