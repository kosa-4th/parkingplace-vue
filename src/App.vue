<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import HeaderCmp from './components/header/HeaderCmp.vue'
import ContentCmp from './components/contents/ContentCmp.vue'
import FooterCmp from './components/footer/FooterCmp.vue'
</script>

<template>
  <div id="app">
    <header-cmp></header-cmp>
    <content-cmp></content-cmp>
    <footer-cmp></footer-cmp>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>
