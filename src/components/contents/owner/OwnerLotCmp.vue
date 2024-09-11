<template>
  <div class="parking-lot-management">
    <h1>주차장 관리</h1>

    <!-- 주차장 정보 -->
    <div class="parking-info">
      <h3>주차장 정보</h3>
      <div>
        <label>주차장명</label>
        <input v-model="parkingLot.name" type="text" />
      </div>
      <div>
        <label>주소</label>
        <input v-model="parkingLot.address" type="text" />
      </div>
      <div>
        <label>연락처</label>
        <input v-model="parkingLot.contact" type="text" />
      </div>
      <div>
        <label>평일 영업시간</label>
        <input v-model="parkingLot.weekdayHoursStart" type="time" />
        <input v-model="parkingLot.weekdayHoursEnd" type="time" />
      </div>
      <div>
        <label>주말 영업시간</label>
        <input v-model="parkingLot.weekendHoursStart" type="time" />
        <input v-model="parkingLot.weekendHoursEnd" type="time" />
      </div>
    </div>

    <!-- 주차 구역 정보 컴포넌트 사용 -->
    <ParkingZoneTable
      :zones="parkingLot.zones"
      @add-zone="addZone"
      @edit-zone="editZone"
      @delete-zone="deleteZone"
    />
  </div>
</template>

<script>
import ParkingZoneTable from './ParkingZoneTable.vue'

export default {
  components: {
    ParkingZoneTable
  },
  data() {
    return {
      parkingLot: {
        name: '혜화 주차장',
        address: '서울시 용산구 명륜동',
        contact: '010-1234-5678',
        weekdayHoursStart: '00:00',
        weekdayHoursEnd: '24:00',
        weekendHoursStart: '02:00',
        weekendHoursEnd: '24:00',
        zones: [
          {
            name: 'A',
            capacity: 5,
            vehicleType: '모든 차량',
            weekdayPrice: 3000,
            weekendPrice: 4000,
            washService: true,
            maintenanceService: true
          },
          {
            name: 'B',
            capacity: 2,
            vehicleType: '전기차',
            weekdayPrice: 2000,
            weekendPrice: 2500,
            washService: false,
            maintenanceService: false
          },
          {
            name: 'C',
            capacity: 2,
            vehicleType: '경차',
            weekdayPrice: 1500,
            weekendPrice: 2000,
            washService: false,
            maintenanceService: false
          }
        ]
      }
    }
  },
  methods: {
    addZone() {
      this.parkingLot.zones.push({
        name: '',
        capacity: 0,
        vehicleType: '',
        weekdayPrice: 0,
        weekendPrice: 0,
        washService: false,
        maintenanceService: false
      })
    },
    editZone(index) {
      alert(`주차 구역 ${index + 1} 수정`)
    },
    deleteZone(index) {
      this.parkingLot.zones.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.parking-lot-management {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.parking-info {
  margin-bottom: 40px;
}

.parking-info div {
  margin-bottom: 10px;
}

label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
}

input[type='text'],
input[type='time'] {
  width: 200px;
  padding: 5px;
}
</style>
