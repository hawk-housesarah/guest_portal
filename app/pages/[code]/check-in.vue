<template>
  <div class="w-full flex flex-col px-6 pt-6">
    <!-- 예약자 성함 -->
    <section v-if="showForm" class="mt-10">
      <h2 class="text-lg font-bold">{{ t('checkin_form.name') }}</h2>
      <input
        type="text"
        v-model="name"
        :placeholder="t('checkin_form.name_placeholder')"
        class="w-full mt-3 p-3 bg-brand-web-point text-primary-black-700 placeholder-primary-black-400 focus:outline-none"
        :class="nameMsg ? 'border border-primary-error-600' : ''"
        ref="name-ref"
      />
      <p v-if="nameMsg" class="text-primary-error-600 font-semibold text-sm mt-2">{{ nameMsg }}</p>
    </section>

    <!-- 머무는 날짜 -->
    <section v-if="showForm" class="mt-10 relative">
      <h2 class="text-lg font-bold">{{ t('checkin_form.period') }}</h2>
      <div
        @click="togglePeriod"
        :class="{ 'border border-primary-error-600': periodMsg }"
        class="w-full mt-3 p-3 bg-brand-web-point relative"
        ref="period-info-ref"
      >
        <span :class="{ 'text-primary-black-400': selectedDates.length === 0 }">{{ period }}</span>
        <span class="absolute right-3 top-1/2 -translate-y-1/2">
          <svg v-if="isPeriodPopup" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      <div
        ref="period-popup-ref"
        v-if="isPeriodPopup"
        class="absolute top-full left-0 w-full p-4 z-20 mt-2 bg-brand-web-point"
        @click="(event) => event.stopPropagation()"
      >
        <CalendarPicker
          :period="selectedDates"
          :disable-class="`text-primary-black-300`"
          @update-date="updateDate"
          class="justify-center"
        />
      </div>
      <p v-if="periodMsg" class="text-primary-error-600 font-semibold text-sm mt-2">{{ periodMsg }}</p>
    </section>

    <!-- 하단 버튼 -->
    <div v-if="showForm" class="mt-32">
      <button @click="goNext" class="w-full py-4 bg-primary-black-700 text-brand-web-main text-lg font-bold rounded">
        {{ t('checkin_form.next_btn') }}
      </button>
    </div>

    <!-- 오류 횟수 초과 -->
    <div v-if="isError" class="text-center bg-web-brand p-5">
      <p class="text-lg font-bold mt-1 mb-3 text-primary-black-700" v-html="t('checkin_form.fail_exceed.message')"></p>
      <p class="text-base text-primary-black-600 mb-14" v-html="t('checkin_form.fail_exceed.desc', { branch: CHECKIN.site[route.params.code]?.[locale] })"></p>
      <button @click="goMessenger()" class="w-[calc(100%-1rem)] max-w-md mx-auto py-3 mb-3 text-brand-web-main bg-primary-black-700 rounded-md font-semibold">
        {{ t('checkin_form.fail_exceed.messenger_btn') }}
      </button>
      <button @click="goBack()" class="w-[calc(100%-1rem)] max-w-md mx-auto py-3 text-brand-web-main bg-primary-black-700 rounded-md font-semibold">
        {{ t('checkin_form.fail_exceed.back_btn') }}
      </button>
    </div>

    <!-- 이미 체크인 완료 -->
    <div v-if="isAlready" class="text-center bg-web-brand p-5">
      <div class="flex justify-center">
        <img src="/images/checkin/alert.svg" alt="alert" class="w-13 mt-1 mb-4" />
      </div>
      <p class="text-lg font-bold mb-5 text-primary-black-700" v-html="t('checkin_form.already.message')"></p>
      <p class="text-base text-primary-black-600 mb-14" v-html="t('checkin_form.already.desc')"></p>
      <button @click="goBack()" class="w-[calc(100%-1rem)] max-w-md mx-auto py-3 text-brand-web-main bg-primary-black-700 rounded-md font-semibold">
        {{ t('checkin_form.already.back_btn') }}
      </button>
    </div>

    <!-- 중복 예약 -->
    <div v-if="isDouble" class="text-center bg-web-brand p-5">
      <p class="text-lg font-bold mt-1 mb-3 text-primary-black-700" v-html="t('checkin_form.double.message')"></p>
      <p class="text-base text-primary-black-600 mb-14" v-html="t('checkin_form.double.desc', { tel: CHECKIN.tel[route.params.code] })"></p>
      <button @click="goMessenger()" class="w-[calc(100%-1rem)] max-w-md mx-auto py-3 mb-3 text-brand-web-main bg-primary-black-700 rounded-md font-semibold">
        {{ t('checkin_form.double.messenger_btn') }}
      </button>
      <button @click="goBack()" class="w-[calc(100%-1rem)] max-w-md mx-auto py-3 text-brand-web-main bg-primary-black-700 rounded-md font-semibold">
        {{ t('checkin_form.double.back_btn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import CalendarPicker from '@/components/common/CalendarPicker.vue';
import { CHECKIN } from '@/constants/checkin';

const { t, locale } = useI18n();
const { $setCookie } = useNuxtApp();
const localePath = useLocalePath();
const route = useRoute();

const name = ref('');
const selectedDates = ref([]);
const nameMsg = ref('');
const periodMsg = ref('');
const isPeriodPopup = ref(false);
const isError = ref(false);
const isAlready = ref(false);
const isDouble = ref(false);
const allowErrorCount = 5;
const errorCount = ref(0);

const nameRef = useTemplateRef('name-ref');
const periodInfoRef = useTemplateRef('period-info-ref');
const periodPopupRef = useTemplateRef('period-popup-ref');

onClickOutside(periodPopupRef, () => {
  isPeriodPopup.value = false;
}, { ignore: [periodInfoRef] });

onMounted(() => {
  $setCookie('checkin-data', null);
});

const period = computed(() => {
  if (selectedDates.value.length === 0) return t('checkin_form.period_placeholder');
  if (selectedDates.value.length === 1) return `${selectedDates.value[0].replace(/-/g, '.')} -`;
  return `${selectedDates.value[0].replace(/-/g, '.')} - ${selectedDates.value[1].replace(/-/g, '.')}`;
});

const showForm = computed(() => !isError.value && !isAlready.value && !isDouble.value);

watch(name, (newVal) => { if (newVal) nameMsg.value = ''; });
watch(selectedDates, (newVal) => { if (newVal.length === 2) periodMsg.value = ''; });

const togglePeriod = () => { isPeriodPopup.value = !isPeriodPopup.value; };

const updateDate = (dateRange) => {
  selectedDates.value = dateRange;
  if (selectedDates.value.length === 2) isPeriodPopup.value = false;
};

const requiredCheck = () => {
  let isValid = true;
  name.value = name.value.replace(/^\s+|\s+$/, '');

  if (!name.value) {
    isValid = false;
    nameMsg.value = t('checkin_form.name_required');
  }
  if (selectedDates.value.length !== 2) {
    if (isValid) isValid = false;
    periodMsg.value = t('checkin_form.period_required');
  }
  if (nameMsg.value) nameRef.value.focus();
  return isValid;
};

const goNext = async () => {
  if (!requiredCheck()) return;

  const checkin = selectedDates.value[0].replace(/-/g, '');
  const checkout = selectedDates.value[1].replace(/-/g, '');
  const res = await checkinAuth(route.params.code, checkin, checkout, name.value);

  if (res.result !== 'ok') {
    if (res.code === 'already_checkin') {
      isAlready.value = true;
    } else if (res.code === 'multiple_match_found') {
      isDouble.value = true;
    } else {
      if (errorCount.value >= allowErrorCount) {
        isError.value = true;
        return;
      }
      errorCount.value++;
      nameMsg.value = t('checkin_form.name_error');
      periodMsg.value = t('checkin_form.period_error');
    }
  } else {
    $setCookie('checkin-data', res.data);
    await nextTick();
    await navigateTo(localePath(`/${route.params.code}/info-input`));
  }
};

const goMessenger = () => window.open('https://lq766.channel.io/home', '_blank');
const goBack = () => { window.location.href = localePath(`/${route.params.code}/check-in`); };
</script>
