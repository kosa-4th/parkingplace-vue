<template>
  <div class="owner-container">
    <owner-menu-cmp></owner-menu-cmp>
    <router-view></router-view>
  </div>
</template>

<script>
import OwnerMenuCmp from './OwnerMenuCmp.vue'
export default {
  components: { OwnerMenuCmp }
}
</script>

<style scoped>
.owner-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: whitesmoke; */
  display: flex;
  flex-direction: column;
  font-size: 17px;
}
</style>
