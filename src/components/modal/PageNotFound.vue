<template>
  <div class="container">
    <img src="@/assets/img/logo-404.png" alt="404">
    <div class="message">페이지를 찾을 수 없습니다.</div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.container {
    width: 80%;
    height: 80vh;
    display: flex;
    flex-direction: row; /* 기본은 웹 화면이므로 row */
    align-items: center;
    margin: auto;
}

img {
    height: 200px;
}

.message {
    font-size: 25px;
    font-weight: 600;
}

/* 모바일 화면일 때 flex-direction을 column으로 변경 */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        margin-top: 30px;
        height: 60vh;
    }

    .message {
        text-align: center; /* 모바일에서 메시지를 가운데 정렬 */
        font-size: 20px;
        margin-top: 20px;
    }
}
</style>