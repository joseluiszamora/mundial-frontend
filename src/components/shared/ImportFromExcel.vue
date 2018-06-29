<template lang="pug">
  v-layout(row, wrap)
    v-flex(xs12)
      v-stepper(v-model='e1')
        v-stepper-header
          v-stepper-step(step='1', :complete='e1 > 1') Tipo
          v-divider
          v-stepper-step(step='2', :complete='e1 > 2') Seleccione
          v-divider
          v-stepper-step(step='3', :complete='e1 > 3') Archivo
          v-divider
          v-stepper-step(step='4') Guardar
        v-stepper-items
          /////////////// STEP 1
          v-stepper-content(step='1')
            v-container(fluid, grid-list-xl)
              .headline.text-sm-center Seleccione el tipo de datos que contiene el archivo
              v-layout(row, justify-space-around)
                v-flex(xs3)
                  v-radio-group(v-model='radioSelected', :mandatory='false')
                    v-radio(label='Obras', value='obras')
                    v-radio(label='Actividades', value='actividades')
                    v-radio(label='Tareas', value='tareas')
            v-btn(color='primary', @click.native='e1 = 2', v-if="radioSelected != null") Siguiente
            v-tooltip(top, v-if="radioSelected == null")
              v-btn(disabled, slot='activator') Siguiente
              span Debe seleccionar una opción
            v-btn(flat, @click="cancelar") Cancelar
          /////////////// STEP 2
          v-stepper-content(step='2')
            v-container(fluid, grid-list-xl)
              .headline.text-sm-center Seleccione donde agregar {{ radioSelected }}
              v-layout(row, justify-space-around)
                v-flex(xs12, sm4)
                  v-select.px-2(label='Linea', :items='lineas', v-model='lineaSelected', item-text='nombre', item-value='codigo_linea', autocomplete)
                v-flex(xs12, sm4, v-if="radioSelected === 'actividades' || radioSelected === 'tareas'")
                  v-select.px-2(label='Obra', :items='obras', v-model='obraSelected', item-text='nombre', item-value='id_obra', autocomplete)
                v-flex(xs12, sm4, v-if="radioSelected === 'tareas'")
                  v-select.px-2(label='Actividad', :items='actividades', v-model='actividadSelected', item-text='nombre', item-value='id_actividad', autocomplete)
            v-btn(color='primary', @click.native='e1 = 3') Siguiente
            v-btn(flat, @click="cancelar") Cancelar
          /////////////// STEP 3
          v-stepper-content(step='3')
            v-container(fluid, grid-list-xl)
              .headline.text-sm-center Seleccione el archivo
              v-layout(row, justify-space-around)
                v-flex(xs8)
                  v-card
                    #drop(@drop='handleDrop', @click='handleDrop', @dragover='handleDragover', @dragenter='handleDragover')
                      | {{ titleLoad }}
                      input(type='file', @change='onFileChange')
              v-layout(row, justify-space-around)
                v-flex(xs2)
                  v-tooltip(top)
                    v-btn(slot='activator', dark, color='orange', @click='cancelFile')
                      v-icon refresh
                    span Cambiar archivo
            v-btn(color='primary', @click.native='e1 = 4', v-if="items.length > 0") Siguiente
            v-tooltip(top, v-if="items.length <= 0")
              v-btn(disabled, slot='activator') Siguiente
              span Debe seleccionar un archivo con datos validos
            v-btn(flat, @click="cancelar") Cancelar
          /////////////// STEP 4  
          v-stepper-content(step='4')
            v-container(fluid, grid-list-xl)
              v-layout(row, justify-space-around)
                v-flex(xs12)
                  v-card
                    loader(v-show='loading')
                    v-data-table.elevation-1(v-bind:headers='headerObras', :items='items', v-show='!loading && items.length > 0')
                      template(slot='items', scope='props')
                        v-btn(flat, icon, color='red', style='width:25px;', @click='removeElement(props.item)')
                          v-icon close
                        td
                          v-text-field(style='width:70px;margin:0 auto;', v-model='props.item.tipo_de_obra')
                        td
                          v-text-field(style='width:100px;margin:0 auto;', v-model='props.item.codigo_de_obra')
                        td
                          v-text-field(v-model='props.item.nombre_de_obra')
                        td
                          v-text-field(style='width:80px;margin:0 auto;', v-model='props.item.fecha_de_inicio')
                        td
                          v-text-field(style='width:80px;margin:0 auto;', v-model='props.item.fecha_de_conclusion')
                        td
                          v-text-field(style='width:140px;margin:0 auto;', v-model='props.item.latitud')
                        td
                          v-text-field(style='width:140px;margin:0 auto;', v-model='props.item.longitud')
                        td
                          v-text-field(v-model='props.item.descripcion')
            v-btn(color='primary', @click="saveAll") Guardar
            v-btn(flat, @click="cancelar") Cancelar
</template>

<script>
  import XLSX from 'xlsx'
  // import http from '@/http'
  import httpLinea from '@/http/linea'
  import httpObra from '@/http/obra'
  import httpActividad from '@/http/actividad'
  import Loader from '../shared/Loader.vue'
  export default {
    name: 'tarjetasBloque',
    components: { XLSX, Loader },
    data () {
      return {
        e1: 1,
        radioSelected: null,
        loading: true,
        titleLoad: 'Click o Arrastre Aqui (xls, xlsx, csv, ods)',
        items: [],
        headerObras: [
          { text: '', align: 'center', sortable: false },
          { text: 'Tipo de Obra', align: 'center', sortable: false },
          { text: 'Código de Obra', align: 'center', sortable: false },
          { text: 'Nombre de Obra', align: 'center', sortable: false },
          { text: 'Fecha de Inicio', align: 'center', sortable: false },
          { text: 'Fecha de Conclusión', align: 'center', sortable: false },
          { text: 'Latitud', align: 'center', sortable: false },
          { text: 'Longitud', align: 'center', sortable: false },
          { text: 'Descripción', align: 'center', sortable: false }
        ],
        headerActividades: [
          { text: '', align: 'center', sortable: false },
          { text: 'Nombre de Actividad', align: 'center', sortable: false },
          { text: 'Fecha de Inicio', align: 'center', sortable: false },
          { text: 'Fecha de Conclusión', align: 'center', sortable: false },
          { text: 'Descripción', align: 'center', sortable: false }
        ],
        headerTareas: [
          { text: '', align: 'center', sortable: false },
          { text: 'Nombre de Tarea', align: 'center', sortable: false },
          { text: 'Fecha Estimada de Revisión', align: 'center', sortable: false },
          { text: 'Descripción', align: 'center', sortable: false }
        ],
        lineas: [],
        lineaSelected: null,
        obras: [],
        obraSelected: null,
        actividades: [],
        actividadSelected: null
      }
    },
    computed: {
    },
    methods: {
      cancelar () {
        this.e1 = 1
        this.radioSelected = null
      },
      validateFile (f) { // Check if is a valid file
        let extension = f.name.split('.').pop()
        if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
          var reader = new FileReader()
          this.titleLoad = f.name
          let main = this
          reader.onload = function (e) {
            var results
            var data = e.target.result
            var fixedData = main.fixdata(data)
            var workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
            var firstSheetName = workbook.SheetNames[0]
            var worksheet = workbook.Sheets[firstSheetName]
            main.headers = main.get_header_row(worksheet)
            results = XLSX.utils.sheet_to_json(worksheet)

            if (results.length <= 0) {
              main.$snotify.error('El archivo no contiene registros.', 'Archivo invalido')
            } else {
              main.$snotify.success('El archivo contiene ' + results.length + ' registros.', 'Archivo Valido')
            }
          }
          reader.readAsArrayBuffer(f)
          return true
        } else {
          this.$snotify.error('Debe cargar un archivo con una extensión valida.', 'Archivo invalido')
          this.cancelFile()
          return false
        }
      },
      processFile (f) {
        console.log(f)
        var reader = new FileReader()
        // var name = f.name
        this.titleLoad = f.name
        let main = this
        reader.onload = function (e) {
          var results
          var data = e.target.result
          var fixedData = main.fixdata(data)
          var workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
          var firstSheetName = workbook.SheetNames[0]
          var worksheet = workbook.Sheets[firstSheetName]
          main.headers = main.get_header_row(worksheet)
          results = XLSX.utils.sheet_to_json(worksheet)
          console.log(results)
          main.tickets = results
          main.convertToObject(main.tickets)
        }
        reader.readAsArrayBuffer(f)
      },
      handleDrop (e) {
        if (e.dataTransfer) {
          this.loading = true
          e.stopPropagation()
          e.preventDefault()
          var files = e.dataTransfer.files
          for (var i = 0; i < files.length; i++) {
            var f = files[i]
            if (this.validateFile(f)) {
              this.processFile(f)
            }
          }
          this.loading = false
        }
      },
      handleDragover (e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      onFileChange (e) {
        this.loading = true
        var files = e.target.files || e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          var f = files[i]
          if (this.validateFile(f)) {
            this.processFile(f)
          }
        }
        this.loading = false
      },
      cancelFile () {
        this.titleLoad = 'Click o Arrastre Aqui (xls, xlsx, csv, ods)'
        // this.headers = []
        this.items = []
      },
      fixdata (data) {
        var o = ''
        var l = 0
        var w = 10240
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },
      get_header_row (sheet) {
        var headers = []
        var range = XLSX.utils.decode_range(sheet['!ref'])
        var R = range.s.r // start in the first row
        for (var C = range.s.c; C <= range.e.c; ++C) { // walk every column in the range
          var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] // find the cell in the first row
          var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },
      convertToObject (object) {
        object.forEach(function (element) {
          this.addObraObj(this.createObra(element))
        }, this)
      },
      addObraObj (tarjeta) {
        this.items.push(tarjeta)
      },
      createObra (tarjetaObj) {
        return {
          id: this.getId(),
          tipo_de_obra: this.cleanString(tarjetaObj.tipo_de_obra),
          codigo_de_obra: this.cleanString(tarjetaObj.codigo_de_obra),
          nombre_de_obra: this.cleanString(tarjetaObj.nombre_de_obra),
          fecha_de_inicio: this.cleanString(tarjetaObj.fecha_de_inicio),
          fecha_de_conclusion: this.cleanString(tarjetaObj.fecha_de_conclusion),
          latitud: tarjetaObj.latitud,
          longitud: tarjetaObj.longitud,
          descripcion: this.cleanString(tarjetaObj.descripcion)
        }
      },
      getId () { // da un id para nueva obra
        let index = 1
        this.items.forEach(function (element) {
          if (element.id >= index) {
            index = element.id + 1
          }
        }, this)
        return index
      },
      cleanString (string) {
        if (string) {
          string = string.toLowerCase()
          string = string.trim()
          string = string.replace('ã', 'á')
          string = string.replace('ã¡', 'á')
          string = string.replace('ã©', 'é')
          string = string.replace('ã', 'í')
          string = string.replace('ã', 'í')
          string = string.replace('ã­', 'í')
          string = string.replace('íâ­', 'í')
          string = string.replace('íâ', 'í')
          string = string.replace('íâ', 'í')
          string = string.replace('ã³', 'ó')
          string = string.replace('ã', 'ó')
          string = string.replace('ã³', 'ú')
          string = string.replace('ã±', 'ñ')
          string = string.replace('ã', 'ñ')
          string = string.replace('ã', 'ñ')
          string = string.replace('ã', 'ñ')
          string = string.replace('Ã', 'Á')
          string = string.replace('Ã¡', 'á')
          string = string.replace('Ã‰', 'É')
          string = string.replace('Ã©', 'é')
          string = string.replace('Ã', 'Í')
          string = string.replace('Ã­', 'í')
          string = string.replace('Ã“', 'Ó')
          string = string.replace('Ã³', 'ó')
          string = string.replace('Ãš', 'Ú')
          string = string.replace('Ãº', 'ú')
          string = string.replace('Ã‘', 'Ñ')
          string = string.replace('Ã±', 'ñ')
          string = string.replace('Â¿', '¿')
        }
        return string
      },
      removeElement (key) {
        let tempArray = []
        this.items.forEach(function (element, index) {
          if (element.id !== key.id) { tempArray.push(element) }
        }, this)
        this.items = tempArray
      },
      getLineasPorFase (fase) {
        httpLinea.getPorFase(fase).then(res => {
          this.lineas = res.data.data
        }, (error) => {
          console.log(error)
        })
      },
      getObrasPorLinea (codigoLinea) {
        httpObra.obrasLinea(codigoLinea, { estadoSelected: '', tipodeObraSelected: '' }).then(res => {
          this.obras = res.data
        }, (error) => {
          console.log(error)
        })
      },
      getActividadesPorObra (idObra) {
        httpActividad.actividadesObra(idObra).then(res => {
          this.actividades = res.data
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      },
      saveAll () {
        var total = this.items.length
        var counter = 0
        this.items.forEach(function (element, index) {
          if (this.validate(element)) {
            this.removeElement(element)
            counter++
            const obra = `codigo_linea=${this.lineaSelected}&codigo=${element.codigo_de_obra}&tipo_de_obra=${element.tipo_de_obra}&nombre=${element.nombre_de_obra}&resumen=${element.descripcion}&fecha_inicio=${element.fecha_de_inicio}&fecha_fin=${element.fecha_de_conclusion}&latitud=${element.latitud}&longitud=${element.longitud}`
            console.log(obra)
            if (this.saveObra(obra)) {
              this.removeElement(element)
            }
          }
        }, this)
        console.log('Guardados: ' + counter)
        console.log('Fallados: ' + (total - counter))

        if (total === counter) {
          this.$snotify.success('Se guardarón correctamente ' + counter + ' tarjetas.', '')
          this.cancelFile()
          this.cancelar()
        } else {
          this.$snotify.warning('Se guardarón correctamente ' + counter + ' tarjetas. Fallarón ' + (total - counter) + ' tarjetas, revise los datos de las mismas', '')
        }
        // let main = this
        /* this.$dialog.confirm(message, options)
        .then(function (dialog) {
          console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
          dialog.close()
        }) */
      },
      saveObra (obj) {
        httpObra.obraCreate(obj).then(res => {
          return true
        }, (error) => {
          this.error = true
          console.log(error)
        })
        return false
      },
      validate (tarjeta) { // verifica si los datos de la tarjeta estan completos
        /* if (tarjeta.nombres.trim() !== '' &&
        tarjeta.apellidos.trim() !== '' &&
        tarjeta.documento.trim() !== '' &&
        tarjeta.exp.trim() !== '' &&
        tarjeta.fecha_nacimiento.trim() !== '' &&
        tarjeta.imagen_usuario.trim() !== '' &&
        tarjeta.correo_electronico.trim() !== '' &&
        tarjeta.codigo_estudiante.trim() !== '' &&
        tarjeta.carrera.trim() !== '' &&
        tarjeta.sexo.trim() !== '' &&
        tarjeta.sigla.trim() !== '' &&
        tarjeta.tipo_usuario.trim() !== '' &&
        tarjeta.universidad.trim() !== '') {
          return true
        }
        return false */
        return true
      }
    },
    watch: {
      lineaSelected (newVal, oldVal) {
        this.obraSelected = null
        this.actividadSelected = null
        this.getObrasPorLinea(newVal)
      },
      obraSelected (newVal, oldVal) {
        this.getActividadesPorObra(newVal)
      }
    },
    created () {
      this.getLineasPorFase('fase2')
    }
  }
</script>

<style scoped>
  #drop {
    border: 2px dashed #bbb;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold, "Vollkorn";
    color: #bbb;
    position: relative;
  }
  #drop input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  #loadTable {
    position: relative;
  }
  #loadTable thead {
    height: 50px;
  }
  #loadTable thead>tr>th {
    padding: 10px 0;
  }
  #loadTable tbody>tr>td {
    border: 4px solid #fff;
    width: 170px;
    padding: 5px;
    background: #f8f8f8;
    text-align: center;
  }
</style>