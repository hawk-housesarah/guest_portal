import { getCountryCallingCode } from 'libphonenumber-js';

export const useIsMobile = () => {
  const isMobile = ref(false);

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 1024;
  };

  onMounted(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  });
  onUnmounted(() => window.removeEventListener('resize', checkIsMobile));

  return isMobile;
};

export const getLocaleInfo = () => {
  const { $i18n } = useNuxtApp();
  const currLocale = $i18n.locale.value;
  const defaultLocale = $i18n.defaultLocale;
  const language = $i18n.locales.value.find(item => item.code === currLocale)?.language;
  const defaultLanguage = $i18n.locales.value.find(item => item.code === defaultLocale)?.language;

  return {
    currLocale,
    defaultLocale,
    lang: language?.replace(/-/g, '_') ?? 'en_US',
    defaultLang: defaultLanguage?.replace(/-/g, '_') ?? 'en_US',
  };
};

export const getObjectByLang = (item, lang = 'en_US', defaultLang = 'en_US') => {
  if (!Array.isArray(item)) return null;

  return item.find(infoItem => infoItem.language === lang)
    ?? (lang !== defaultLang ? item.find(infoItem => infoItem.language === defaultLang) : null)
    ?? item[0]
    ?? null;
};

export const getObjectByLocale = (item, locale = 'en', defaultLocale = 'en') => {
  if (!Array.isArray(item)) return null;

  return item.find(infoItem => infoItem.language === locale)
    ?? (locale !== defaultLocale ? item.find(infoItem => infoItem.language === defaultLocale) : null)
    ?? item[0]
    ?? null;
};

export const isEqualObject = (newObj, oldObj, exceptKeys = []) => {
  const newKeys = Object.keys(newObj ?? {});
  const oldKeys = Object.keys(oldObj ?? {});

  if (newKeys.length !== oldKeys.length) return false;
  if (!newKeys.every(key => oldKeys.includes(key))) return false;

  return newKeys.every(key => {
    if (exceptKeys.includes(key)) return true;
    return newObj[key] === oldObj[key];
  });
};

export const getCountries = () => {
  const { $countries } = useNuxtApp();
  const { currLocale, lang } = getLocaleInfo();
  const countryCodes = $countries.getAlpha2Codes();

  const countries = [];
  const userCountryCode = lang.split('_')[1].toUpperCase();

  countries.push({
    code: userCountryCode,
    code2: $countries.alpha2ToAlpha3(userCountryCode),
    callingCode: getCountryCallingCode(userCountryCode),
    name: $countries.getName(userCountryCode, currLocale),
  });

  Object.keys(countryCodes)
    .filter(code => code !== userCountryCode)
    .sort((m, n) => {
      const mName = $countries.getName(m, currLocale);
      const nName = $countries.getName(n, currLocale);
      return mName.localeCompare(nName);
    })
    .forEach(code => {
      try {
        countries.push({
          code,
          code2: $countries.alpha2ToAlpha3(code),
          callingCode: getCountryCallingCode(code),
          name: $countries.getName(code, currLocale),
        });
      } catch (err) {}
    });

  return countries;
};

export const goMove = (path) => {
  const route = useRoute();

  if (route.path === path) {
    window.location.href = path;
  } else {
    navigateTo(path);
  }
};

export const parseIntForValue = (val, fallback = 0) => {
  return /^\d+$/.test(val) && parseInt(val) > 0 ? parseInt(val) : fallback;
};
