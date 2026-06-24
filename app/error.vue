<template>
  <div>
    <h1 v-if="error?.statusCode === 404">404 - 페이지를 찾을 수 없습니다</h1>
    <h1 v-else>에러 발생: {{ error?.statusCode }}</h1>
    <p>{{ error?.message }}</p>
    <NuxtLink :to="home">홈으로</NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

const localePath = useLocalePath();
const home = localePath('/md');
</script>
