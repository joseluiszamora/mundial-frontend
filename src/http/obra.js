import axios from 'axios'
import config from '../config'
import router from '../router'
import store from '../store'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Authorization': 'Bearer ' + store.getters.getSession.token
  }
})

// Obras
http.obrasLinea = function (linea, filters) {
  const params = `linea=${linea}&estado=${filters.estadoSelected}
  &tipodeobra=${filters.tipodeObraSelected}`
  return http.get('obra/getobras?' + params)
}
http.getValorProporcionalObra = function (codigoLinea) {
  return http.get('obra/getvalorproporcional/' + codigoLinea)
}
http.saveValorProporcionalObra = function (valorActividades) {
  const params = `valorobras=${valorActividades}`
  return http.post('/obra/valorproporcionalnuevo', params)
}
http.obraCreate = function (obra) {
  obra += `&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('/obra/create', obra)
}
http.obraEdit = function (obra) {
  obra += `&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('/obra/edit', obra)
}
http.obraDelete = function (idObra) {
  const params = `id_obra=${idObra}&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('/obra/delete', params)
}
/* http.obraInfo = function (idObra) {
  return http.get('servicios/getobrainfo/' + idObra)
}
 */

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
