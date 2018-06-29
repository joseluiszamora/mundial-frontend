import axios from 'axios'

var http = axios.create({
  baseURL: 'http://webservice.miteleferico.bo/',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

http.getUser = function (ci) {
  return http.get('wsrrhh/datosusuario/' + ci)
}

export default http
