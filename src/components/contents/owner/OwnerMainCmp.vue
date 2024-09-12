<template>
  <div class="reservation-status">
    <h1>오늘의 예약 현황</h1>
    <h2>{{ todayDate }}</h2>

    <schedule-table title="입차 예정" :scheduleData="entrySchedule"></schedule-table>
    <schedule-table title="출차 예정" :scheduleData="exitSchedule"></schedule-table>
    <schedule-table title="완료된 차량" :scheduleData="completedCars"></schedule-table>
  </div>
</template>

<script>
import ScheduleTable from './ScheduleTable.vue'

export default {
  components: {
    ScheduleTable
  },
  data() {
    return {
      todayDate: '2024-08-31',
      entrySchedule: [
        {
          date: '2024-08-30',
          time: '16:00',
          carNumber: '123가 2222',
          service: '세차',
          details: '예약상세',
          status: '입차예정'
        },
        {
          date: '2024-08-30',
          time: '16:00',
          carNumber: '123가 2222',
          service: '세차',
          details: '예약상세',
          status: '입차예정'
        }
      ],
      exitSchedule: [
        {
          date: '2024-08-30',
          time: '14:00',
          carNumber: '123가 2222',
          service: '세차',
          details: '예약상세',
          status: '출차예정'
        },
        {
          date: '2024-08-30',
          time: '14:00',
          carNumber: '123가 2222',
          service: '세차',
          details: '예약상세',
          status: '출차예정'
        }
      ],
      completedCars: [
        {
          date: '2024-08-30',
          time: '10:00',
          carNumber: '123가 2222',
          service: '세차',
          details: '예약상세',
          status: '출차완료'
        },
        {
          date: '2024-08-30',
          time: '10:00',
          carNumber: '123가 2222',
          service: '세차',
          details: '예약상세',
          status: '출차완료'
        }
      ]
    }
  }
}
</script>

<style scoped>
.reservation-status {
  padding: 20px;
}

h1 {
  text-align: center;
}

h2 {
  text-align: center;
  font-weight: 300;
}

.reservation-section {
  margin-bottom: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
