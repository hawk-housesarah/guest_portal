<template>
  <div class="w-full flex flex-col p-6">
    <header class="flex items-center justify-between">
      <img @click="back" src="/images/common/arrow-left.svg" alt="뒤로가기" class="w-6 h-6" />
      <!-- 체크인: logo-b.svg (h-3), 짐보관: logo.svg (h-6) -->
      <img
        @click="home"
        :src="isLuggage ? '/images/common/logo.svg' : '/images/common/logo-b.svg'"
        alt="로고"
        :class="isLuggage ? 'h-6' : 'h-3'"
      />
      <div class="w-6 h-6"></div>
    </header>
  </div>
</template>

<script setup>
const { isLuggage } = useMode();
const localePath = useLocalePath();
const route = useRoute();

const back = () => {
  const paths = route.path.split('/');
  const pathName = paths.length >= 4 ? paths[3] : '';

  let url = localePath(`/${route.params.code}`);

  if (isLuggage.value) {
    switch (pathName) {
      case 'storage-info':
        url = localePath(`/${route.params.code}/login`);
        break;
    }
  } else {
    switch (pathName) {
      case 'info-input':
        url = localePath(`/${route.params.code}/check-in`);
        break;
      case 'room-info':
        url = localePath(`/${route.params.code}/info-input`);
        break;
    }
  }

  navigateTo(url);
};

const home = () => {
  navigateTo(localePath(`/${route.params.code}`));
};
</script>
