<template>
  <div id="storage-info" class="w-full flex flex-col bg-brand-web-main px-6 pt-6">
    <!-- 카드 박스 -->
    <div class="border-2 border-primary-black-700 bg-brand-web-point text-primary-black-700 p-5 pb-8 text-xl text-center">
      <h2 class="font-bold mt-3">{{ t('storage_info.title') }}</h2>

      <!-- 오늘 비밀번호 -->
      <div class="flex justify-between items-center pt-4 mt-7">
        <div class="flex items-center text-left gap-1">
          <span>🔐</span>
          <span class="font-bold">{{ t('storage_info.today_password') }} :</span>
        </div>
        <div class="font-bold">{{ displayPassword.todayPassword }}</div>
      </div>

      <!-- 내일 비밀번호 -->
      <div class="flex justify-between items-center border-t-2 border-primary-black-700 pt-4 mt-5">
        <div class="flex items-center text-left gap-1">
          <span>🔐</span>
          <span class="font-bold">{{ t('storage_info.tomorrow_password') }} :</span>
        </div>
        <div class="font-bold">{{ displayPassword.tomorrowPassword }}</div>
      </div>
    </div>

    <!-- 안내 텍스트 -->
    <div class="my-8 text-base leading-relaxed px-3">
      <ul class="list-disc text-primary-black-700 pl-4">
        <li>{{ t('storage_info.text') }}</li>
      </ul>
    </div>

    <!-- 확인 버튼 -->
    <div class="mt-5">
      <button @click="goNext" class="w-full py-4 bg-primary-black-700 text-brand-web-main text-lg font-bold rounded">
        {{ t('storage_info.ok_btn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] });

const { t } = useI18n();
const { $getCookie } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const info = $getCookie('login-data');

const displayPassword = computed(() => {
  const suffix = route.params.code === 'cnn' ? '#' : '*';
  let todayPassword = '';
  let tomorrowPassword = '';

  if (info.value?.today_password) {
    const p = String(info.value.today_password);
    todayPassword = p.endsWith(suffix) ? p : `${p.replace(/[*#]$/, '')}${suffix}`;
  }

  if (info.value?.tomorrow_password) {
    const p = String(info.value.tomorrow_password);
    tomorrowPassword = p.endsWith(suffix) ? p : `${p.replace(/[*#]$/, '')}${suffix}`;
  }

  return { todayPassword, tomorrowPassword };
});

const goNext = () => {
  navigateTo(localePath(`/${route.params.code}`));
};
</script>
