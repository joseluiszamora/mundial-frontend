<template>
  <v-card class="py-2 px-5">
    <v-layout row justify-center>
      <v-flex class="xs10">
        <form>
          <v-layout row justify-space-between>
            <v-flex class="md6">
              <v-select
                label="Tipo de Obra"
                v-model="tipoDeObra"
                :items="tiposDeObra"
                :error-messages="tipoDeObraErrors"
                @change="$v.tipoDeObra.$touch()"
                @blur="$v.tipoDeObra.$touch()"
                required
              ></v-select>
            </v-flex>
            <v-flex class="md5">
              <v-text-field
                label="Codigo de Obra"
                v-model="codigoDeObra"
                :error-messages="codigoDeObraErrors"
                @input="$v.codigoDeObra.$touch()"
                @blur="$v.codigoDeObra.$touch()"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-text-field
              label="Nombre de la Obra"
              v-model="nombreDeObra"
              :error-messages="nombreDeObraErrors"
              @input="$v.nombreDeObra.$touch()"
              @blur="$v.nombreDeObra.$touch()"
              required
            ></v-text-field>
          </v-layout>

          <v-layout row justify-space-between>
            <v-flex class="md5">
              <v-layout row>
                <v-flex class="md10">
                  <v-text-field
                    slot="activator"
                    label="Inicio de Obra (2017-01-31)"
                    v-model="fechaDeInicioDeObra"
                    :error-messages="fechaDeInicioDeObraErrors"
                    @input="$v.fechaDeInicioDeObra.$touch()"
                    @blur="$v.fechaDeInicioDeObra.$touch()"
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
                    <v-date-picker v-model="fechaDeInicioDeObra" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                        <!--  <v-btn flat color="primary" @click="cancel">Cancelar</v-btn> -->
                          <v-btn flat color="primary" @click="save">OK</v-btn>
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
                    label="Conclusión de Obra (2017-01-31)"
                    v-model="fechaDeConclusionDeObra"
                    :error-messages="fechaDeConclusionDeObraErrors"
                    @input="$v.fechaDeConclusionDeObra.$touch()"
                    @blur="$v.fechaDeConclusionDeObra.$touch()"
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
                    <v-date-picker v-model="fechaDeConclusionDeObra" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                        <!--  <v-btn flat color="primary" @click="cancel">Cancelar</v-btn> -->
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row justify-space-between>
            <v-flex class="md5">
              <v-text-field
                label="Latitud"
                v-model="latitudDeObra"
                :error-messages="latitudDeObraErrors"
                @input="$v.latitudDeObra.$touch()"
                @blur="$v.latitudDeObra.$touch()"
                required
              ></v-text-field>
            </v-flex>
            <v-flex class="md5">
              <v-text-field
                label="Longitud"
                v-model="longitudDeObra"
                :error-messages="longitudDeObraErrors"
                @input="$v.longitudDeObra.$touch()"
                @blur="$v.longitudDeObra.$touch()"
                required
              ></v-text-field>
            </v-flex>
            <v-flex class="md1">
              <v-btn fab dark right small 
                color="primary"  @click.stop="showMap = !showMap">
                <v-icon dark>place</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex class="xs12">
              <gmap-map v-show="showMap"
                :center="center"
                :zoom="16"
                map-type-id="terrain"
                style="width: 100%; height: 300px"
              >
                <gmap-marker
                  :key="index"
                  v-for="(m, index) in markers"
                  :position="m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center=m.position"
                  @dragend="dragMarker"
                ></gmap-marker>
              </gmap-map>
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
            <v-flex class="xs2" v-show="this.action === 'edit' && this.obraSelected != null">
              <v-btn dark color="green" @click="submitEdit">Editar <v-icon>edit</v-icon></v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import http from '@/http/obra'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    obraSelected: { type: Object, required: false },
    action: { type: String, required: true }
  },
  mixins: [validationMixin],
  validations: {
    codigoDeObra: { required },
    tipoDeObra: { required },
    nombreDeObra: { required },
    fechaDeInicioDeObra: { required },
    fechaDeConclusionDeObra: { required },
    latitudDeObra: { required },
    longitudDeObra: { required }
  },
  data () {
    return {
      codigoDeObra: '',
      tipoDeObra: null,
      tiposDeObra: ['Estación', 'Torre', 'Obras Complementarias'],
      nombreDeObra: '',
      fechaDeInicioDeObra: null,
      fechaDeConclusionDeObra: null,
      descripcionDeObra: '',
      latitudDeObra: '',
      longitudDeObra: '',
      date: null,
      date2: null,
      menu: false,
      menu2: false,
      showMap: false,
      center: { lat: -16.4992945, lng: -68.1435463 },
      markers: [{
        position: { lat: -16.4992945, lng: -68.1435463 }
      }]
    }
  },
  methods: {
    // change marker position andset form values
    dragMarker (e) {
      this.latitudDeObra = e.latLng.lat()
      this.longitudDeObra = e.latLng.lng()
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        // set Tipo de Obra
        if (this.tipoDeObra === 'Estación') { this.tipoDeObra = 'estacion' }
        if (this.tipoDeObra === 'Torre') { this.tipoDeObra = 'torre' }
        if (this.tipoDeObra === 'Obras Complementarias') { this.tipoDeObra = 'obra_complementaria' }
        // Make post Values
        const obra = `codigo_linea=${this.getCodigoLinea}&codigo=${this.codigoDeObra}&tipo_de_obra=${this.tipoDeObra}&nombre=${this.nombreDeObra}&resumen=${this.descripcionDeObra}&fecha_inicio=${this.fechaDeInicioDeObra}&fecha_fin=${this.fechaDeConclusionDeObra}&latitud=${this.latitudDeObra}&longitud=${this.longitudDeObra}`
        // Save Obra
        this.save(obra)
      }
    },
    submitEdit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        // set Tipo de Obra
        if (this.tipoDeObra === 'Estación') { this.tipoDeObra = 'estacion' }
        if (this.tipoDeObra === 'Torre') { this.tipoDeObra = 'torre' }
        if (this.tipoDeObra === 'Obras Complementarias') { this.tipoDeObra = 'obra_complementaria' }
        // Make post Values
        const obra = `id_obra=${this.obraSelected.id_obra}&codigo_linea=${this.getCodigoLinea}&codigo=${this.codigoDeObra}&tipo_de_obra=${this.tipoDeObra}&nombre=${this.nombreDeObra}&resumen=${this.descripcionDeObra}&fecha_inicio=${this.fechaDeInicioDeObra}&fecha_fin=${this.fechaDeConclusionDeObra}&latitud=${this.latitudDeObra}&longitud=${this.longitudDeObra}`
        // Edit Obra
        this.edit(obra)
      }
    },
    save (obra) {
      http.obraCreate(obra).then(res => {
        this.$snotify.success('Se creo ' + this.nombreDeObra + ' de manera correcta.', 'Obra creada')
        this.clear()
        this.closeForm()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    edit (obra) {
      console.log(obra)
      http.obraEdit(obra).then(res => {
        this.$snotify.success('Se edito ' + this.nombreDeObra + ' de manera correcta.', 'Obra Modificada')
        this.closeForm()
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    clear () {
      this.$v.$reset()
      this.codigoDeObra = ''
      this.tipoDeObra = null
      this.nombreDeObra = ''
      this.fechaDeInicioDeObra = null
      this.fechaDeConclusionDeObra = null
      this.descripcionDeObra = ''
      this.latitudDeObra = ''
      this.longitudDeObra = ''
    },
    closeForm () {
      let opciones = { informacion: true, actividades: false, galeria: false, formEdit: false }
      let valores = { listado: true, form: false, valorProporcional: false, opciones: opciones }
      this.$store.dispatch('setDisplayObras', valores)
    }
  },
  computed: {
    ...mapGetters(['getCodigoLinea']),
    codigoDeObraErrors () {
      const errors = []
      if (!this.$v.codigoDeObra.$dirty) return errors
      !this.$v.codigoDeObra.required && errors.push('Codigo de Obra es requerido.')
      return errors
    },
    tipoDeObraErrors () {
      const errors = []
      if (!this.$v.tipoDeObra.$dirty) return errors
      !this.$v.tipoDeObra.required && errors.push('Tipo de Obra es requerido.')
      return errors
    },
    nombreDeObraErrors () {
      const errors = []
      if (!this.$v.nombreDeObra.$dirty) return errors
      !this.$v.nombreDeObra.required && errors.push('Nombre de Obra es requerido.')
      return errors
    },
    fechaDeInicioDeObraErrors () {
      const errors = []
      if (!this.$v.fechaDeInicioDeObra.$dirty) return errors
      !this.$v.fechaDeInicioDeObra.required && errors.push('Fecha de Inicio de Obra es requerido.')
      return errors
    },
    fechaDeConclusionDeObraErrors () {
      const errors = []
      if (!this.$v.fechaDeConclusionDeObra.$dirty) return errors
      !this.$v.fechaDeConclusionDeObra.required && errors.push('Fecha de Conclusión de Obra es requerido.')
      return errors
    },
    latitudDeObraErrors () {
      const errors = []
      if (!this.$v.latitudDeObra.$dirty) return errors
      !this.$v.latitudDeObra.required && errors.push('Latitud geografica es requerido.')
      return errors
    },
    longitudDeObraErrors () {
      const errors = []
      if (!this.$v.longitudDeObra.$dirty) return errors
      !this.$v.longitudDeObra.required && errors.push('Longitud geografica requerido.')
      return errors
    }
  },
  created () {
    if (this.action === 'edit' && this.obraSelected != null) {
      this.codigoDeObra = this.obraSelected.codigo
      this.nombreDeObra = this.obraSelected.nombre
      this.fechaDeInicioDeObra = this.obraSelected.fecha_inicio
      this.fechaDeConclusionDeObra = this.obraSelected.fecha_fin
      this.descripcionDeObra = this.obraSelected.resumen
      this.latitudDeObra = this.obraSelected.latitud
      this.longitudDeObra = this.obraSelected.longitud
      if (this.obraSelected.tipo_de_obra === 'estacion') { this.tipoDeObra = this.tiposDeObra[0] }
      if (this.obraSelected.tipo_de_obra === 'torre') { this.tipoDeObra = this.tiposDeObra[1] }
      if (this.obraSelected.tipo_de_obra === 'obra_complementaria') { this.tipoDeObra = this.tiposDeObra[2] }
    }
  }
}
</script>