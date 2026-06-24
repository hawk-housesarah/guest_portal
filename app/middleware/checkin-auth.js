import { getCookie } from 'h3';

/**
 * 체크인 인증 여부 확인 (checkin-data 쿠키)
 * room-info, info-input 페이지에서 사용
 */
export default defineNuxtRouteMiddleware((to) => {
  const { $getCookie } = useNuxtApp();
  const paths = to.path.split('/');
  const siteCode = paths.length >= 3 ? paths[2] : '';
  const localePath = useLocalePath();

  let info = null, locale = '';

  if (import.meta.client) {
    info = $getCookie('checkin-data').value;
    locale = $getCookie('i18n_redirected').value || 'en';
  } else {
    const event = useRequestEvent();
    info = getCookie(event, 'checkin-data');
    locale = getCookie(event, 'i18n_redirected') || 'en';
  }

  if (!info) {
    return navigateTo(localePath(`/${siteCode}/check-in`, locale));
  }
});
