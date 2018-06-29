<template lang="pug">
  v-card(color='grey lighten-4', flat)
    v-card-text
      v-toolbar(color='primary')
        v-toolbar-title.white--text Seleccione Tarea
      v-container(fluid)
        v-layout(row, wrap)
          v-flex(xs12, sm2)
            v-select.px-2(label='Linea', :items='lineas', v-model='lineaSelected', item-text='nombre', item-value='codigo_linea', autocomplete)
          v-flex(xs12, sm3)
            v-select.px-2(label='Obra', :items='obras', v-model='obraSelected', item-text='nombre', item-value='id_obra', autocomplete)
          v-flex(xs12, sm3)
            v-select.px-2(label='Actividad', :items='actividades', v-model='actividadSelected', item-text='nombre', item-value='id_actividad', autocomplete)
          v-flex(xs12, sm4)
            v-select.px-2(label='Tarea', :items='tareas', v-model='tareaSelected', item-text='nombre', autocomplete)
        v-layout(row, justify-center, v-if="tareaSelected != null")
          // v-flex(xs12, sm8) {{tareaSelected }}
          v-flex(xs4)
            v-list(two-line)
              v-list-tile(avatar)
                v-list-tile-content
                  v-list-tile-title Tarea
                  v-list-tile-sub-title {{ tareaSelected.nombre }}
          v-flex(xs3)
            v-list(two-line)
              v-list-tile(avatar)
                v-list-tile-content
                  v-list-tile-title Creado en:
                  v-list-tile-sub-title {{ tareaSelected.fecha_creacion }}
          v-flex(xs2)
            v-list(two-line)
              v-list-tile(avatar)
                v-list-tile-content
                  v-list-tile-title Estado
                  v-list-tile-sub-title
                    v-tooltip(top, v-if="formConcluida")
                      div(class="title", slot='activator')
                        <v-icon small color="orange darken-2">warning</v-icon> concluido
                      span Al marcar esta tarea como concluida, no podra realizar mas revisiones en la misma.
                    span(class="title", v-if="!formConcluida") creado
                  // creado, concluido
        v-layout(row, justify-center)
          v-btn(dark, color='orange', @click='clear')
            v-icon refresh
          v-btn(dark, color='green', @click='submit' v-show="validate")
            | Guardar 
            v-icon save
    v-card-text
      v-container(fluid)
        v-layout(row, wrap)
          v-flex(xs12, sm6, px-2)
            v-toolbar(color='primary')
              v-toolbar-title.white--text Datos
              v-spacer
              v-checkbox(label='Tarea Concluida?', v-model='formConcluida', dark, style="margin-top: 25px;")
            v-text-field(label='Descripción', v-model='formDesc', multi-line)
          v-flex(xs12, sm6)
            v-toolbar(color='primary')
              v-badge(color="cyan")
                span(slot='badge') {{ imagesRevision.length }}
                v-toolbar-title.white--text Imagenes
              v-spacer
              v-tooltip(top)
                v-btn(icon dark, @click.stop='imagesGrid = false', v-show="imagesGrid", slot='activator')
                  v-icon menu
                span Ver listado y agregar comentarios
              v-tooltip(top)
                v-btn(icon dark, @click.stop='imagesGrid = true', v-show="!imagesGrid", slot='activator')
                  v-icon apps
                span Ver imagenes
            v-container(fluid, v-show="imagesGrid")
              v-layout(row, wrap)
                v-flex(xs12)
                  #drop(@drop='handleDrop', @click='handleDrop', @dragover='handleDragover', @dragenter='handleDragover') Click o Arrastre Aqui (jpg, png, jpeg)
                    input(type='file', @change='onFileChange', multiple)
                v-flex(xs4 px-1 py-1, v-for='imagen in imagesRevision' :key="imagen.id")
                  v-card(flat, tile)
                    v-card-media(height='150px')
                      img(width="100%", height="100%", v-img="{ title: imagen.title }", :src="imagen.file")
                      v-btn(absolute small dark fab top right, color='red', style='margin: 20px -10px 0px 0px;', @click="removeElement(imagen.id)")
                        v-icon close
            v-container(fluid, v-show="!imagesGrid")
              v-layout(row, wrap)
                v-flex(xs12)
                  v-list(two-line, v-for='imagen in imagesRevision' :key="imagen.id")
                    v-list-tile(avatar)
                      v-list-tile-avatar
                        img(:src="imagen.file", height="60px")
                      v-list-tile-content
                        v-text-field(label='Comentario', v-model='imagen.title', multi-line)
                    v-divider

    v-dialog(v-model='dialogConfirm.visible', max-width='290', persistent='')
      v-card
        v-card-title.headline {{ dialogConfirm.title }}
        loader(:message="dialogConfirm.message", v-show="!dialogConfirm.actions")
        v-card-actions(v-show="dialogConfirm.actions")
          v-spacer
          v-btn(flat='flat', @click.native='dialogConfirm.visible = false, checkClearForm()') Ok

</template>

<script>
// import config from '@/config'
import httpLinea from '@/http/linea'
import httpObra from '@/http/obra'
import httpActividad from '@/http/actividad'
import httpTarea from '@/http/tarea'
import httpRevision from '@/http/revision'
import httpArchivo from '@/http/archivo'
import { mapGetters } from 'vuex'
import loader from '../shared/LoaderMessage.vue'
import store from '../../store'
// import { validationMixin } from 'vuelidate'
// import { required } from 'vuelidate/lib/validators'

export default {
  /* props: {
    obraSelected: { type: Object, required: false },
    action: { type: String, required: true }
  }, */
  name: 'nuevaRevision',
  components: { loader },
  data () {
    return {
      usuario: '',
      lineas: [],
      lineaSelected: null,
      obras: [],
      obraSelected: null,
      actividades: [],
      actividadSelected: null,
      tareas: [],
      tareaSelected: null,
      formConcluida: false,
      formDesc: '',
      imagesRevision: [],
      imagesGrid: true, // switch images grid & list
      dialogConfirm: {
        visible: false,
        actions: false,
        title: 'Guardando Revisión',
        message: 'guardando la revisión'
      }
    }
  },
  methods: {
    removeElement (key) { // remover imagen de la lista
      let tempArray = []
      this.imagesRevision.forEach(function (element, index) {
        if (element.id !== key) { tempArray.push(element) }
      }, this)
      this.imagesRevision = tempArray
    },
    getId () { // generar un id correlativo para la lista de imagenes
      let index = 0
      this.imagesRevision.forEach(function (element) {
        if (element.id >= index) {
          index = element.id + 1
        }
      }, this)
      return index
    },
    sendToList (base64) { // agregar un elemento a la lista
      var element = {
        id: this.getId(),
        title: '',
        file: base64
      }
      this.imagesRevision.push(element)
    },
    handleDrop (e) { // arrastrar una imagen
      if (e.dataTransfer) {
        this.loading = true
        e.stopPropagation()
        e.preventDefault()
        var files = e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          var f = files[i]
          var reader = new FileReader()
          let _this = this
          reader.onload = function (e) {
            var data = e.target.result
            _this.sendToList(data)
          }
          reader.readAsDataURL(f)
        }
      }
    },
    onFileChange (e) { // seleccionar una imagen
      this.loading = true
      var files = e.target.files || e.dataTransfer.files
      for (var i = 0; i < files.length; i++) {
        var f = files[i]
        var reader = new FileReader()
        let _this = this
        reader.onload = function (e) {
          var data = e.target.result
          _this.sendToList(data)
        }
        reader.readAsDataURL(f)
      }
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
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
    getTareasPorActividad (idActividad) {
      httpTarea.tareasActivasActividad(idActividad).then(res => {
        this.tareas = res.data
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    clear () {
      this.lineaSelected = null
      this.obraSelected = null
      this.actividadSelected = null
      this.tareaSelected = null
      this.obras = []
      this.actividades = []
      this.tareas = []
      this.formConcluida = false
      this.formDesc = ''
      this.imagesRevision = []
      this.imagesGrid = true
    },
    clearPartial () {
      this.tareaSelected = null
      this.tareas = []
      this.formConcluida = false
      this.formDesc = ''
      this.imagesRevision = []
      this.imagesGrid = true
      this.getTareasPorActividad(this.actividadSelected)
    },
    clearOnlyform () {
      this.formConcluida = false
      this.formDesc = ''
      this.imagesRevision = []
      this.imagesGrid = true
    },
    checkClearForm () { // SI tarea concluida, borrar todo, sino solo datos del form
      if (this.formConcluida) {
        this.clearPartial()
      } else {
        this.clearOnlyform()
      }
    },
    submit () {
      const revision = `id_actividad=${this.actividadSelected}&id_tarea=${this.tareaSelected.id_tarea}&id_usuario=${this.usuario}&tipo_revision=tarea&descripcion=${this.formDesc}&concluida=${this.formConcluida}`
      this.dialogConfirm.visible = true
      this.save(revision)
    },
    save (revision) {
      httpRevision.revisionCreate(revision).then(res => {
        // console.log(res.data)
        this.saveImages(res.data.revision)
      }, (error) => {
        this.showError = true
        console.log(error)
      })
    },
    saveImages (revision) {
      var imgSise = this.imagesRevision.length
      var counter = 1
      this.dialogConfirm.title = 'Guardando Imagenes'
      this.dialogConfirm.message = 'Iniciando'
      this.imagesRevision.forEach(function (element) {
        console.log(element)
        this.dialogConfirm.message = 'imagen ' + counter + ' de ' + imgSise
        const image = `base64=${element.file}&folder=${revision}&descripcion=${element.title}`
        httpArchivo.saveImage(image).then(res => {
          console.log(res.data)
        }, (error) => {
          this.showError = true
          console.log(error)
        })
        counter++
      }, this)
      this.dialogConfirm.title = 'Revisión e Imagenes guardadas'
      this.dialogConfirm.actions = true
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
    },
    actividadSelected (newVal, oldVal) {
      this.getTareasPorActividad(newVal)
    }
  },
  computed: {
    ...mapGetters(['getCodigoLinea', 'getSession']),
    validate () {
      if (this.lineaSelected != null && this.obraSelected != null && this.actividadSelected != null && this.tareaSelected != null && this.formDesc !== '') {
        return true
      }
      return false
    }
  },
  created () {
    this.getLineasPorFase('fase2')
    this.usuario = store.getters.getSession.idUsuario
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
</style>
