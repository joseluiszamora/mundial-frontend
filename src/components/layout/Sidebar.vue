<template>
  <div>
    <div class="pa-3 text-xs-center" v-show="!getLayout.miniVariant">
      <div class="display-2">
        <img class="logo" src="../../assets/logo.png" width="100" >
      </div>

      <p><b>Sistema de Seguimiento de Proyectos</b></p>
    </div>

    <v-divider></v-divider>

    <v-list>
      <v-list-group v-for="item in getMenu" :value="item.active" v-bind:key="item.title">
        <!-- If has Submenu -->
        <v-list-tile v-if="item.items" slot="item">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <!-- Else -->
        <v-list-tile v-else slot="item" :to='item.href'>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="item.items" v-for="subItem in item.items" v-bind:key="subItem.title" :to='subItem.href'>
          <v-list-tile-content>
            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>{{ subItem.icon }}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'sidebar',
  computed: {
    ...mapGetters(['getLayout', 'getMenu'])
  }
}
</script>