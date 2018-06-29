<template>
  <v-card>
    <v-layout row wrap v-show="getDisplayObras.opciones.informacion && !getDisplayObras.opciones.formEdit">
      <v-flex class="xs7">
        <v-slide-x-transition mode="out-in">
          <v-list two-line>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title class="text-xs-center">{{ obraSelected.nombre }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="headline">
                <v-tooltip top>
                  <v-btn flat fab right absolute color="primary" style="margin-right:40px;" slot="activator" @click="editObra()">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <span>Editar {{ obraSelected.nombre }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn flat fab right absolute color="red" @click.native.stop="dialog = true" slot="activator">
                    <v-icon>remove_circle</v-icon>
                  </v-btn>
                  <span>Eliminar {{ obraSelected.nombre }}</span>
                </v-tooltip>
                <v-dialog v-model="dialog" max-width="290" persistent>
                  <v-card>
                    <v-card-title class="headline">Eliminar la Obra <b>{{ obraSelected.nombre }}</b>?</v-card-title>
                    <v-card-text>Tambien se desactivaran todas las actividades y tareas dependientes de esta obra.</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat="flat" @click.native="dialog = false">Cancelar</v-btn>
                      <v-btn color="red darken-1" flat="flat" @click="eliminarObra">Eliminar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-tile-avatar>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title>{{ obraSelected.resumen }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Avance</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="headline">
                {{ obraSelected.avance_total + '%' }}
              </v-list-tile-avatar>
            </v-list-tile>
            <v-divider></v-divider>
            
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Valor Proporcional</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar class="headline">
                {{ obraSelected.valor_proporcional + '%' }}
              </v-list-tile-avatar>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Estado</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ obraSelected.estado }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Fecha Inicio</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ obraSelected.fecha_inicio }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>

            <v-list-tile exact>
              <v-list-tile-content>
                <v-list-tile-title>Fecha Conclusión (Estimado)</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ obraSelected.fecha_fin }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
          </v-list>
        </v-slide-x-transition>
      </v-flex>
      <v-flex class="xs5">
        <v-slide-x-transition mode="out-in" style="padding: 20px 0 0;">
          <map-custom :latitud="obraSelected.latitud" :longitud="obraSelected.longitud"></map-custom>
        </v-slide-x-transition>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-show="getDisplayObras.opciones.informacion && getDisplayObras.opciones.formEdit">
      <v-flex class="md12">
        <!-- Formulario de Obras -->
        <obra-form :obraSelected="obraSelected" :action="'edit'"></obra-form>
      </v-flex>
    </v-layout>

  </v-card>
</template>

<script>
import http from '@/http/obra'
import { mapGetters } from 'vuex'
import ObraForm from '../obra/Form.vue'
import mapCustom from '../shared/MapCustom.vue'

export default {
  name: 'obraSelectedsinfo',
  components: { mapCustom, ObraForm },
  props: {
    obraSelected: { type: Object, required: true }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    eliminarObra () {
      http.obraDelete(this.obraSelected.id_obra).then(res => {
        this.$snotify.warning('Se elimino la obra ' + this.obraSelected.nombre, 'Obra eliminada')
        this.closeInfo()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    editObra () {
      let opciones = { informacion: true, actividades: false, galeria: false, formEdit: true }
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayObras', valores)
    },
    closeInfo () {
      this.$store.dispatch('setObraSelected', null)
      let valores = { obras: true, actividades: false, tareas: false, revisiones: true }
      this.$store.dispatch('setDisplay', valores)
    }
  },
  computed: {
    ...mapGetters(['getDisplayObras'])
  },
  created () {
  }
}
</script>
