import { getCookie } from 'h3';

/**
 * 짐 보관 로그인 여부 확인 (login-data 쿠키)
 * storage-info 페이지에서 사용
 */
export default defineNuxtRouteMiddleware((to) => {
  const { $getCookie } = useNuxtApp();
  const paths = to.path.split('/');
  const siteCode = paths.length >= 3 ? paths[2] : '';
  const localePath = useLocalePath();

  let info = null, locale = '';

  if (import.meta.client) {
    info = $getCookie('login-data').value;
    locale = $getCookie('i18n_redirected').value || 'en';
  } else {
    const event = useRequestEvent();
    info = getCookie(event, 'login-data');
    locale = getCookie(event, 'i18n_redirected') || 'en';
  }

  if (!info) {
    return navigateTo(localePath(`/${siteCode}/login`, locale));
  }
});
