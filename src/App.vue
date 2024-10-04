<!-- 
 담당자: 양건모, 김경민, 오지수
 시작 일자: 2024.09.02
 설명 : 메인 컴포넌트
 ---------------------
 2024.09.03 양건모 | 주소가 '/'인 경우 footer 렌더링 비활성화
 2024.09.09 양건모 | footer가 렌더링/비렌더링 되지 않는 버그 수정
 -->

<script setup>
import HeaderCmp from './components/header/HeaderCmp.vue'
import ContentCmp from './components/contents/ContentCmp.vue'
import FooterCmp from './components/footer/FooterCmp.vue'
</script>

<script>
import { useRoute } from 'vue-router'

export default {
  data() {
    return {
      notMain: true,
      route: useRoute()
    }
  },
  mounted() {
    if (document.location.pathname === '/') {
      this.notMain = false
    }
  },
  watch() {}
}
</script>

<template>
  <div id="app">
    <header-cmp></header-cmp>
    <content-cmp></content-cmp>
    <footer-cmp v-if="route.path != '/'"></footer-cmp>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
