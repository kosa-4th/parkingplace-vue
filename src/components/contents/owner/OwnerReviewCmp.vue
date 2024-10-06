<template>
  <div class="main-container">
    <div class="tabs-container">
      <!-- 부트스트랩 네비게이션 탭 -->
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'All' }"
            @click="switchTab('All')"
          >
            주차장 리뷰 목록
          </a>
        </li>
      </ul>

      <!-- 기간 선택 -->
      <div class="input-group mb-3 search-container mt-3">
        <div class="form-group">
          <input type="date" v-model="startDate" id="start-date" class="form-control" />
        </div>

        <div class="form-group mx-3">
          <input type="date" v-model="endDate" id="end-date" class="form-control" />
        </div>
        <button class="btn bg-purple btn-sm" @click="applyDateFilter">검색</button>
      </div>
    </div>

    <!-- 탭에 해당하는 콘텐츠 영역 -->
    <div class="tab-content">
      <!-- <div v-if="inquiryData.length"> -->
      <div>
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">리뷰어</th>
            <th scope="col">리뷰</th>
            <th scope="col">리뷰 등록일</th>
            <th scope="col">신고</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(review, index) in reviewData" :key="index">
            <td>{{ index + 1 }}</td> 
            <td>{{ review.reviewer }}</td>
            <td>{{ review.review }}</td>
            <td>{{ review.reviewDate }}</td>
            <td class="center-text">
              <button class="btn btn-sm bg-red"
                      @click="complaintReview(review.reviewId)">신고
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- <div v-else>
        <p>문의 데이터가 없습니다.</p>
      </div> -->
        

      <!-- 페이지네이션 -->
      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>

          <li
            class="page-item"
            v-for="page in visiblePages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>

      <owner-review-complaint-modal
        v-if="isModalVisible"
        :reviewId="selectedReview"
        :parkinglotId="selectedLotId"
        @close-modal="handleCloseModal"
      />


    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading">
        <Fade-loader />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import OwnerReviewComplaintModal from './OwnerReviewComplaintModal.vue';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import axios from 'axios';

const props = defineProps({
  selectedLotId: {
    type: Number,
    required: true
  }
})

const activeTab = ref("All");
const startDate = ref(null);
const endDate = ref(null);

const currentPage = ref(1)
const totalPages = ref(0)
const pageSize = 10
const paginationSize = 10

const reviewData = ref([]);

//모달 신구
const isModalVisible = ref(false);
const selectedReview = ref(null);

const isLoading = ref(false);

// 문의 가져오기
const getParkingReviews = async () => {
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize,
      from: startDate.value,
      to: endDate.value,
      // actionType: activeTab.value
    };

    isLoading.value = true;
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/parking-manager/parkinglots/${props.selectedLotId}/reviews/protected`, { params });
    isLoading.value = false;
    reviewData.value = response.data.parkingReviews;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage + 1;
  } catch (error) {
    isLoading.value = false;
    console.error(error);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    getParkingReviews(); // 페이지 변경 시 데이터 다시 가져오기
  }
}

const visiblePages = computed(() => {
  const start = Math.floor((currentPage.value - 1) / paginationSize) * paginationSize + 1
  const end = Math.min(start + paginationSize - 1, totalPages.value)
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const applyDateFilter = () => {
  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    alert('잘못된 날짜 범위입니다.');
  } else {
    currentPage.value = 1; // Reset to page 1 when filtering
    getParkingReviews();
  }
};

const switchTab = (tabName) => {
  activeTab.value = tabName;
  currentPage.value = 1;
  getParkingReviews();
};

const complaintReview = (reviewId) => {
  selectedReview.value = reviewId;
  isModalVisible.value = true;
};

const handleCloseModal = () => {
  getParkingReviews();
  isModalVisible.value = false;
}

onMounted(() => {
  getParkingReviews();
})
// selectedLotId가 변경될 때 주차장 데이터를 다시 가져옴
watch( () => {
  getParkingReviews();
});

</script>


<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 80vw;
}
.center-text {
  vertical-align: middle; /* 수직 가운데 정렬 */
}

.btn {
  display: inline-block;
  padding: 5px 10px;
}

.table {
  border-color: #dddddd;
}

.table th,
.table td {
  border-color: #dddddd; /* 테이블 셀의 선 색상 */
}

.tabs-container {
  width: 100%;
}

.nav-tabs {
  justify-content: flex-start;
}

.tab-content {
  width: 100%;
  margin-left: 5px;
}

.nav-item {
}

.subtitle {
  color: #6c757d;
}

.subtitle:hover {
  color: #6c757d;
}

.subtitle.active {
  font-weight: bold; /* 활성화된 탭 굵기 */
}


.table {
  margin-bottom: 30px;
}

.pagination {
  margin-top: 20px;
}

.bg-purple {
  background-color: #9A64E8; /* 기본 보라색 */
  color: white;
}

.bg-green {
  background-color: #76D672; /* 기본 초록색 */
  color: white;
}

.bg-red {
  background-color: #F93A41; /* 기본 보라색 */
  color: white;
}



.bg-purple:hover {
  background-color: #8e44ad; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */
}

.bg-green:hover {
  background-color: #76D672; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */
}



.bg-red:hover {
  background-color: #F93A41; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */
}

/* date-picker 전체 영역을 오른쪽으로 배치 */
.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 오른쪽 정렬 */
}

/* active 페이지에 보라색 배경 적용 */
.pagination .page-item.active .page-link {
  background-color: #9A64E8; /* 보라색 */
  color: white; /* 흰색 텍스트 */
  border-color: #9A64E8; /* 보라색 테두리 */
}

/* hover 시에도 동일한 스타일 유지 */
.pagination .page-item .page-link:hover {
  background-color: #9A64E8;
  color: white;
  border-color: #9A64E8;
}

/* 이전, 다음 버튼에 보라색 적용 */
.pagination .page-item .page-link {
  color: #9A64E8; /* 보라색 텍스트 */
}

.pagination .page-item.disabled .page-link {
  color: #6c757d; /* 비활성화된 버튼 색상 */
}

.font-red {
  color: #F93A41;
  font-size: 15px;
}

.font-green {
  color: #76D672;
  font-size: 15px;
}
</style>