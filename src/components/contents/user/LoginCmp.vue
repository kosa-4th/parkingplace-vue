<template>
  <div>
    <h3>LoginCmp</h3>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const test = ref([])

const getTestData = async () => {
  const response = await axios.get('http://localhost:8080/api/test', {
    withCredentials: true
  })
  console.log('res: ' + response.data)
  test.value = response.data
}

onMounted(() => {
  getTestData();
  console.log('test value')
})
</script>

<style></style>
