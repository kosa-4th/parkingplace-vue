<template>
  <div class="car-management-container">
    <div class="title">차량 관리</div>
    <div class="name"><strong>{{ authStore.getUsername }}</strong>님 안녕하세요!</div>

    <div class="car-list-box">
      <div v-for="(car, index) in myCars" :key="index" class="car-list">
        <input type="text"
              :value="car.plateNumber"
              disabled
              class="car-number-input"
              />
        <button @click="removeCar(car)" class="delete-btn">삭제</button>
      </div>
    </div>

    <div class="form-group">
      <div class="register-carNum">
        <label for="car-number">차량번호 등록</label>
        <input type="text"
                id="car-number"
                v-model="newCarNumber"
                placeholder="차량번호를 입력하세요."
        />
      </div>

      <div class="register-carType">
        <label for="car-type">차량 종류</label>
        <select v-model="selectedCar"  id="car-type">
          <option v-for="(carType, index) in carTypes" :key="index" :value="carType.carType">
            {{ carType.carType }}
          </option>
        </select>
      </div>
    </div>

    <button @click="registerCar" class="submit-btn">내 차량 번호 등록하기</button>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { AuthStore } from '@/stores/store';
const authStore = AuthStore();
// const token = authStore.token;
const myCars = ref([]);
const carTypes = ref([]);
const newCarNumber = ref('');
const selectedCar = ref('');

const getData = async () => {
  try {
    const response = await axios.get("/api/users/cars/protected");
    console.log(response.data);
    myCars.value = response.data.myCars;
    carTypes.value = response.data.carTypes;
    selectedCar.value = carTypes.value[0].carType;
  } catch {
    console.log("데이터 받기 에러")
  }

}

const removeCar = async (car) => {
  if (myCars.value.length <= 1) {
    alert("차량은 1개 이상 등록되어야 합니다.");
  } else {

    const response = await axios.delete(`/api/users/cars/${car.id}/protected`, {
        data: {
          carType: car.carType,
          plateNumber: car.plateNumber
        }
      
    });
    console.log(response.data);
    getData();
  }
  console.log(car);
}

const registerCar = async () => {
  console.log(newCarNumber);
  console.log(selectedCar);

  try {
    const response = await axios.post("/api/users/cars/protected",
    {
      carType: selectedCar.value,
      plateNumber: newCarNumber.value
    });
    console.log(response.data);
  } catch(error) {
    alert(error.response.data);
    console.log(error.response.data);
  }
  getData();
}

onMounted(() => {
  getData();
})

</script>

<style scoped>
.car-management-container {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
}

.name {
  margin-bottom: 14px;
}

.car-list-box {
  min-height: 350px;
}

.car-list {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
}

.car-number-input {
  flex: 5;
  padding: 10px;
  margin-right: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.form-group div {
  display: flex;
  flex-direction: column;
}

.form-group div label {
  font-size:15px;
  margin-bottom: 5px;
  padding-left: 5px;
}

.register-carNum {
  flex: 3;
}

.register-carType {
  flex: 2;
}

input, select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #915dd1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}
</style>
