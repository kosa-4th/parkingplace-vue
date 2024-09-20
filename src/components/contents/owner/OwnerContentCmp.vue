<template>
  <div>
    <h3>OwnerContentCmp</h3>
    <owner-main-cmp></owner-main-cmp>
    <router-view />
  </div>
</template>

<script>
import OwnerMainCmp from './OwnerMainCmp.vue'
export default {
  components: { OwnerMainCmp }
}
</script>

<style></style>
