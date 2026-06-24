<template>
  <div class="w-full flex flex-col px-6 pt-6">
    <!-- 예약자 성함 -->
    <section class="mt-10">
      <h2 class="text-lg font-bold">{{ t('login_form.name') }}</h2>
      <input
        type="text"
        v-model="name"
        :placeholder="t('login_form.name_placeholder')"
        class="w-full mt-3 p-3 bg-brand-web-point text-primary-black-700 placeholder-primary-black-400 focus:outline-none"
        :class="nameMsg ? 'border border-primary-error-600' : ''"
        ref="name-ref"
      />
      <p v-if="nameMsg" class="text-primary-error-600 font-semibold text-sm mt-2">{{ nameMsg }}</p>
    </section>

    <!-- 머무는 날짜 -->
    <section class="mt-10 relative">
      <h2 class="text-lg font-bold">{{ t('login_form.period') }}</h2>
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
    <div class="mt-32">
      <button @click="goNext" class="w-full py-4 bg-primary-black-700 text-brand-web-main text-lg font-bold rounded">
        {{ t('login_form.next_btn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import CalendarPicker from '@/components/common/CalendarPicker.vue';

const { t } = useI18n();
const { $setCookie } = useNuxtApp();
const localePath = useLocalePath();
const route = useRoute();

const name = ref('');
const selectedDates = ref([]);
const nameMsg = ref('');
const periodMsg = ref('');
const isPeriodPopup = ref(false);

const nameRef = useTemplateRef('name-ref');
const periodInfoRef = useTemplateRef('period-info-ref');
const periodPopupRef = useTemplateRef('period-popup-ref');

onClickOutside(periodPopupRef, () => { isPeriodPopup.value = false; }, { ignore: [periodInfoRef] });

onMounted(() => {
  $setCookie('login-data', null);
});

const period = computed(() => {
  if (selectedDates.value.length === 0) return t('login_form.period_placeholder');
  if (selectedDates.value.length === 1) return `${selectedDates.value[0].replace(/-/g, '.')} -`;
  return `${selectedDates.value[0].replace(/-/g, '.')} - ${selectedDates.value[1].replace(/-/g, '.')}`;
});

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

  if (!name.value) { isValid = false; nameMsg.value = t('login_form.name_required'); }
  if (selectedDates.value.length !== 2) { if (isValid) isValid = false; periodMsg.value = t('login_form.period_required'); }
  if (nameMsg.value) nameRef.value.focus();
  return isValid;
};

const goNext = async () => {
  if (!requiredCheck()) return;

  const checkin = selectedDates.value[0].replace(/-/g, '');
  const checkout = selectedDates.value[1].replace(/-/g, '');
  const res = await loginAuth(route.params.code, checkin, checkout, name.value);

  if (res.result !== 'ok') {
    nameMsg.value = t('login_form.name_error');
    periodMsg.value = t('login_form.period_error');
  } else {
    $setCookie('login-data', res.data);
    await nextTick();
    await navigateTo(localePath(`/${route.params.code}/storage-info`));
  }
};
</script>
