<template>
  <div class="star-rating">
    <span
      v-for="(star, index) in 5"
      :key="index"
      class="star"
    >
      <!-- 왼쪽 절반 (0.5점) -->
      <span
        class="half-star left"
        @click="selectStar(index + 0.5)"
        @mouseenter="hoverStar(index + 0.5)"
        @mouseleave="resetStar"
      >
        <span class="full-star">★</span>
        <span class="filled" :style="getClipPathStyle(index + 0.5)">★</span>
      </span>

      <!-- 오른쪽 절반 (1점) -->
      <span
        class="half-star right"
        @click="selectStar(index + 1)"
        @mouseenter="hoverStar(index + 1)"
        @mouseleave="resetStar"
      >
        <span class="full-star">★</span>
        <span class="filled" :style="getClipPathStyle(index + 1)">★</span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rating: 0, // 실제 선택된 별점
      tempRating: 0, // 마우스 오버 시 임시로 보여줄 별점
    };
  },
  methods: {
    selectStar(star) {
      this.rating = star;
      this.$emit('update:rating', this.rating); // 부모 컴포넌트에 별점 전달
    },
    hoverStar(star) {
      this.tempRating = star; // 마우스 오버한 별점 임시 표시
    },
    resetStar() {
      this.tempRating = 0; // 마우스가 나가면 임시 표시 초기화
    },
    getClipPathStyle(star) {
      const currentRating = this.tempRating || this.rating; // 마우스 오버 중이면 tempRating, 아니면 실제 rating
      const fullStars = Math.floor(currentRating); // 정수 부분 (채워진 별)
      const halfStar = currentRating % 1 !== 0; // 0.5점 여부

      if (star <= fullStars) {
        return { 'clip-path': 'inset(0% 0% 0% 0%)' }; // 완전히 채워진 별
      } else if (star === fullStars + 0.5 && halfStar) {
        return { 'clip-path': 'inset(0% 50% 0% 0%)' }; // 반만 채워진 별
      } else {
        return { 'clip-path': 'inset(0% 100% 0% 0%)' }; // 채워지지 않은 별
      }
    },
  },
};
</script>

<style scoped>
.star-rating {
  font-size: 30px; /* 별 크기 */
  display: inline-block;
}
.star {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-right: 20px; /* 별 간격 조정 */
}
.half-star {
  position: relative;
  display: inline-block;
  width: 10px; /* 별의 절반 크기 */
}
.left {
  margin-right: -10px; /* 왼쪽 절반 별의 간격 조정 */
}
.full-star {
  color: lightgray; /* 배경이 되는 빈 별 */
}
.filled {
  position: absolute;
  top: 0;
  left: 0;
  color: gold; /* 채워지는 별 색상 */
  clip-path: inset(0% 100% 0% 0%); /* 기본적으로는 채워지지 않음 */
}
</style>
