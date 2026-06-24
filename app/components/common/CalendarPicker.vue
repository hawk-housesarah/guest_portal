<template>
  <div class="calendar-popup w-full relative left-1/2 transform -translate-x-1/2" translate="no" @click.stop>
    <!-- 현재 달 네비게이션 -->
    <div class="relative flex items-center justify-between text-lg font-semibold mb-4">
      <img @click.stop="prevMonth" class="pl-3 cursor-pointer" src="/images/common/arrow-left2.svg" />
      <span class="absolute left-1/2 transform -translate-x-1/2 notranslate">
        {{ formattedMonthYear(currentMonth) }}
      </span>
    </div>

    <!-- 날짜 컨테이너 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
      <!-- 현재 달 -->
      <div class="mr-0">
        <div class="grid grid-cols-7 gap-0 text-center text-sm text-primary-success-700 mb-2 border-0">
          <span v-for="d in days" :key="d" class="cal-day-label text-primary-success-700" :data-label="d"></span>
        </div>
        <div class="grid grid-cols-7 gap-0 text-sm text-center leading-none border-0">
          <span
            v-for="(day, idx) in generateDays(currentMonth)"
            :key="idx"
            class="cal-day px-4 py-2 text-md cursor-pointer transition-all duration-200 relative"
            :class="getDayClass(day)"
            :data-day="day.day"
            @click="selectDate(day)"
          ></span>
        </div>
      </div>

      <!-- 다음 달 네비게이션 -->
      <div class="relative flex items-center justify-between text-lg font-semibold mt-6 mb-4">
        <span class="absolute left-1/2 transform -translate-x-1/2 notranslate">
          {{ formattedMonthYear(nextMonthComputed) }}
        </span>
        <img @click.stop="nextMonth" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" src="/images/common/arrow-right2.svg" />
      </div>
      <!-- 다음 달 -->
      <div class="mr-0 pt-3">
        <div class="grid grid-cols-7 gap-0 text-center text-sm text-green-800 mb-2 border-0">
          <span v-for="d in days" :key="d" class="cal-day-label text-primary-success-700" :data-label="d"></span>
        </div>
        <div class="grid grid-cols-7 gap-0 text-sm text-center leading-none border-0">
          <span
            v-for="(day, idx) in generateDays(nextMonthComputed)"
            :key="idx"
            class="cal-day px-4 py-2 text-md cursor-pointer transition-all duration-200 relative"
            :class="getDayClass(day)"
            :data-day="day.day"
            @click="selectDate(day)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
  period: {
    type: Array,
    default: () => [],
  },
  disableClass: {
    type: String,
    default: 'text-brand-yellow-100',
  },
});
const emit = defineEmits(['updateDate']);

const today = dayjs().startOf('day');
const selectedDates = ref([]);
const currentMonth = ref(dayjs().startOf('month'));
const nextMonthComputed = computed(() => currentMonth.value.add(1, 'month'));
const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const formattedMonthYear = (date) => date.format('YYYY.MM');

const setSelectedDates = () => {
  if (props.period.length === 0) return;

  props.period.forEach((val, index) => {
    if (val) {
      const temp = val.split('-');
      if (temp.length === 3) {
        selectedDates.value[index] = dayjs()
          .year(parseInt(temp[0]))
          .month(parseInt(temp[1]) - 1)
          .date(parseInt(temp[2]));
        if (index === 0) {
          currentMonth.value = selectedDates.value[index].startOf('month');
        }
      }
    }
  });
};

const prevMonth = (event) => {
  event.stopPropagation();
  currentMonth.value = currentMonth.value.subtract(1, 'month');
};

const nextMonth = (event) => {
  event.stopPropagation();
  currentMonth.value = currentMonth.value.add(1, 'month');
};

const generateDays = (month) => {
  const startDay = month.startOf('month').day();
  const daysInMonth = month.daysInMonth();
  const daysArray = [];

  for (let i = 0; i < startDay; i++) {
    daysArray.push({ day: '', fullDate: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ day: i, fullDate: month.date(i) });
  }
  return daysArray;
};

const selectDate = (day) => {
  if (!day.fullDate) return;

  if (selectedDates.value.length === 2) {
    selectedDates.value = [day.fullDate];
  } else {
    selectedDates.value.push(day.fullDate);
    selectedDates.value.sort((a, b) => a.unix() - b.unix());
  }

  const dates = selectedDates.value.map((_, index) => selectedDates.value[index].format('YYYY-MM-DD'));
  emit('updateDate', dates);
};

const getDayClass = (day) => {
  if (!day.fullDate) return 'text-gray-400 cursor-default';

  const isSelected = selectedDates.value.some(d => d.isSame(day.fullDate, 'day'));
  const isBetween =
    selectedDates.value.length === 2 &&
    day.fullDate.isAfter(selectedDates.value[0]) &&
    day.fullDate.isBefore(selectedDates.value[1]);

  return {
    'bg-black text-white': isSelected || isBetween,
    'rounded-l-full': selectedDates.value[0] && day.fullDate.isSame(selectedDates.value[0], 'day'),
    'rounded-r-full': selectedDates.value[1] && day.fullDate.isSame(selectedDates.value[1], 'day'),
    'hover:bg-gray-300': !isSelected && !isBetween,
  };
};

onMounted(() => {
  setSelectedDates();
});
</script>

<style scoped>
.calendar-popup {
  max-width: 580px;
  width: 100%;
}

/* 날짜 숫자: CSS content 로 렌더링 → 번역 도구의 DOM 수정 방어 */
.cal-day::after {
  content: attr(data-day);
}
.cal-day-label::after {
  content: attr(data-label);
}

.calendar-popup :deep(font) {
  display: contents;
}
</style>
