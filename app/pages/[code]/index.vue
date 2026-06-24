<template>
  <!-- ───────────── 체크인 모드 ───────────── -->
  <div v-if="!isLuggage" class="w-full flex flex-col px-6 pt-10">
    <div class="mb-4 text-primary-black-900">
      <p class="text-xl font-bold mb-1">WECO STAY {{ CHECKIN.site[siteCode]?.['en'] }}</p>
      <p class="text-xl font-bold">위코스테이 {{ CHECKIN.site[siteCode]?.['ko'] }}</p>
    </div>

    <div class="mb-10">
      <h1 class="flex items-center text-[#101010] font-bold">
        <span class="text-[2.5rem]">CHECK - IN</span>
        <span class="ml-3 text-[1.9rem] font-normal">체크인</span>
      </h1>
      <div class="w-full border-t-2 border-black mt-3"></div>
    </div>

    <div class="w-full mb-14">
      <img src="/images/main/main.svg" alt="main illustration" class="w-full h-auto object-contain" />
    </div>

    <div class="mb-12 text-primary-black-700">
      <p class="text-2xl font-semibold">Please select a language.</p>
      <p class="text-[1.3rem]">언어를 선택해 주세요.</p>
    </div>

    <div class="w-full flex justify-center text-primary-black-700 gap-4">
      <button
        @click="goCheckin('ko')"
        class="py-4 w-full border-[0.15rem] border-primary-black-700 rounded-md text-lg font-semibold"
      >
        한국어
      </button>
      <button
        @click="goCheckin('en')"
        class="py-4 w-full border-[0.15rem] border-primary-black-700 rounded-md text-lg font-semibold"
      >
        English
      </button>
    </div>
  </div>

  <!-- ───────────── 짐 보관 모드 ───────────── -->
  <div v-else class="w-full flex flex-col px-6 pt-10">
    <div class="mb-2 text-primary-black-900">
      <p class="text-[1.2rem] font-bold mb-1">WECO STAY {{ LUGGAGE.site[siteCode]?.['en'] }}</p>
      <p class="text-[1.2rem] font-bold">위코스테이 {{ LUGGAGE.site[siteCode]?.['ko'] }}</p>
    </div>

    <div class="mb-5">
      <h1 class="flex items-center text-[#101010] font-bold">
        <span class="text-[1.7rem]">Luggage Storage</span>
      </h1>
      <div class="text-[1.5em] font-normal">짐 보관소</div>
      <div class="w-full border-t-2 border-black mt-3"></div>
    </div>

    <div class="w-full mb-6">
      <img src="/images/main/main.svg" alt="main" class="w-1/2 h-auto object-contain mx-auto" />
    </div>

    <div class="mb-10 text-primary-black-700">
      <p class="text-[1.5rem] font-semibold">Please select a language.</p>
      <p class="text-[1.2rem]">언어를 선택해 주세요.</p>
    </div>

    <div class="w-full flex justify-center text-primary-black-700 gap-4">
      <button
        @click="goLogin('ko')"
        class="py-4 w-full border-[0.15rem] border-primary-black-700 rounded-md text-lg font-bold"
      >
        한국어
      </button>
      <button
        @click="goLogin('en')"
        class="py-4 w-full border-[0.15rem] border-primary-black-700 rounded-md text-xl font-bold"
      >
        English
      </button>
    </div>
  </div>
</template>

<script setup>
import { CHECKIN } from '@/constants/checkin';
import { LUGGAGE } from '@/constants/luggage';

definePageMeta({ layout: 'home' });

const { isLuggage } = useMode();
const route = useRoute();
const siteCode = route.params.code;

const goCheckin = (locale) => navigateTo(`/${locale}/${siteCode}/check-in`);
const goLogin = (locale) => navigateTo(`/${locale}/${siteCode}/login`);
</script>
