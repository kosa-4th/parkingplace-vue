<!-- 
 담당자: 양건모, 김경민, 오지수
 시작 일자: 2024.09.02
 설명 : 메인 컴포넌트
 ---------------------
 2024.09.03 양건모 | 주소가 '/'인 경우 footer 렌더링 비활성화
 -->

<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import HeaderCmp from './components/header/HeaderCmp.vue'
import ContentCmp from './components/contents/ContentCmp.vue'
import FooterCmp from './components/footer/FooterCmp.vue'
</script>

<script>
export default {
  data() {
    return {
      notMain: true
    }
  },
  mounted() {
    if (document.location.pathname === '/') {
      this.notMain = false
    }
  }
}
</script>

<template>
  <div id="app">
    <header-cmp></header-cmp>
    <content-cmp></content-cmp>
    <footer-cmp v-if="notMain"></footer-cmp>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
