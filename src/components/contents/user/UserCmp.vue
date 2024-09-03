<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { AuthStore } from '@/stores/store'
import { computed } from 'vue'

const authStore = AuthStore()

const username = computed(() => authStore.username)
const email = computed(() => authStore.email)
</script>

<style scoped></style>
