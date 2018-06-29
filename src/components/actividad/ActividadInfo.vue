<template>
  <v-card>
    <v-layout row wrap v-show="getDisplayActividades.opciones.informacion && !getDisplayActividades.opciones.formEdit">
      <v-flex class="md12">
        <v-slide-x-transition mode="out-in">
          <v-list two-line>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title class="text-xs-center">{{ actividadSelected.nombre }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="headline">
                <v-tooltip top>
                  <v-btn flat fab right absolute color="primary" style="margin-right:40px;" slot="activator" @click="editActividad()">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <span>Editar {{ actividadSelected.nombre }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn flat fab right absolute color="red" @click.native.stop="dialog = true" slot="activator">
                    <v-icon>remove_circle</v-icon>
                  </v-btn>
                  <span>Eliminar {{ actividadSelected.nombre }}</span>
                </v-tooltip>
                <v-dialog v-model="dialog" max-width="290" persistent>
                  <v-card>
                    <v-card-title class="headline">Eliminar la Actividad <b>{{ actividadSelected.nombre }}</b>?</v-card-title>
                    <v-card-text>Tambien se desactivaran todas las tareas dependientes de esta actividad.</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat="flat" @click.native="dialog = false">Cancelar</v-btn>
                      <v-btn color="red darken-1" flat="flat" @click="eliminarActividad">Eliminar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-tile-avatar>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>{{ actividadSelected.descripcion }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Avance</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="headline">
                {{ actividadSelected.avance + '%' }}
              </v-list-tile-avatar>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Valor Proporcional</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="headline">
                {{ actividadSelected.valor_proporcional + '%' }}
              </v-list-tile-avatar>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Fecha Inicio</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ actividadSelected.fecha_inicio }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Fecha Conclusión (Estimado)</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ actividadSelected.fecha_fin }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-slide-x-transition>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-show="getDisplayActividades.opciones.informacion && getDisplayActividades.opciones.formEdit">
      <v-flex class="md12">
        <!-- Formulario de Obras -->
        <actividad-form :actividadSelected="actividadSelected" :action="'edit'"></actividad-form>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import http from '@/http/actividad'
import { mapGetters } from 'vuex'
import actividadForm from '../actividad/Form.vue'
export default {
  name: 'actividadInfo',
  props: {
    actividadSelected: { type: Object, required: true }
  },
  components: { actividadForm },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    eliminarActividad () {
      http.actividadDelete(this.actividadSelected.id_actividad).then(res => {
        this.$snotify.warning('Se elimino la actividad ' + this.actividadSelected.nombre, '')
        this.closeInfo()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    editActividad () {
      let opciones = { informacion: true, actividades: false, galeria: false, formEdit: true }
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayActividades', valores)
    },
    closeInfo () {
      this.$store.dispatch('setActividadSelected', null)
      let valoresDisplay = { obras: false, actividades: true, tareas: false, revisiones: false }
      this.$store.dispatch('setDisplay', valoresDisplay)

      let opciones = { informacion: true, actividades: false, galeria: false, formEdit: false }
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayActividades', valores)
    }
  },
  computed: {
    ...mapGetters(['getDisplayActividades'])
  }
}
</script>
