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
  margin: auto;
  margin-top: 50px; /* 헤더 높이만큼 마진 추가 */
}

@media (orientation: landscape) {
  main {
    width: 1200px;
  }
}

@media (orientation: portrait) {
  main {
    width: 100%;
  }
}
</style>
