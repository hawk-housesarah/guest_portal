import { cookie } from '@/utils/cookies';

/**
 * 쿠키 읽기, 쓰기 전역 함수 정의
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const cookieObj = cookie({ config });

  const setCookie = (name, value, options) => {
    cookieObj.setCookie(name, value, options);
  };

  const getCookie = (name, options) => {
    return cookieObj.getCookie(name, options);
  };

  nuxtApp.provide('setCookie', setCookie);
  nuxtApp.provide('getCookie', getCookie);
});
