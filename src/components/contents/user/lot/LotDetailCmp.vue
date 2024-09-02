<template>
  <div>
    <h3>LotDetailCmp</h3>
    <lot-detail-home-cmp></lot-detail-home-cmp>
    <lot-detail-review-cmp></lot-detail-review-cmp>
    <lot-detail-qna-cmp></lot-detail-qna-cmp>
  </div>
</template>

<script>
import LotDetailHomeCmp from './LotDetailHomeCmp.vue'
import LotDetailQnaCmp from './LotDetailQnaCmp.vue'
import LotDetailReviewCmp from './LotDetailReviewCmp.vue'
export default {
  components: { LotDetailHomeCmp, LotDetailReviewCmp, LotDetailQnaCmp }
}
</script>

<style></style>
