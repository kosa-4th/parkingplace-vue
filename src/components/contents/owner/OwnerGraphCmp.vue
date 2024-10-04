<template>
  <div class="main-container mt-3">
    <h3>오늘의 데이터</h3>
    <div class="row">
      <div class="col-2 text-center">
    <span>예약 체크<br>
      <span class="badge badge-sm bg-purple">{{ reservationStatusCounts.pendingReservations }}</span>
    </span>
      </div>
      <div class="col-2 text-center">
    <span>입차 예정<br>
      <span class="badge badge-sm bg-purple">{{ reservationStatusCounts.checkInReservations }}</span>
    </span>
      </div>
      <div class="col-2 text-center">
    <span>출차 예정<br>
      <span class="badge badge-sm bg-purple">{{ reservationStatusCounts.checkOutReservations }}</span>
    </span>
      </div>
    </div>
    <hr>
    <div class="mt-3" style="height: 450px; border:1px solid black;">
      <div>
        <div class="row mt-3">
          <div class="col-2 text-center">
          <span>당일 예약<br>
            <span class="badge badge-sm bg-green">{{ toDayCount }}</span>
          </span>
            <div class="row mt-3">
              <div v-if="differenceDayCount > 0">
              <span>일일 비교<br>
                <span class="badge badge-sm bg-red">+{{ differenceDayCount }}</span>
              </span>
              </div>
              <div v-if="differenceDayCount < 0">
              <span>일일 비교<br>
                <span class="badge badge-sm bg-blue">{{ differenceDayCount }}</span>
              </span>
              </div>
              <div v-if="differenceDayCount === 0">
              <span>일일 비교<br>
                <span class="badge badge-sm bg-gray">{{ differenceDayCount }}</span>
              </span>
              </div>
            </div>
            <div class="row mt-3">
              <div v-if="differenceWeekCount > 0">
              <span>주간 비교<br>
                <span class="badge badge-sm bg-red">+{{ differenceWeekCount }}</span>
              </span>
              </div>
              <div v-if="differenceWeekCount < 0">
              <span>주간 비교<br>
                <span class="badge badge-sm bg-blue">{{ differenceWeekCount }}</span>
              </span>
              </div>
              <div v-if="differenceWeekCount === 0">
              <span>주간 비교<br>
                <span class="badge badge-sm bg-gray">{{ differenceWeekCount }}</span>
              </span>
              </div>
            </div>
          </div>
          <div class="col-10" style="overflow:auto;">
            <div id="line_chart" style="width: 100%; height: 400px;"></div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="mt-3" style="height: 450px; border:1px solid black;">
      <div>
        <div class="row mt-3">
          <div class="col-2 text-center">
          <span>오늘의 수익<br>
            <span class="badge badge-sm bg-green">{{ todayIncome }}</span>
          </span>
            <div class="row mt-3">
              <div v-if="differenceDayIncome > 0">
              <span>일일 비교<br>
                <span class="badge badge-sm bg-red">+{{ differenceDayIncome }}</span>
              </span>
              </div>
              <div v-if="differenceDayIncome < 0">
              <span>일일 비교<br>
                <span class="badge badge-sm bg-blue">{{ differenceDayIncome }}</span>
              </span>
              </div>
              <div v-if="differenceDayIncome === 0">
              <span>일일 비교<br>
                <span class="badge badge-sm bg-gray">{{ differenceDayIncome }}</span>
              </span>
              </div>
            </div>
            <div class="row mt-3">
              <div v-if="differenceWeekIncome > 0">
              <span>주간 비교<br>
                <span class="badge badge-sm bg-red">+{{ differenceWeekIncome }}</span>
              </span>
              </div>
              <div v-if="differenceWeekIncome < 0">
              <span>주간 비교<br>
                <span class="badge badge-sm bg-blue">{{ differenceWeekIncome }}</span>
              </span>
              </div>
              <div v-if="differenceWeekIncome === 0">
              <span>주간 비교<br>
                <span class="badge badge-sm bg-gray">{{ differenceWeekIncome }}</span>
              </span>
              </div>
            </div>
          </div>
          <div class="col-10" style="overflow:auto;">
            <div id="income_chart" style="width: 90%; height: 400px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
/* eslint-disable no-undef */

export default {
  props: ['selectedLotId'],
  data() {
    return {
      reservationStatusCounts: {
        pendingReservations: 0,
        checkInReservations: 0,
        checkOutReservations: 0
      },
      thisWeekLabels: [], // 이번 주 라벨
      reservationIncomeThisWeek: [], // 이번 주 수익 데이터
      reservationIncomeLastWeek: [],
      lineChartData: {
        labels: [], // 이번 주 라벨을 기준으로 우선 사용
        datasets: [
          {
            label: '이번 주',
            data: []
          }
        ]
      },
      differenceWeekCount: '',
      differenceDayCount: '',

      differenceWeekIncome: '',
      differenceDayIncome: '',
      todayIncome: '',
      toDayCount: ''
    }
  },
  mounted() {
    this.getReservationData() // 컴포넌트가 로드될 때 데이터 가져오기
  },
  watch: {
    selectedLotId() {
      this.getReservationData(this.selectedLotId)
    }
  },
  methods: {
    async getReservationData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/parking-manager/parkingLots/${this.selectedLotId}/kpi`)
        const data = response.data

        // 이번 주 데이터 정렬
        const sortedThisWeek = Object.entries(data.reservationCounts.thisWeek).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        // 지난 주 데이터 정렬
        const sortedLastWeek = Object.entries(data.reservationCounts.lastWeek).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))

        const todayData = sortedThisWeek[sortedThisWeek.length - 1]  // 오늘 데이터
        const yesterdayData = sortedThisWeek[sortedThisWeek.length - 2]  // 어제 데이터
        this.differenceDayCount = todayData[1] - yesterdayData[1]
        this.toDayCount = todayData[1]
        // 이번 주 라벨 생성
        this.thisWeekLabels = sortedThisWeek.map(([date]) => date)


        // 이번 주 데이터와 지난 주 데이터를 각각 설정
        this.lineChartData.labels = this.thisWeekLabels // 이번 주 라벨 사용
        this.lineChartData.datasets[0].data = sortedThisWeek.map(([, count]) => count) // 이번 주 데이터

        this.calculateDifference(sortedThisWeek, sortedLastWeek)


        //수익 데이터
        const sortedThisWeekIncome = Object.entries(data.reservationIncome.thisWeek).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        const sortedLastWeekIncome = Object.entries(data.reservationIncome.lastWeek).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        this.reservationIncomeThisWeek = sortedThisWeekIncome.map(([, income]) => income)
        this.reservationIncomeLastWeek = sortedLastWeekIncome.map(([, income]) => income)

        const yesterdayIncome = sortedThisWeekIncome[sortedThisWeekIncome.length - 2][1]  // 어제 수익 데이터
        const todayIncome = sortedThisWeekIncome[sortedThisWeekIncome.length - 1][1]  // 오늘 수익 데이터

        this.differenceDayIncome = todayIncome - yesterdayIncome

        this.calculateIncomeDifference(sortedThisWeekIncome, sortedLastWeekIncome)

        this.reservationStatusCounts = data.reservationStatusCounts
        this.todayIncome = todayIncome
        this.loadGoogleCharts()
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error)
      }
    },
    calculateIncomeDifference(thisWeek, lastWeek) {
      let totalThisWeek = 0
      let totalLastWeek = 0

      // 각각의 데이터를 더해 총합을 구함
      thisWeek.forEach(([, income]) => {
        totalThisWeek += income
      })
      lastWeek.forEach(([, income]) => {
        totalLastWeek += income
      })

      // 차이 계산
      this.differenceWeekIncome = totalThisWeek - totalLastWeek
    },
    calculateDifference(thisWeek, lastWeek) {
      let totalThisWeek = 0
      let totalLastWeek = 0

      // 각각의 데이터를 더해 총합을 구함
      thisWeek.forEach(([, count]) => {
        totalThisWeek += count
      })
      lastWeek.forEach(([, count]) => {
        totalLastWeek += count
      })

      // 차이 계산
      this.differenceWeekCount = totalThisWeek - totalLastWeek

    },
    loadGoogleCharts() {
      google.charts.load('current', { packages: ['corechart'] })
      google.charts.setOnLoadCallback(this.drawCharts)
    },
    drawCharts() {
      this.drawLineChart() // 라인 차트 그리기
      this.drawBarChart()  // 막대 차트 그리기
    },
    drawLineChart() {
      const data = new google.visualization.DataTable()
      data.addColumn('string', '날짜')
      data.addColumn('number', '예약 건수')

      // 데이터를 각각 해당 날짜에 맞춰서 추가
      const rows = this.thisWeekLabels.map((date, index) => [
        date,
        this.lineChartData.datasets[0].data[index] // 이번 주 데이터
      ])

      data.addRows(rows)

      const options = {
        title: '지난 7일 예약 건 수',
        legend: { position: 'top' },
        height: 500,
        colors: ['#9A64E8'],  // 그래프 선 색상을 여기에서 지정
        lineWidth: 2,
        vAxis: {
          format: '0',  // 소수점 제거
          viewWindow: {
            min: 0  // Y축의 최소값을 0으로 설정
          }
        }
      }

      const chart = new google.visualization.LineChart(document.getElementById('line_chart'))
      chart.draw(data, options)
    },
    drawBarChart() {
      const data = new google.visualization.DataTable()
      data.addColumn('string', '날짜')
      data.addColumn('number', '수익')

      // 데이터를 각각 해당 날짜에 맞춰서 추가
      const rows = this.thisWeekLabels.map((date, index) => [
        date,
        this.reservationIncomeThisWeek[index] // 이번 주 수익 데이터
      ])

      data.addRows(rows)

      const options = {
        legend: { position: 'top' },
        height: 500,
        colors: ['#4bc07e'],  // 막대 색상 (이번 주, 지난 주)
        bar: { groupWidth: '60%' },
        isStacked: true // 막대 그래프를 쌓아서 표현 (선택 사항)
      }

      const chart = new google.visualization.ColumnChart(document.getElementById('income_chart'))
      chart.draw(data, options)
    }
  }
}
</script>

<style scoped>
.main-container {
  width: 80vw; /* 컨테이너의 너비를 전체의 80%로 설정 */
  height: 1000px;
  margin: 0 auto; /* 수평 중앙 정렬 */
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background-color: #fff;
}

.row {
  display: flex;
  width: 100%;
  margin: 0 auto; /* 수평 중앙 정렬 */
}

.col-2 {
  flex: 1;
  padding: 10px;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f8f9fa; /* 배경색 추가 */
  margin-left: 10px; /* 모든 col-2에 동일한 왼쪽 마진 */
  margin-right: 10px; /* 모든 col-2에 동일한 오른쪽 마진 */
}

.flexBox {
  padding: 10px;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f8f9fa; /* 배경색 추가 */
  margin-left: 10px; /* 모든 col-2에 동일한 왼쪽 마진 */
  margin-right: 10px; /* 모든 col-2에 동일한 오른쪽 마진 */
}

.col-6 {
  flex: 1;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f8f9fa; /* 배경색 추가 */
  margin-left: 10px; /* 모든 col-2에 동일한 왼쪽 마진 */
  margin-right: 10px; /* 모든 col-2에 동일한 오른쪽 마진 */
  padding: 10px;
}

.badge-sm {
  font-size: 18px; /* 더 큰 폰트 크기 */
  padding: 15px 30px; /* 더 큰 패딩 */
  border-radius: 10px; /* 더 둥글게 처리 */
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 오른쪽 정렬 */
}
</style>
<style scoped>
.main-container {
  width: 80vw; /* 컨테이너의 너비를 전체의 80%로 설정 */
  height: 1200px;
  margin: 0 auto; /* 수평 중앙 정렬 */
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background-color: #fff;
}

.row {
  display: flex;
  width: 100%;
  margin: 0 auto; /* 수평 중앙 정렬 */
}

.col-2 {
  flex: 1;
  padding: 10px;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f8f9fa; /* 배경색 추가 */
  margin-left: 10px; /* 모든 col-2에 동일한 왼쪽 마진 */
  margin-right: 10px; /* 모든 col-2에 동일한 오른쪽 마진 */
}

.col-2 {
  flex: 1;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f8f9fa; /* 배경색 추가 */
  margin-left: 10px; /* 모든 col-2에 동일한 왼쪽 마진 */
  margin-right: 10px; /* 모든 col-2에 동일한 오른쪽 마진 */
  padding: 10px;
  align-items: center;
}

.badge-sm {
  font-size: 16px; /* 더 큰 폰트 크기 */
  padding: 10px 20px; /* 더 큰 패딩 */
  border-radius: 6px; /* 더 둥글게 처리 */
}

</style>