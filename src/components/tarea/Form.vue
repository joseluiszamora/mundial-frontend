<template>
  <v-card class="py-2 px-5">
    
  <v-layout row justify-center>
    <v-flex class="xs10">
      <form>
        <v-layout row wrap>
          <v-text-field
            label="Nombre de la Tarea"
            v-model="nombreDeTarea"
            :error-messages="nombreDeTareaErrors"
            @input="$v.nombreDeTarea.$touch()"
            @blur="$v.nombreDeTarea.$touch()"
            required
          ></v-text-field>
        </v-layout>

        <v-layout row justify-space-between>
          <v-flex class="md10">
            <v-layout row>
              <v-flex class="md10">
                <v-text-field
                  slot="activator"
                  label="Fecha estimada de revisión (2018-01-31)"
                  v-model="fechaDeRevision"
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
                  <v-date-picker v-model="fechaDeRevision" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
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
            v-model="descripcion"
          ></v-text-field>
        </v-layout>
        <v-layout row justify-center>
          <v-flex class="xs6">
            <v-btn dark color="deep-orange" @click="closeForm">Cancelar <v-icon>clear</v-icon></v-btn>
            <v-btn dark color="orange" @click="clear"><v-icon>refresh</v-icon></v-btn>
          </v-flex>
          <v-flex class="xs2">
            <v-btn dark color="green" @click="submit">Guardar <v-icon>save</v-icon></v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>
  </v-layout>
  </v-card>
</template>

<script>
import http from '@/http/tarea'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    actividad: { type: Object, required: true }
  },
  mixins: [validationMixin],
  validations: {
    nombreDeTarea: { required }
  },
  data () {
    return {
      nombreDeTarea: '',
      fechaDeRevision: null,
      descripcion: '',
      menu: false
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        const tarea = `id_actividad=${this.actividad.id_actividad}&nombre=${this.nombreDeTarea}&descripcion=${this.descripcion}&fecha_revision=${this.fechaDeRevision}`
        this.save(tarea)
      }
    },
    save (tarea) {
      http.tareaCreate(tarea).then(res => {
        console.log(res)
        this.closeForm()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    clear () {
      this.$v.$reset()
      this.nombreDeTarea = ''
      this.fechaDeInicio = null
      this.fechaDeRevision = null
      this.descripcion = ''
    },
    closeForm () {
      let valores = { listado: true, form: false, valorProporcional: false }
      this.$store.dispatch('setDisplayTareas', valores)
    }
  },
  computed: {
    nombreDeTareaErrors () {
      const errors = []
      if (!this.$v.nombreDeTarea.$dirty) return errors
      !this.$v.nombreDeTarea.required && errors.push('Nombre de Actividad es requerido.')
      return errors
    }
  }
}
</script>