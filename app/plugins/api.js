import { api } from '@/utils/api';
import { cookie } from '@/utils/cookies';

/**
 * API 유틸함수 전역 설정
 */
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const cookieObj = cookie({ config });

  const appKey = cookieObj.getCookie('API_KEY');

  const apiObj = api({
    config,
    cookie: {
      appKey,
    },
  });

  return {
    provide: {
      isSSR: apiObj.isSSR(),
      getAppKey: () => {
        return apiObj.getAppKey();
      },
      sendGetInSetup: (options) => {
        return apiObj.sendGetInSetup(options);
      },
      sendGet: (options) => {
        return apiObj.sendGet(options);
      },
      sendPostInSetup: (options) => {
        return apiObj.sendPostInSetup(options);
      },
      sendPost: (options) => {
        return apiObj.sendPost(options);
      },
      sendRequest: (method, options) => {
        return apiObj.sendRequest(method, options);
      },
    },
  };
});
