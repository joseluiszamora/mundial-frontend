<template lang="pug">
  v-app(light)
    // v-navigation-drawer(persistent, :v-if='getLayout', :mini-variant='getLayout.miniVariant', :clipped='getLayout.clipped', v-model='drawer', enable-resize-watcher, app)
      // Sidebar Injection
      // sidebar
    v-toolbar(fixed, app, :clipped-left='getLayout.clipped', class="primary darken-4")
      // v-tooltip(right)
        v-toolbar-side-icon(@click.stop='drawer = !drawer', slot='activator', dark)
        span(v-html="drawer ? 'Ocultar Menú' : 'Mostrar Menú'")
      v-toolbar-title(style='color: #fff', v-text="getLayout.title || 'Rusia 2018'", dark)
      v-spacer
        router-link(to='/')
          v-btn(class='secondary', style='color: #fff', large) Inicio
        router-link(to='/apostar')
          v-btn(class='secondary', style='color: #fff', large) Apostar
        router-link(to='/resultados')
          v-btn(class='secondary', style='color: #fff', large) Resultados
      v-spacer
      .text-xs-center
        v-menu(offset-y)
          v-btn(slot='activator', fab, light, color, outline)
            v-avatar
              image-profile(:documento="getSession.ci || 'null'", :width="50")
          v-list
            v-list-tile
              v-list-tile-title {{ getSession.username }}
            v-list-tile(@click='logout')
              v-icon lock
              v-list-tile-title Salir
    main
      v-content
        v-parallax(src="../../static/back3.jpg", height='1000', jumbotron)
          v-container(fluid)
            v-slide-y-transition(mode='out-in')
              router-view
    v-navigation-drawer(temporary, :right='true', v-model='rightDrawer', app)
      v-list
        v-list-tile
          v-list-tile-title Historial
    v-footer(:fixed='false', app)
      span Mundial V0.5 © jzamora 2018
</template>

<script>
import Sidebar from '@/components/layout/Sidebar'
import { mapGetters, mapMutations } from 'vuex'
import ImageProfile from '@/components/shared/ImageProfile'
export default {
  components: { Sidebar, ImageProfile },
  data () {
    return {
      drawer: false,
      rightDrawer: false
    }
  },
  computed: {
    ...mapGetters(['getLayout', 'getSession'])
  },
  methods: {
    ...mapMutations(['layoutMinivariant', 'layoutClipped']),
    logout () {
      this.$store.commit('logout')
    }
  }
}
</script>

<style scoped>
  .img-circle {
    border-radius: 50%;
  }
</style>
