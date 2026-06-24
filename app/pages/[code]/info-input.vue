<template>
  <div class="w-full flex flex-col px-6 pt-6">
    <!-- 이메일 입력 -->
    <section v-if="!isError" class="mt-10">
      <h2 class="text-lg font-bold">{{ t('info_input.email') }}</h2>
      <div
        class="flex items-center w-full bg-brand-web-point mt-3"
        :class="emailMsg ? 'border border-primary-error-600' : ''"
      >
        <input
          type="email"
          inputmode="email"
          autocapitalize="off"
          v-model="email"
          :placeholder="t('info_input.email_placeholder')"
          class="noautofill flex-grow min-w-0 bg-transparent px-4 py-3 text-primary-black-700 placeholder-primary-black-400 outline-none"
          ref="email-ref"
        />
        <div v-if="!isVerifiedCode && !isSentCode" class="text-right flex-shrink-0 min-w-[70px]">
          <button @click="requestEmailAuthCode" class="ml-auto border border-primary-black-700 text-primary-black-700 text-sm px-3 py-1 mr-2 rounded-full">
            {{ t('info_input.button.send') }}
          </button>
        </div>
        <div v-if="!isVerifiedCode && isSentCode" class="text-right flex-shrink-0 min-w-[70px]">
          <span class="ml-auto text-primary-black-400 text-sm px-3 py-1">{{ t('info_input.button.sent') }}</span>
        </div>
        <div v-if="isVerifiedCode" class="text-right flex-shrink-0 min-w-[75px]">
          <span class="ml-auto text-primary-black-700 font-bold text-sm px-3 py-1">{{ t('info_input.button.verified') }}</span>
        </div>
      </div>
      <p v-if="emailMsg" class="text-primary-error-600 font-semibold text-sm my-2 ml-1">{{ emailMsg }}</p>

      <!-- 인증번호 입력 -->
      <div
        v-if="isSentCode && !isVerifiedCode"
        class="flex items-center w-full bg-brand-web-point mt-2"
        :class="verifyCodeMsg ? 'border border-primary-error-600' : ''"
      >
        <input
          type="password"
          v-model="verifyCode"
          :placeholder="t('info_input.email_authcode_placeholder')"
          class="noautofill bg-transparent flex-grow min-w-0 px-4 py-3 text-primary-black-700 placeholder-primary-black-400 outline-none"
          ref="verify-code-ref"
        />
        <div class="text-right flex-shrink-0 min-w-[70px]">
          <button @click="verifyEmailAuthCode" class="ml-auto border text-primary-black-700 border-primary-black-700 text-sm px-3 py-1 mr-2 rounded-full">
            {{ t('info_input.button.verify') }}
          </button>
        </div>
      </div>
      <div
        v-if="isSentCode && !isVerifiedCode"
        class="flex items-center text-sm mt-3"
        :class="verifyCodeMsg ? 'text-primary-error-600' : 'w-full text-primary-info-600'"
      >
        <span class="pl-1" :class="!verifyCodeMsg ? 'flex-1' : ''">
          {{ verifyCodeMsg ? verifyCodeMsg : t('info_input.email_verify_msg') }}
        </span>
        <span v-if="!verifyCodeMsg" @click="requestEmailAuthCode" class="ml-auto font-bold text-sm px-3 py-1 mr-2">
          {{ t('info_input.button.resend') }}
        </span>
        <button v-if="verifyCodeMsg && showResendBtn" @click="requestEmailAuthCode" class="underline pl-4">
          {{ t('info_input.email_send_again') }}
        </button>
      </div>
    </section>

    <!-- 안내 문구 -->
    <div class="mt-5 px-1 text-base text-primary-black-700 leading-snug">
      <ul class="space-y-2">
        <li class="flex items-start">
          <div class="mt-2 ml-1 mr-2 w-1 h-1 rounded-full bg-primary-black-700 shrink-0"></div>
          <span>{{ t('info_input.email_verify_help') }}</span>
        </li>
        <li class="flex items-start">
          <div class="mt-2 ml-1 mr-2 w-1 h-1 rounded-full bg-primary-black-700 shrink-0"></div>
          <span>{{ t('info_input.email_verify_timeout') }}</span>
        </li>
      </ul>
    </div>

    <!-- 동의 체크박스 -->
    <section v-if="!isError" class="mt-3">
      <div class="flex flex-col space-y-4 px-1 py-5">
        <label class="flex items-start space-x-2 cursor-pointer">
          <input type="checkbox" v-model="agreeRequired" class="mt-1 scale-150 accent-primary-black-700" />
          <span
            class="text-sm leading-snug pl-2"
            :class="agreeRequiredAlert ? 'font-semibold text-primary-error-600' : 'text-primary-black-700'"
          >
            {{ t('info_input.agree_required') }}
          </span>
        </label>
        <label class="flex items-start space-x-2 cursor-pointer">
          <input type="checkbox" v-model="agreeMarketing" class="mt-1 scale-150 accent-primary-black-700" />
          <span class="text-sm text-primary-black-700 leading-snug pl-2">{{ t('info_input.agree_option') }}</span>
        </label>
      </div>
    </section>

    <!-- 하단 버튼 -->
    <div v-if="!isError" class="mt-10">
      <button @click="goNext" class="w-full py-4 bg-primary-black-700 text-brand-web-main text-lg font-bold rounded">
        {{ t('info_input.button.next') }}
      </button>
    </div>

    <!-- 에러 -->
    <div v-if="isError" class="text-center bg-web-brand p-5">
      <div class="flex justify-center">
        <img src="/images/checkin/alert.svg" alt="alert" class="w-13 mt-10 mb-5" />
      </div>
      <p class="text-lg font-bold mb-14 text-primary-black-700" v-html="t('info_input.error.message')"></p>
      <button @click="goBack()" class="w-[calc(100%-1rem)] max-w-md mx-auto py-3 text-brand-web-main bg-primary-black-700 rounded-md font-semibold">
        {{ t('checkin_form.already.back_btn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { CHECKIN } from '@/constants/checkin';
import { EMAIL } from '@/constants/pattern';

definePageMeta({ middleware: ['checkin-auth'] });

const route = useRoute();
const { $getCookie } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const checkinID = ref('');
const email = ref('');
const how = ref('');
const agreeRequired = ref(false);
const agreeMarketing = ref(false);
const verifyCode = ref('');
const isSentCode = ref(false);
const isVerifiedCode = ref(false);
const showResendBtn = ref(false);
const isError = ref(false);

const emailMsg = ref('');
const verifyCodeMsg = ref('');
const agreeRequiredAlert = ref(false);

const emailRef = useTemplateRef('email-ref');
const verifyCodeRef = useTemplateRef('verify-code-ref');

const howOptions = CHECKIN.how[locale.value === 'ko' ? 'ko' : 'en'];

watch(email, () => { emailMsg.value = ''; initSendData(); });
watch(verifyCodeRef, (newVal) => { if (newVal) newVal.focus(); });
watch(verifyCode, () => { verifyCodeMsg.value = ''; showResendBtn.value = false; });
watch(agreeRequired, () => { agreeRequiredAlert.value = false; });

onMounted(() => {
  const info = $getCookie('checkin-data');
  checkinID.value = info.value.id;
});

const initSendData = () => {
  emailMsg.value = '';
  verifyCodeMsg.value = '';
  showResendBtn.value = false;
  isSentCode.value = false;
  verifyCode.value = '';
  isVerifiedCode.value = false;
};

const requestEmailAuthCode = async () => {
  if (!email.value) {
    emailMsg.value = t('info_input.email_required');
    emailRef.value.focus();
    return;
  } else if (!EMAIL.test(email.value)) {
    emailMsg.value = t('common.email_invalid');
    emailRef.value.focus();
    return;
  }

  await getEmailAuthCode(email.value);
  initSendData();
  isSentCode.value = true;
  verifyCodeRef.value?.focus();
};

const verifyEmailAuthCode = async () => {
  if (!email.value) { emailMsg.value = t('info_input.email_required'); emailRef.value.focus(); return; }
  if (!verifyCode.value) { verifyCodeMsg.value = t('info_input.email_authcode_required'); verifyCodeRef.value.focus(); return; }

  const result = await confirmEmailAuthCode(email.value, verifyCode.value);
  if (result) {
    isVerifiedCode.value = true;
    verifyCodeMsg.value = '';
  } else {
    showResendBtn.value = true;
    verifyCodeMsg.value = t('info_input.email_authcode_invalid');
  }
};

const requiredCheck = () => {
  let isValid = true;

  if (!email.value) { isValid = false; emailMsg.value = t('info_input.email_required'); }
  if (email.value) {
    if (!EMAIL.test(email.value)) { if (isValid) isValid = false; emailMsg.value = t('common.email_invalid'); }
    else if (!isSentCode.value) { if (isValid) isValid = false; emailMsg.value = t('info_input.email_auth_required'); }
    else if (!isVerifiedCode.value && !verifyCode.value) { if (isValid) isValid = false; verifyCodeMsg.value = t('info_input.email_authcode_required'); showResendBtn.value = false; }
    else if (!isVerifiedCode.value && verifyCode.value) { if (isValid) isValid = false; verifyCodeMsg.value = t('info_input.email_verify_required'); showResendBtn.value = false; }
  }
  if (!agreeRequired.value) { if (isValid) isValid = false; agreeRequiredAlert.value = true; }
  if (emailMsg.value) { emailRef.value.focus(); } else if (verifyCodeMsg.value) { verifyCodeRef.value.focus(); }

  return isValid;
};

const goNext = async () => {
  if (!requiredCheck()) return;

  const res = await checkinInfoSave(checkinID.value, email.value, how.value, agreeMarketing.value);
  if (res.result !== 'ok') {
    isError.value = true;
  } else {
    navigateTo(localePath(`/${route.params.code}/room-info`));
  }
};

const goBack = () => { window.location.href = localePath(`/${route.params.code}/check-in`); };
</script>

<style scoped>
input.noautofill:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #FBEDBF inset !important;
  -webkit-text-fill-color: #000 !important;
}
</style>
