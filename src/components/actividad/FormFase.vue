<template>
  <v-card class="py-2 px-5">
    <v-layout row justify-center>
      <v-flex class="xs10">
        <form>
          <v-layout row wrap>
            <v-text-field
              label="Nombre de la Actividad"
              v-model="nombreDeActividad"
              :error-messages="nombreDeActividadErrors"
              @input="$v.nombreDeActividad.$touch()"
              @blur="$v.nombreDeActividad.$touch()"
              required
            ></v-text-field>
          </v-layout>

          <v-layout row justify-space-between>
            <v-flex class="md5">
              <v-layout row>
                <v-flex class="md10">
                  <v-text-field
                    slot="activator"
                    label="Inicio de Actividad (2018-01-31)"
                    v-model="fechaDeInicio"
                    :error-messages="fechaDeInicioErrors"
                    @input="$v.fechaDeInicio.$touch()"
                    @blur="$v.fechaDeInicio.$touch()"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex class="md2">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menu"
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-btn fab dark right small 
                    slot="activator"
                    readonly
                    color="primary">
                      <v-icon dark>event</v-icon>
                    </v-btn>
                    <v-date-picker v-model="fechaDeInicio" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
            
            <v-flex class="md5">
              <v-layout row>
                <v-flex class="md10">
                  <v-text-field
                    slot="activator"
                    label="Conclusión de la Actividad (2018-01-31)"
                    v-model="fechaDeConclusion"
                    :error-messages="fechaDeConclusionErrors"
                    @input="$v.fechaDeConclusion.$touch()"
                    @blur="$v.fechaDeConclusion.$touch()"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex class="md2">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menu2"
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-btn fab dark right small 
                    slot="activator"
                    readonly
                    color="primary">
                      <v-icon dark>event</v-icon>
                    </v-btn>
                    <v-date-picker v-model="fechaDeConclusion" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-text-field
              label="Descripción"
              v-model="descripcionDeObra"
            ></v-text-field>
          </v-layout>
          
          <v-layout row justify-center>
            <v-flex class="xs6">
              <v-btn dark color="deep-orange" @click="closeForm">Cancelar <v-icon>clear</v-icon></v-btn>
              <v-btn dark color="orange" @click="clear"><v-icon>refresh</v-icon></v-btn>
            </v-flex>
            <v-flex class="xs2" v-show="this.action === 'create'">
              <v-btn dark color="green" @click="submit">Guardar <v-icon>save</v-icon></v-btn>
            </v-flex>
            <v-flex class="xs2" v-show="this.action === 'edit' && this.actividadSelected != null">
              <v-btn dark color="green" @click="submitEdit">Editar <v-icon>edit</v-icon></v-btn>
            </v-flex>
          </v-layout>
        </form>    
      </v-flex>
    </v-layout>

  </v-card>
</template>

<script>
import http from '@/http/actividad'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    actividadSelected: { type: Object, required: false },
    action: { type: String, required: true }
  },
  mixins: [validationMixin],
  validations: {
    nombreDeActividad: { required },
    fechaDeInicio: { required },
    fechaDeConclusion: { required }
  },
  data () {
    return {
      nombreDeActividad: '',
      fechaDeInicio: null,
      fechaDeConclusion: null,
      descripcionDeObra: '',
      date: null,
      date2: null,
      menu: false,
      menu2: false,
      dialog2: false
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        // Make post Values
        const actividad = `fase=fase2&nombre=${this.nombreDeActividad}&descripcion=${this.descripcionDeObra}&fecha_inicio=${this.fechaDeInicio}&fecha_fin=${this.fechaDeConclusion}`
        // Save Actividad
        this.save(actividad)
      }
    },
    submitEdit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        // Make post Values
        const actividad = `id_actividad=${this.actividadSelected.id_actividad}&nombre=${this.nombreDeActividad}&descripcion=${this.descripcionDeObra}&fecha_inicio=${this.fechaDeInicio}&fecha_fin=${this.fechaDeConclusion}`
        // Edit
        this.edit(actividad)
      }
    },
    save (actividad) {
      http.actividadFaseCreate(actividad).then(res => {
        console.log(res)
        this.closeForm()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    edit (actividad) {
      http.actividadEdit(actividad).then(res => {
        this.$snotify.success('Se edito la actividad ' + this.nombreDeActividad + ' de manera correcta.', '')
        this.closeForm()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    clear () {
      this.$v.$reset()
      this.nombreDeActividad = ''
      this.fechaDeInicio = null
      this.fechaDeConclusion = null
      this.descripcionDeObra = ''
    },
    closeForm () {
      let opciones = { informacion: true, actividades: false, galeria: false, formEdit: false }
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayActividades', valores)
    }
  },
  computed: {
    ...mapGetters(['getObraSelected']),
    nombreDeActividadErrors () {
      const errors = []
      if (!this.$v.nombreDeActividad.$dirty) return errors
      !this.$v.nombreDeActividad.required && errors.push('Nombre de Actividad es requerido.')
      return errors
    },
    fechaDeInicioErrors () {
      const errors = []
      if (!this.$v.fechaDeInicio.$dirty) return errors
      !this.$v.fechaDeInicio.required && errors.push('Fecha de Inicio es requerido.')
      return errors
    },
    fechaDeConclusionErrors () {
      const errors = []
      if (!this.$v.fechaDeConclusion.$dirty) return errors
      !this.$v.fechaDeConclusion.required && errors.push('Fecha de Conclusión es requerido.')
      return errors
    }
  },
  created () {
    if (this.action === 'edit' && this.actividadSelected != null) {
      this.nombreDeActividad = this.actividadSelected.nombre
      this.fechaDeInicio = this.actividadSelected.fecha_inicio
      this.fechaDeConclusion = this.actividadSelected.fecha_fin
      this.descripcionDeObra = this.actividadSelected.descripcion
    }
  }
}
</script>