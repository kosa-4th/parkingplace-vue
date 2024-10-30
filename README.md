# ParkingPlace - FrontEnd 안내
##### 한국소프트웨어산업협회 MSA 기반 풀스택 양성 과정 - 최종 프로젝트
<a href="https://www.parkingplace.store">
    <img src="https://github.com/user-attachments/assets/51528759-ad11-4c4d-a592-02ade9057956" alt="ParkingPlace - FrontEnd 안내" />
</a>

## 배포 사이트 : https://www.parkingplace.store

---

### 개발 인원 : 총 3명(FullStack)
| **팀원**      | **역할**                                     |
|---------------|----------------------------------------------|
| **⭐️양건모** <br> [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/rjsah09)   | 팀장, 주차창 마커 생성 및 위치 표시, 주차장 추천 및 알림, 즐겨찾기, 배포 |
| **🙋‍♂️김경민** <br> [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/gaengmin)   | 주차장 예약, 결제시스템 예약 및 취소, 시스템 관리자 페이지, 주차장 관리자 예약 관리|
| **🙋‍♀️오지수** <br> [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Wildturkeyy)   | Spring Security, JWT, 회원 관리 시스템, 주차장 상세 페이지, 리뷰 및 문의 |

---

### 개발 일정 : 2024년 08월 26일 - 2024년 10월 07일

| **단계**                | **내용**                                      | **기간**                |
|-------------------------|-----------------------------------------------|-------------------------|
| **1. 주제 선정**        | 주제 아이디어 구상 및 확정                    | 24.08.26 - 24.08.27     |
| **2. 웹개발 명세서 작성** | 웹 개발을 위한 상세 명세서 작성                 | 24.08.27 - 24.08.30     |
|                         | - ERD 설계                                    |                         |
|                         | - 피그마 설계                                  |                         |
|                         | - API 명세서 설계                              |                         |
| **3. 개발 환경 설정**    | 프로젝트 개발 환경 구축                       | 24.08.30                |
| **4. 프로젝트 개발**     | 기능 개발 및 구현                             | 24.09.02 - 24.09.24     |
| **5. 버그 수정**         | 발견된 버그 수정 및 안정화 작업               | 24.09.24 - 24.10.04     |
| **6. 발표자료 작성 및 제출** | 발표 자료 준비 및 제출                        | 24.09.24 - 24.09.27     |
| **7. AWS 서버 및 GITHUB CI/CD 설정** | 서버 배포 및 지속적 통합/배포 환경 구축 | 24.09.26 - 24.10.01     |
| **8. 프로젝트 정리 및 발표 준비** | 프로젝트 점검 및 발표 준비                  | 24.10.01 - 24.10.04     |
|                         | - 데이터 체크                                 |                         |
|                         | - 프로젝트 테스트                              |                         |
|                         | - 발표 리허설                                  |                         |
| **9. 최종 발표**         | 최종 프로젝트 발표                           | 24.10.07                |

---

### 프로젝트 개요
ParkingPlace는 여러 주차 공간을 비교해 예약할 수 있는 주차 예약 플랫폼입니다. 사용자는 목적지를 기준으로 최적의 주차장을 추천받을 수 있으며, 주차장 사업자는 자신의 주차 공간을 예약 및 관리할 수 있는 시스템을 제공합니다.

---

### 주요 기능
- **주차장 예약 및 비교**: 사용자가 다양한 주차 공간을 비교하고 예약할 수 있도록 지원
- **목적지 기반 추천**: 목적지 주변의 최적 주차장을 추천
- **주차 공간 관리**: 사업자가 주차 공간을 예약 및 관리할 수 있는 시스템 구축

---

### 시스템 아키텍처
<img src="https://github.com/user-attachments/assets/a1eb4fcc-9d4c-4ed7-940a-4987b221b8e0" alt="ParkingPlace 시스템 아키텍처" width="700" />

---

### 기술 스택
<img src="https://github.com/user-attachments/assets/7d755b1d-8ce6-4043-b7c8-0d5eb01b553a" alt="ParkingPlace 기술 스택" width="800" />

---

### 데이터베이스 구조 (ERD)
<img src="https://github.com/user-attachments/assets/12adba31-7f9a-4961-981d-336cd7494b4e" alt="ParkingPlace ERD" width="700" />

---

### 컴포넌트 구조도
<img src="https://github.com/user-attachments/assets/a96967ce-8d80-4045-9434-f6d04d766f30" alt="ParkingPlace Component Tree" width="700" />

---

## Project Setup

| 단계                                | 설명                                                                                                          |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------|
| **추천 IDE 설정**                   | [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur 비활성화 권장) |
| **프로젝트 설정**                   | `npm install`                                                                                               |
| **개발을 위한 컴파일 및 핫 리로드**   | `npm run dev`                                                                                               |
| **프로덕션을 위한 컴파일 및 최소화** | `npm run build`                                                                                             |

## 패키지 목록

### Dependencies

| 패키지 이름                         | 버전        | 설명                                     |
|------------------------------------|-------------|------------------------------------------|
| **@nestjs/config**                 | ^3.2.3      | NestJS 환경 설정 관리                    |
| **@vuepic/vue-datepicker**         | ^9.0.3      | Vue용 날짜 선택 컴포넌트                 |
| **axios**                          | ^1.7.7      | HTTP 요청 라이브러리                     |
| **bootstrap**                      | ^5.3.3      | CSS 프레임워크                           |
| **infinite-loading-vue3-ts**       | ^1.0.5      | Vue 3용 무한 스크롤 컴포넌트             |
| **jwt-decode**                     | ^4.0.0      | JSON Web Token 디코딩 라이브러리         |
| **pinia**                          | ^2.1.7      | Vue용 상태 관리 라이브러리               |
| **swiper**                         | ^11.1.12    | 슬라이더 컴포넌트                        |
| **vue**                            | ^3.4.29     | Vue.js 프레임워크                        |
| **vue-geolocation-api**            | ^0.1.21     | Vue용 위치 정보 API                      |
| **vue-router**                     | ^4.3.3      | Vue 라우팅 라이브러리                    |
| **vue-spinner**                    | ^1.0.4      | Vue용 로딩 스피너 컴포넌트              |
| **vue3-kakao-maps**                | ^2.3.9      | Vue 3용 카카오 지도 API                  |
| **vue3-timepicker**                | ^1.0.0-beta.2 | Vue 3용 시간 선택 컴포넌트              |

### DevDependencies

| 패키지 이름                         | 버전        | 설명                                     |
|------------------------------------|-------------|------------------------------------------|
| **@vitejs/plugin-vue**             | ^5.0.5      | Vite용 Vue 플러그인                      |
| **eslint**                         | ^8.57.0     | 코드 린팅 도구                           |
| **prettier**                       | ^3.2.5      | 코드 포매터                              |
| **sass-embedded**                  | ^1.79.1     | Sass 스타일링 언어                       |
| **vite**                           | ^5.3.1      | 프론트엔드 빌드 도구                     |
| **vite-plugin-vue-devtools**       | ^7.3.1      | Vite용 Vue 개발 도구 플러그인            |


