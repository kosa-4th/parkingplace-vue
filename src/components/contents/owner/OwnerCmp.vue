<template>
  <div>
    <h3>OnwerCmp</h3>
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

<style></style>
