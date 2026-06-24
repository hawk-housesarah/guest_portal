<template>
  <div id="room-info" class="w-full flex flex-col bg-brand-web-main px-6 pt-6">
    <!-- 카드 박스 -->
    <div class="border-2 border-primary-black-700 bg-brand-web-point text-primary-black-700 p-4 text-xl text-center">
      <p class="font-semibold mt-3" v-html="t('room_info.title', { name: info?.name })"></p>
      <h2 class="font-bold mt-7">WECO STAY {{ info?.location?.[locale] }}</h2>

      <!-- 객실번호 -->
      <div class="flex justify-between items-center pt-4 mt-7">
        <div class="flex items-center text-left gap-1">
          <span>🚪</span>
          <span class="font-bold">{{ t('room_info.room_no') }} :</span>
        </div>
        <div class="font-bold">{{ info?.room_no }}</div>
      </div>

      <!-- 비밀번호 -->
      <div class="flex justify-between items-center border-t-2 border-primary-black-700 pt-4 mt-5">
        <div class="flex items-center text-left gap-1">
          <span>🔐</span>
          <span class="font-bold">{{ t('room_info.password') }} :</span>
        </div>
        <div class="font-bold">{{ info?.passwd }}</div>
      </div>
    </div>

    <!-- 이미지 저장 버튼 -->
    <div class="mt-10 w-full">
      <div
        class="w-full bg-primary-black-700 rounded-md flex justify-center items-center cursor-pointer"
        @click="saveImage"
      >
        <img
          :src="`/images/checkin/save${locale === 'en' ? '_en' : ''}.svg`"
          :alt="t('room_info.save_alt')"
          class="w-42"
          data-html2canvas-ignore="true"
        />
      </div>
      <p class="text-center font-semibold text-base mt-3 break-keep" data-html2canvas-ignore="true">
        {{ t('room_info.save_img_desc') }}
      </p>
    </div>

    <!-- 안내 텍스트 -->
    <div class="my-12 text-base leading-relaxed px-3">
      <ul class="list-disc text-red-600 pl-4 font-semibold">
        <li>{{ t('room_info.text1') }}</li>
      </ul>
      <ul class="list-disc pl-4 mt-4 space-y-2 text-gray-800">
        <li>{{ t('room_info.text2') }}</li>
        <li>{{ t('room_info.text3') }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['checkin-auth'] });

const { t, locale } = useI18n();
const { $getCookie } = useNuxtApp();

const info = $getCookie('checkin-data');

const saveImage = async () => {
  const target = document.getElementById('room-info');
  if (!target) return;

  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(target);
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = 'room_info.png';
  link.click();
};
</script>
