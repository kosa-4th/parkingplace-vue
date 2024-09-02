<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
export default {}
</script>

<style>
main {
  flex: 1;
  padding-top: 70px; /* 헤더 높이만큼 패딩 추가 */
  padding-bottom: 70px; /* 푸터 높이만큼 패딩 추가 */
}
</style>
