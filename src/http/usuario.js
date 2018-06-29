import axios from 'axios'
import config from '../config'
import router from '../router'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    headers: {'content-type': 'application/json'}
  }
})

http.getAll = function () {
  return http.get('/jugadores')
}

http.usuarioFind = function (username) {
  return http.get('/jugadores/findOne?filter={"username":"' + username + '"}')
}

http.usuarioCreate = function (usuario) {
  return http.post('/jugadores', usuario)
}

http.encodePassword = function (password) {
  return http.get('usuario/encodepassword/' + password)
}

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
