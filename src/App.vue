<template>
  <div>
    <vue-snotify></vue-snotify>
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
    // this.$http.get('/users').then(({data}) => console.log(data))
  }
}
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
