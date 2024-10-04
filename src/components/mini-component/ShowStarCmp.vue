<template>
    <div class="star-display">
      <span v-for="(star, index) in 5" :key="index" class="star">
        <span class="full-star">★</span>
        <span
          class="filled"
          :style="getClipPathStyle(index + 1)"
        >★</span>
      </span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      rating: {
        type: Number,
        required: true,
      },
    },
    methods: {
      getClipPathStyle(star) {
        const fullStars = Math.floor(this.rating);
        const halfStar = this.rating % 1 !== 0; // 0.5점 여부
  
        if (star <= fullStars) {
          return { 'clip-path': 'inset(0% 0% 0% 0%)' }; // 완전히 채워진 별
        } else if (star === fullStars + 1 && halfStar) {
          return { 'clip-path': 'inset(0% 50% 0% 0%)' }; // 반만 채워진 별
        } else {
          return { 'clip-path': 'inset(0% 100% 0% 0%)' }; // 채워지지 않은 별
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .star-display {
    font-size: 24px; /* 별 크기 */
    display: inline-block;
  }
  .star {
    position: relative;
    display: inline-block;
    margin-right: 1px;
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
  