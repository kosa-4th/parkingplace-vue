<template>
  <div>
    <!-- <h3>UserCmp</h3> -->
     <p>userComp</p>
    <p >Welcome, {{ username }}!</p>
    <p >Your email: {{ email }}</p>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { AuthStore } from '@/stores/store';
import { computed } from 'vue';

const authStore = AuthStore();

const username = computed(() => authStore.username);
const email = computed(() => authStore.email);
</script>

<style></style>
