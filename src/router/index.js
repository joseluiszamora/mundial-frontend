import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// import Hello from '@/components/Hello'
import Dashboard from '@/components/Dashboard'
import Apostar from '@/components/Apostar'
import Resultados from '@/components/Resultados'
import Ranking from '@/components/Ranking'
import Login from '@/components/auth/Login'
import Main from '@/components/layout/Main'

Vue.use(Router)

const router = new Router({
  routes: [
    /* Routes WITHOUT Layout */
    route('/login', 'login', Login),

    /* Routes WITH Layout */
    route('/', null, Main, [
      // route('/dashboard', null, proyectoResumen),
      // route('/dashboard2', null, infoLinea),
      route('/', 'dashboard', Dashboard),
      route('/apostar', 'apostar', Apostar),
      route('/resultados', 'resultados', Resultados),
      route('/ranking', 'ranking', Ranking)
    ])
  ],
  mode: 'history'
})

/**
 * Route builder
 */
function route (path, name, component, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component
  }
}

/**
 * Check if user logged in before redirect Route
 */
router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    const session = store.state.session
    if (session.isLoggedIn && session.token !== '') {
      console.log('There is a token, resume. (' + to.path + ')')
      next()
    } else {
      console.log('Mot Logged, redirect to login Route')
      next('/login')
    }
  } else {
    console.log('Login Page')
    next()
  }

  // Change Page Title
  store.dispatch('checkPageTitle', to.name)

  // si es una linea, setear titulo y color de la pagina
  makeTitleAndColor(to.params.codigo_linea)
})

// si es una linea, setear titulo y color de la pagina
function makeTitleAndColor (destiny) {
  let newTitle = null
  let newColor = null
  if (destiny === 'linea_roja') {
    newTitle = 'Linea Roja'
    newColor = 'red'
  }
  if (destiny === 'linea_amarilla') {
    newTitle = 'Linea Amarilla'
    newColor = 'yellow'
  }
  if (destiny === 'linea_verde') {
    newTitle = 'Linea Verde'
    newColor = 'green'
  }
  if (destiny === 'linea_blanca') {
    newTitle = 'Linea Blanca'
    newColor = 'blue-grey'
  }
  if (destiny === 'linea_azul') {
    newTitle = 'Linea Azul'
    newColor = 'blue'
  }
  if (destiny === 'linea_morada') {
    newTitle = 'Linea Morada'
    newColor = 'purple'
  }
  if (destiny === 'linea_cafe') {
    newTitle = 'Linea Cafe'
    newColor = 'brown'
  }
  if (destiny === 'linea_celeste') {
    newTitle = 'Linea Celeste'
    newColor = 'light-blue'
  }
  if (destiny === 'linea_naranja') {
    newTitle = 'Linea Naranja'
    newColor = 'orange'
  }
  if (destiny === 'edificios') {
    newTitle = 'Edificios Administrativos'
    newColor = 'cyan'
  }
  store.dispatch('checkPageTitle', newTitle)
  store.dispatch('checkPageColor', newColor)
  store.dispatch('setCodigoLinea', destiny)
  return destiny
}

export default router
