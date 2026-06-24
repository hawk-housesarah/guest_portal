// ──────────────────────────────────────────────
// 체크인 API
// ──────────────────────────────────────────────

/**
 * 체크인 인증
 * @param {string} site 지점코드
 * @param {string} checkin 체크인날짜 (YYYYMMDD)
 * @param {string} checkout 체크아웃날짜 (YYYYMMDD)
 * @param {string} name 이름
 * @returns {object<result: 'ok' | 'fail', code: string, data: object>}
 */
export const checkinAuth = async (site, checkin, checkout, name) => {
  const config = useRuntimeConfig();
  const { data, error } = await useNuxtApp().$sendPost({
    url: `${config.public.apiHost2}/${config.public.apiVersion}/lobby/check-in`,
    headers: { credentials: 'include' },
    data: { site, checkin, checkout, name },
    platform: false,
  });

  return data ?? error.response?._data;
};

/**
 * 체크인 정보 저장 (이메일, 유입경로, 마케팅 동의)
 */
export const checkinInfoSave = async (id, email, how, agree_marketing) => {
  const config = useRuntimeConfig();
  const { $i18n } = useNuxtApp();

  const { data, error } = await useNuxtApp().$sendPost({
    url: `${config.public.apiHost2}/${config.public.apiVersion}/lobby/checkin-save`,
    headers: { credentials: 'include' },
    data: {
      id,
      email,
      how,
      agree_marketing,
      locale: $i18n.locale.value,
      listId: Number(config.public.stibeeListId),
    },
    platform: false,
  });

  return data ?? error.response?._data;
};

/**
 * 이메일 인증코드 요청
 * @returns {boolean} true: 성공
 */
export const getEmailAuthCode = async (email) => {
  const config = useRuntimeConfig();
  const { $i18n, $sendGet } = useNuxtApp();

  const { error } = await $sendGet({
    url: `${config.public.authApiHost}/${config.public.apiVersion}/auth/mail-validation?lang=${$i18n.locale.value}&email=${email}&menu=wecostay_qr_checkin`,
  });

  return !error;
};

/**
 * 이메일 인증코드 확인
 * @returns {boolean} true: 성공
 */
export const confirmEmailAuthCode = async (email, code) => {
  const config = useRuntimeConfig();
  const { data } = await useNuxtApp().$sendGet({
    url: `${config.public.authApiHost}/${config.public.apiVersion}/auth/mail-confirmed?menu=wecostay_qr_checkin&email=${email}&code=${code}`,
  });

  return data?.matched === true;
};

// ──────────────────────────────────────────────
// 짐 보관 API
// ──────────────────────────────────────────────

/**
 * 짐 보관 로그인 인증
 * @param {string} site 지점코드
 * @param {string} checkin 체크인날짜 (YYYYMMDD)
 * @param {string} checkout 체크아웃날짜 (YYYYMMDD)
 * @param {string} name 이름
 * @returns {object<result: 'ok' | 'fail', code: string, data: object>}
 */
export const loginAuth = async (site, checkin, checkout, name) => {
  const config = useRuntimeConfig();
  const { data, error } = await useNuxtApp().$sendPost({
    url: `${config.public.apiHost2}/${config.public.apiVersion}/lobby/lugg-stor-login`,
    headers: { credentials: 'include' },
    data: { site, checkin, checkout, name },
    platform: false,
  });

  return data ?? error.response?._data;
};
