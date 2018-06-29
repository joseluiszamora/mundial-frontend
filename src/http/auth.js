import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiTeleferico,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

http.login = function (username, password) {
  const params = `username=${username}&password=${password}&imei=000`
  return http.post('login', params)
}
export default http
