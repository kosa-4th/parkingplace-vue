<template>
  <div>
    <h3>ManagerCmp</h3>
    <manager-menu-cmp></manager-menu-cmp>
    <router-view></router-view>
  </div>
</template>

<script>
import ManagerMenuCmp from './ManagerMenuCmp.vue'
export default {
  components: { ManagerMenuCmp }
}
</script>

<style></style>
