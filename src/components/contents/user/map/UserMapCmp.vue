<template>
  <div>
    <h3>UserMapCmp</h3>
    <search-cmp></search-cmp>
    <lot-preview-cmp></lot-preview-cmp>
    <recommend-lots-cmp></recommend-lots-cmp>
  </div>
</template>

<script>
import LotPreviewCmp from './LotPreviewCmp.vue'
import RecommendLotsCmp from './RecommendLotsCmp.vue'
import SearchCmp from './SearchCmp.vue'
export default {
  components: { SearchCmp, LotPreviewCmp, RecommendLotsCmp }
}
</script>
LotPreviewCmp

<style></style>
