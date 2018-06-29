import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiUrl,
  /* timeout: 1000, */
  headers: headers()
})

/**
 * Make headers on Request,
 * If token exist use Authorization Bearer
 * Else only application/x-www-form-urlencoded
 */
function headers () {
  let headersReturn = []
  if (localStorage.getItem('token') && localStorage.getItem('token') !== null) {
    headersReturn = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  } else {
    headersReturn = { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  return headersReturn
}

http.login = function (username, password) {
  headers()
  const params = `username=${username}&password=${password}`
  return http.post('auth/login', params)
}

http.universidades = function () {
  return http.get('/universidades')
}

export default http
