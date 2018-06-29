<template lang="pug">
  div
    v-container(fill-height)
      v-layout(align-center)
        v-flex
          h3.display-2 Avance total de la {{ titulo }}
          v-progress-circular(:size='200', :width='30', :rotate='-90', :value='value2', color='primary')
            | {{ value2 }}%
          v-spacer
          v-btn.mx-0(large, color='primary', @click="cambiarFase({ title: 'Fase 1', value: 'fase1' })", v-if="fase === 'fase2'") Ver Fase 1
          v-btn.mx-0(large, color='primary', @click="cambiarFase({ title: 'Fase 2', value: 'fase2' })", v-else) Ver Fase 2
          v-divider.my-3
    div(v-if="loadingLineas")
      loader(message="Cargando Lineas ...")
    div(v-else)
      v-toolbar(color='primary', dense)
        v-toolbar-title.white--text Lineas De la {{ titulo }}
        v-spacer
        v-tooltip(top)
          v-btn(icon, slot='activator', @click="refreshLineas")
            v-icon(dark) refresh
          span Recargar
        v-tooltip(top)
          v-menu(bottom left, slot='activator')
            v-btn(icon, slot='activator', dark)
              v-icon more_vert
            v-list
              v-list-tile(v-for='(item, i) in items', :key='i')
                v-list-tile-title {{ item.title }}
          span Cambiar Proyecto
      v-layout(column)
        v-flex(xs12, sm12)
          v-card
            v-container(fluid, grid-list-md)
              v-layout(row, wrap)
                v-flex(xs6, sm6, md4, lg3 v-for='linea in lineas', :key='linea.id_linea')
                  v-card
                    v-flex(justify-center, py-2)
                      v-avatar(size='100px', slot='activator')
                        img(:src="'/static/' + linea.imagen", alt)
                    v-card-title(primary-title)
                      v-flex
                        div(md6)
                          h3.headline.mb-0 {{ linea.nombre }}
                        div(md6)
                          h3.headline.mb-0 {{ ' (' + linea.avance + '%)' }}
                    v-flex(justify-center, py-2)
                      v-progress-linear(v-model='linea.avance')
                    v-card-actions
                      v-spacer
                      v-btn(icon)
                        v-icon favorite
                      v-btn(icon)
                        v-icon bookmark
                      v-btn(icon)
                        v-icon share
                      v-btn(icon, @click.native='linea.show = !linea.show')
                        v-icon {{ linea.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                    v-slide-y-transition
                      v-dialog(v-model='linea.show', max-width='500px', persistent)
                        v-card
                          v-card-title
                            v-avatar(size='50px', slot='activator')
                              img(:src="'/static/' + linea.imagen", alt)
                            span.headline.titulo {{ linea.nombre }}
                            v-spacer
                            v-tooltip(top, v-if="!linea.edit")
                              v-btn(icon, slot='activator', @click.native='linea.edit=true')
                                v-icon create
                              span Editar
                          div(v-if="linea.edit")
                            v-form(v-model='valid')
                              v-card-text
                                v-text-field(label='Resumen de Linea', v-model='linea.resumen', required)
                              v-list
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Fecha de Inicio: 
                                  v-list-tile-content
                                    v-menu(ref='menu', lazy, :close-on-content-click='false', v-model='linea.menu', transition='scale-transition', offset-y, full-width, :nudge-right='40', min-width='290px')
                                      v-text-field(slot='activator', v-model='linea.fecha_inicio', prepend-icon='event', readonly)
                                      v-date-picker(ref='picker', v-model='linea.fecha_inicio', @change.native="linea.menu = false", min='2014-01-01', :max='new Date().toISOString().substr(0, 10)', locale="es-419")
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Fecha de Finalización: 
                                  v-list-tile-content
                                    v-menu(ref='menu', lazy, :close-on-content-click='false', v-model='linea.menu', transition='scale-transition', offset-y, full-width, :nudge-right='40', min-width='290px')
                                      v-text-field(slot='activator', v-model='linea.fecha_conclusion', prepend-icon='event', readonly)
                                      v-date-picker(ref='picker', v-model='linea.fecha_conclusion', @change.native="linea.menu = false", min='2014-01-01', :max='new Date().toISOString().substr(0, 10)', locale="es-419")
                                v-divider()
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Longitud de la Linea: 
                                  v-list-tile-content
                                    v-text-field(label='Longitud de la Linea (en metros)', v-model='linea.longitud_linea', required)
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Numero de cabinas: 
                                  v-list-tile-content
                                    v-text-field(label='Numero de cabinas', v-model='linea.numero_de_cabinas', required)
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Numero de Torres: 
                                  v-list-tile-content
                                    v-text-field(label='Numero de Torres', v-model='linea.numero_de_torres', required)
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Tiempo total de viaje: 
                                  v-list-tile-content
                                    v-text-field(label='Tiempo total de viaje (en minutos)', v-model='linea.tiempo_de_viaje', required)
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Numero de secciones: 
                                  v-list-tile-content
                                    v-text-field(label='Numero de secciones', v-model='linea.numero_de_secciones', required)
                                v-divider
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Ingeniero Fiscal: 
                                  v-list-tile-content
                                    v-text-field(label='Ingeniero Fiscal', v-model='linea.ingeniero_fiscal', required)
                                v-list-tile
                                  v-list-tile-action(style="width: 200px") Arquitecto Fiscal: 
                                  v-list-tile-content
                                    v-text-field(label='Arquitecto Fiscal', v-model='linea.arquitecto_fiscal', required)
                          div(v-if="!linea.edit")
                            v-card-text(v-if="linea.resumen")
                              | {{ linea.resumen }}
                            v-list
                              v-list-tile
                                v-list-tile-action Fecha de Inicio: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.fecha_inicio }}
                              v-list-tile
                                v-list-tile-action Fecha de Finalización: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.fecha_conclusion }}
                              v-divider()
                              v-list-tile
                                v-list-tile-action Longitud de la Linea: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.longitud_linea }} [m]
                              v-list-tile
                                v-list-tile-action Numero de cabinas: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.numero_de_cabinas }}
                              v-list-tile
                                v-list-tile-action Numero de Torres: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.numero_de_torres }}
                              v-list-tile
                                v-list-tile-action Tiempo total de viaje: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.tiempo_de_viaje }} [min]
                              v-list-tile
                                v-list-tile-action Numero de secciones: 
                                v-list-tile-content
                                  v-list-tile-title(style="font-weight: lighter") {{ linea.numero_de_secciones }}
                              v-divider
                              v-list-tile(v-if="linea.ingeniero_fiscal")
                                v-list-tile-content
                                  v-list-tile-title {{ linea.ingeniero_fiscal }}
                                  v-list-tile-sub-title Ingeniero Fiscal
                              v-list-tile(v-if="linea.arquitecto_fiscal")
                                v-list-tile-content
                                  v-list-tile-title {{ linea.arquitecto_fiscal }}
                                  v-list-tile-sub-title Arquitecto Fiscal
                          v-card-actions
                            v-spacer
                            div(v-if="linea.edit")
                              v-btn(color='blue darken-1', flat, @click.native='guardarLinea(linea)') Guardar
                              v-btn(color='blue darken-1', flat, @click.native='linea.edit=false') Cancelar
                            v-btn(color='blue darken-1', flat, v-else, @click.native='linea.show=false') Ok
</template>

<script>
import http from '@/http/linea.js'
import loader from '../shared/LoaderMessage.vue'

export default {
  name: 'informacionLinea',
  components: { loader },
  data () {
    return {
      lineas: [],
      usuarios: [],
      interval: {},
      loadingLineas: false,
      value: 0,
      value2: 0,
      avanceTotal: 0,
      fase: 'fase2',
      titulo: 'Fase 2',
      items: [
        { title: 'Fase 1', value: 'fase1' },
        { title: 'Fase 2', value: 'fase2' }
      ],
      valid: false
    }
  },
  mounted () {
    this.getAvancePorFase(this.fase)
    this.interval = setInterval(() => {
      this.value2 = this.avanceTotal
    }, 500)
  },
  created () {
    this.refreshLineas()
  },
  methods: {
    getLineasPorFase (fase) {
      this.loadingLineas = true
      this.lineas = []
      http.getPorFase(fase).then(res => {
        res.data.data.forEach(function (element) {
          element.show = false
          element.edit = false
          this.lineas.push(element)
        }, this)
      })
      this.loadingLineas = false
    },
    getAvancePorFase (fase) {
      this.loadingLineas = true
      this.lineas = []
      http.getAvancePorFase(fase).then(res => {
        this.avanceTotal = res.data.avance
      })
      this.loadingLineas = false
    },
    guardarLinea (linea) {
      const lineaObj = `codigo_linea=${linea.codigo_linea}&resumen=${linea.resumen}&fecha_inicio=${linea.fecha_inicio}&fecha_conclusion=${linea.fecha_conclusion}&longitud_linea=${linea.longitud_linea}&numero_de_cabinas=${linea.numero_de_cabinas}&numero_de_torres=${linea.numero_de_torres}&resumen=${linea.resumen}&tiempo_de_viaje=${linea.tiempo_de_viaje}&numero_de_secciones=${linea.numero_de_secciones}&ingeniero_fiscal=${linea.ingeniero_fiscal}&arquitecto_fiscal=${linea.arquitecto_fiscal}`
      http.lineaEdit(lineaObj).then(res => {
        console.log(res.data)
        linea.edit = false
      })
    },
    cambiarFase (item) {
      this.fase = item.value
      this.titulo = item.title
      this.refreshLineas()
    },
    refreshLineas () {
      this.getLineasPorFase(this.fase)
    }
  }
}
</script>

<style lang="stylus" scoped>
  div
    text-align: center

  .progress-circular
    margin: 1rem
    font-size: 3rem
  .titulo
    text-transform: capitalize
    margin: 0 0 0 10px 
</style>