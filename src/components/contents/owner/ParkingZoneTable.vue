<template>
  <div>
    <h3>주차 구역 정보</h3>
    <table>
      <thead>
        <tr>
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
        <tr v-for="(zone, index) in zones" :key="index">
          <td>{{ zone.name }}</td>
          <td>{{ zone.capacity }}</td>
          <td>{{ zone.vehicleType }}</td>
          <td>{{ zone.weekdayPrice }}</td>
          <td>{{ zone.weekendPrice }}</td>
          <td>{{ zone.washService ? 'O' : 'X' }}</td>
          <td>{{ zone.maintenanceService ? 'O' : 'X' }}</td>
          <td><button @click="editZone(index)">수정</button></td>
          <td><button @click="deleteZone(index)">삭제</button></td>
        </tr>
      </tbody>
    </table>
    <button @click="addZone">추가</button>
  </div>
</template>

<script>
export default {
  props: {
    zones: Array
  },
  methods: {
    addZone() {
      this.$emit('add-zone')
    },
    editZone(index) {
      this.$emit('edit-zone', index)
    },
    deleteZone(index) {
      this.$emit('delete-zone', index)
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 12px 15px;
  text-align: center;
}

th {
  background-color: #9ac3ff;
  color: white;
  text-transform: uppercase;
}

td {
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

tbody tr {
  transition: background-color 0.3s ease;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

tbody tr:nth-child(even) td {
  background-color: #f5f5f5;
}

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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}

button:active {
  background-color: #004085;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
