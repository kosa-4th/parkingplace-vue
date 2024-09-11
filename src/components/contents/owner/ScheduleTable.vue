<template>
  <div class="reservation-section">
    <h3>{{ title }}</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>날짜</th>
          <th>시간</th>
          <th>차량 번호</th>
          <th>서비스</th>
          <th>상세</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in scheduleData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.carNumber }}</td>
          <td>{{ item.service }}</td>
          <td>{{ item.details }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    scheduleData: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
th {
  font-weight: 600;
}
h3 {
  font-weight: 600;
  margin-bottom: 10px;
}
.reservation-section {
  margin-bottom: 40px;
}

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
  width: 1200px;
  background-color: #9ac3ff;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

td {
  background-color: #f9f9f9;
}

tbody tr {
  transition: background-color 0.3s ease;
}

tbody tr:hover {
  background-color: #e0f7fa;
}

tbody tr:nth-child(even) td {
  background-color: #f1f1f1;
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
</style>
