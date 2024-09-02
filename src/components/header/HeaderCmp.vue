<template>
  <div>
    <h3>HeaderCmp</h3>
    <header-menu-cmp></header-menu-cmp>
    <header-noti-cmp></header-noti-cmp>
  </div>
</template>

<script>
import HeaderMenuCmp from './HeaderMenuCmp.vue'
import HeaderNotiCmp from './HeaderNotiCmp.vue'
export default {
  components: { HeaderMenuCmp, HeaderNotiCmp }
}
</script>

<style></style>
