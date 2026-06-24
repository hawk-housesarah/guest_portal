import { getCookie } from 'h3';
import { CHECKIN } from '@/constants/checkin';
import { LUGGAGE } from '@/constants/luggage';

/**
 * 글로벌 미들웨어
 * 1. locale prefix 없는 URL → /{cookieLocale}/{path} 리다이렉트
 * 2. 유효하지 않은 siteCode → 404
 * 3. 호스트 기반으로 체크인/짐보관 사이트 코드 테이블 분기
 */
export default defineNuxtRouteMiddleware((to) => {
  const { $i18n, $getCookie } = useNuxtApp();
  const localePath = useLocalePath();
  const paths = to.path.split('/');
  const localeCodes = $i18n.locales.value.map(item => item.code);

  let locale = '';
  let isLuggage = false;

  if (import.meta.client) {
    locale = $getCookie('i18n_redirected').value || 'en';
    isLuggage = window.location.hostname.startsWith('luggage.');
  } else {
    const event = useRequestEvent();
    locale = getCookie(event, 'i18n_redirected') || 'en';
    const host = event?.node?.req?.headers?.host ?? '';
    isLuggage = host.startsWith('luggage.');
  }

  const SITE = isLuggage ? LUGGAGE.site : CHECKIN.site;
  const prefix = paths[1];

  // locale prefix 없는 경우 리다이렉트
  if (prefix.length !== 2 || !localeCodes.includes(prefix)) {
    const redirectUrl = localePath(to.fullPath, locale);
    if (to.fullPath !== redirectUrl) {
      return navigateTo(redirectUrl);
    }
  } else {
    const siteCode = paths.length >= 3 ? paths[2] : '';

    if (!siteCode || (siteCode !== 'test' && !SITE[siteCode])) {
      return abortNavigation(
        createError({ statusCode: 404, statusMessage: 'Not found' })
      );
    }
    return;
  }
});
