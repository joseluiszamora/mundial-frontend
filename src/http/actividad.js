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

// Actividades
/* http.obrasLinea = function (linea, filters) {
  const params = `linea=${linea}&estado=${filters.estadoSelected}
  &tipodeobra=${filters.tipodeObraSelected}`
  return http.get('obra/getobras?' + params)
} */

http.actividadesObra = function (idObra) {
  return http.get('actividad/porobra/' + idObra)
}
http.actividadesPorFase = function (fase) {
  return http.get('actividad/porfase/' + fase)
}
http.actividadCreate = function (actividad) {
  actividad += `&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('actividad/create', actividad)
}
http.actividadFaseCreate = function (actividad) {
  actividad += `&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('actividad/createfase', actividad)
}
http.getValorProporcionalActividad = function (idObra) {
  return http.get('actividad/getvalorproporcional/' + idObra)
}
http.actividadEdit = function (actividad) {
  actividad += `&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('/actividad/edit', actividad)
}
http.actividadDelete = function (idActividad) {
  const params = `id_actividad=${idActividad}&username=${store.getters.getSession.username}&idUsuario=${store.getters.getSession.idUsuario}`
  return http.post('/actividad/delete', params)
}
http.saveValorProporcionalActividad = function (valorActividades) {
  const params = `valorobras=${valorActividades}`
  return http.post('/actividad/valorproporcionalnuevo', params)
}

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  router.push('/login?message=' + error.response.data.message)
})

export default http
