import axios from 'axios'
import config from '../config'
import store from '../store'
import router from '../router'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Authorization': 'Bearer ' + store.getters.getSession.token
  }
})

http.getPorFase = function (fase) {
  return http.get('linea/porfase/' + fase)
}

http.getAvancePorFase = function (fase) {
  return http.get('linea/avanceporfase/' + fase)
}

http.actualizarAvanceTotalPorFase = function (fase) {
  return http.get('linea/actualizaravanceporfase/' + fase)
}

http.lineaEdit = function (linea) {
  return http.post('/linea/edit', linea)
}

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
