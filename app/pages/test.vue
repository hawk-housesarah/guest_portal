<template>
  <div>test...</div>
  <button @click="onMove">이동</button>
</template>

<script setup>
const localePath = useLocalePath();

const onMove = () => {
  navigateTo('/md');
};
</script>
