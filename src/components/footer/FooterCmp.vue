<!--
 담당자: 김경민
 시작 일자: 2024.09.02
 설명 : 메인 푸터 작성
 ---------------------
 2024.09.02 김경민 : 메인 푸터 작성
 2024.09.20 오지수 : 디자인 수정
 -->

<template>
  <footer class="footer bg-light mt-auto">
    <div class="container">
      <div class="row">
        <!-- 왼쪽 섹션: 고객 센터 정보 -->
        <div class="col-md-6">
          <div>
            <label>미리보는 주차공간</label>
            <div class="title">Parking Place !</div>
          </div>
          <div class="sub-title">고객 센터 C/S Center</div>
          <p>이메일: <a href="mailto:parkingplace@gmail.com">parkingplace@gmail.com</a></p>
          <p>근무시간: 월 ~ 금 AM 10:00 ~ PM 6:00</p>
        </div>

        <!-- 오른쪽 섹션: 프로젝트 정보 -->
        <div class="col-md-6">
          <div class="sub-title">프로젝트 정보</div>
          <p>상호: 파킹플레이스</p>
          <p>팀명: 곰’ ᴥ ‘곰히</p>
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
  padding: 15px;
  z-index: 1;
}

label {
  font-size: 12px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-top: -5px;
  margin-bottom: 14px;
}

.sub-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  margin-top: 21px;
}

.footer h2 {
  font-weight: bold;
}

.footer p {
  font-size: 15px;
  margin-bottom: 0.1rem;
}

.footer a {
  color: #4A4A4A;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
