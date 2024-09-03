<!--
 담당자: 김경민
 시작 일자: 2024.09.02
 설명 : 메인 푸터 작성
 ---------------------
 2024.09.02 김경민 : 메인 푸터 작성-->

<template>
  <footer class="footer bg-light mt-auto">
    <div class="container">
      <div class="row">
        <!-- 왼쪽 섹션: 고객 센터 정보 -->
        <div class="col-md-6">
          <h5>파킹플레이스</h5>
          <h5>고객 센터 C/S Center</h5>
          <p>이메일: <a href="mailto:parkingplace@gmail.com">parkingplace@gmail.com</a></p>
          <p>근무시간: 월 ~ 금 AM 10:00 ~ PM 6:00</p>
        </div>

        <!-- 오른쪽 섹션: 프로젝트 정보 -->
        <div class="col-md-6">
          <h5>프로젝트 정보</h5>
          <p>팀명: 곰*곰히</p>
          <p>개발자: 양건모, 오지수, 김경민</p>
          <p>주소: 서울시 성북구 혜화동 KOSA 교육센터</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid #dee2e6;
}

.footer h5 {
  font-weight: bold;
  color: #333;
}

.footer h2 {
  font-weight: bold;
  color: #000;
}

.footer p {
  margin-bottom: 0.5rem;
  color: #555;
}

.footer a {
  color: #000;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>