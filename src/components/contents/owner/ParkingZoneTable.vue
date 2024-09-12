<template>
  <div>
    <h3>주차 구역 정보</h3>
    <!-- 주차 구역 정보를 표시하는 테이블 -->
    <table>
      <thead>
        <tr>
          <!-- 테이블 헤더 -->
          <th>주차구역</th>
          <th>주차 가능 대수</th>
          <th>주차 가능 차량</th>
          <th>평일 가격</th>
          <th>주말 가격</th>
          <th>세차 서비스</th>
          <th>정비 서비스</th>
          <th>수정</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <!-- 테이블 바디: 각 구역 정보 출력 -->
        <tr v-for="(zone, index) in zones" :key="index">
          <td>{{ zone.name }}</td>
          <td>{{ zone.capacity }}</td>
          <td>{{ zone.vehicleType }}</td>
          <td>{{ zone.weekdayPrice }}</td>
          <td>{{ zone.weekendPrice }}</td>
          <!-- 세차 서비스 여부를 'O' 또는 'X'로 표시 -->
          <td>{{ zone.washService ? 'O' : 'X' }}</td>
          <!-- 정비 서비스 여부를 'O' 또는 'X'로 표시 -->
          <td>{{ zone.maintenanceService ? 'O' : 'X' }}</td>
          <!-- 수정 버튼 -->
          <td><button @click="editZone(index)">수정</button></td>
          <!-- 삭제 버튼 -->
          <td><button @click="deleteZone(index)">삭제</button></td>
        </tr>
      </tbody>
    </table>
    <!-- 구역 추가 버튼 (현재 주석 처리된 상태) -->
    <!-- <button @click="addZone">추가</button> -->
  </div>
</template>

<script>
export default {
  props: {
    // 부모 컴포넌트에서 전달된 구역 데이터 목록
    zones: Array
  },
  methods: {
    // 구역 추가 이벤트를 부모로 전달 (현재 사용하지 않음)
    addZone() {
      this.$emit('add-zone')
    },
    // 구역 수정 이벤트를 부모로 전달, 수정할 구역의 인덱스를 함께 전달
    editZone(index) {
      this.$emit('edit-zone', index)
    },
    // 구역 삭제 이벤트를 부모로 전달, 삭제할 구역의 인덱스를 함께 전달
    deleteZone(index) {
      this.$emit('delete-zone', index)
    }
  }
}
</script>

<style scoped>
/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 테이블에 그림자 효과 */
  border-radius: 8px;
  overflow: hidden;
}

/* 테이블 셀 스타일 */
th,
td {
  padding: 12px 15px; /* 셀 내부 여백 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 테이블 헤더 스타일 */
th {
  background-color: #9ac3ff; /* 헤더 배경색 */
  color: white; /* 헤더 텍스트 색 */
  text-transform: uppercase; /* 텍스트 대문자로 표시 */
}

/* 테이블 바디 셀 스타일 */
td {
  background-color: #f9f9f9; /* 셀 배경색 */
  border-bottom: 1px solid #ddd; /* 셀 하단 테두리 */
}

/* 행 hover 효과 */
tbody tr {
  transition: background-color 0.3s ease; /* 배경색 변화 애니메이션 */
}

/* 마우스를 올렸을 때 행의 배경색 변경 */
tbody tr:hover {
  background-color: #f1f1f1;
}

/* 짝수 행의 배경색 다르게 적용 */
tbody tr:nth-child(even) td {
  background-color: #f5f5f5;
}

/* 첫 번째와 마지막 셀의 테두리를 둥글게 처리 */
td:first-child,
th:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

td:last-child,
th:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* 버튼 스타일 */
button {
  background-color: #007bff; /* 기본 버튼 색상 (파란색) */
  color: white; /* 버튼 텍스트 색상 (흰색) */
  border: none; /* 버튼 테두리 없음 */
  padding: 8px 12px; /* 버튼 내부 여백 */
  border-radius: 5px; /* 버튼 둥근 모서리 */
  cursor: pointer; /* 커서를 포인터로 변경 */
  transition: background-color 0.3s ease; /* 배경색 변화 애니메이션 */
}

/* 버튼 hover 시 배경색 변경 */
button:hover {
  background-color: #0056b3;
}

/* 버튼 focus 시 테두리 제거 */
button:focus {
  outline: none;
}

/* 버튼 클릭 시 배경색 더 어둡게 변경 */
button:active {
  background-color: #004085;
}

/* 비활성화된 버튼 스타일 */
button:disabled {
  background-color: #cccccc; /* 비활성화 시 버튼 배경색 */
  cursor: not-allowed; /* 비활성화 시 커서 금지 모양 */
}
</style>
