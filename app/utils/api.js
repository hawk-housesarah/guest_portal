const isSSR = () => {
  return import.meta.server || (import.meta.client && useNuxtApp().payload.serverRendered) ? true : false;
};

/**
 * API 호출처리를 위한 로직
 */
export const api = ({ config, cookie }) => {
  const getAppKey = async () => {
    let appKey = '';

    if (cookie.appKey.value) {
      appKey = cookie.appKey.value;
    } else {
      const url = `${config.public.authApiHost}/${config.public.apiVersion}/auth/key/publish/${config.public.appPlatform}`;

      try {
        const res = await $fetch(url);
        if (res.result === 'ok') {
          appKey = res.key;
          cookie.appKey.value = appKey;
        }
      } catch (error) {
        console.error('getAppKey', error);
      }
    }

    return appKey;
  };

  const sendGetInSetup = async (options) => {
    const {
      url, data: params = {}, requestConfig = {}, immediate = true, watch = [], key = '', platform = true,
    } = options;

    const reqKey = key ? key : url.split('/').pop();

    return useAsyncData(reqKey,
      async () => {
        let appKey = '';
        if (platform) {
          appKey = await getAppKey();
          if (!appKey) throw new Error('플랫폼 키를 발급할 수 없습니다.');
        }

        const getConfig = {
          ...requestConfig,
          method: 'GET',
          headers: {
            ...(requestConfig.headers || {}),
            ...(platform ? { Platform: config.public.appPlatform, Key: appKey } : {}),
          },
          params,
        };

        try {
          return await $fetch(url, getConfig);
        } catch (err) {
          console.error('sendGetInSetup', err);
          throw err;
        }
      },
      { immediate, watch }
    );
  };

  const sendGet = async (options) => {
    const {
      url, data: params = {}, requestConfig = {}, platform = true,
    } = options;

    let data = null;
    let error = null;
    let appKey = '';

    if (platform) {
      appKey = await getAppKey();
      if (!appKey) {
        return { data, error: new Error('플랫폼 키를 발급할 수 없습니다.') };
      }
    }

    const getConfig = {
      ...requestConfig,
      method: 'GET',
      headers: {
        ...(requestConfig.headers || {}),
        ...(platform ? { Platform: config.public.appPlatform, Key: appKey } : {}),
      },
      params,
    };

    try {
      data = await $fetch(url, getConfig);
    } catch (err) {
      console.error('sendGet', err);
      error = err;
    }

    return { data, error };
  };

  const sendPostInSetup = async (options) => {
    const {
      url, data = {}, requestConfig = {}, immediate = true, watch = [], key = '', platform = true,
    } = options;

    const reqKey = key ? key : url.split('/').pop();

    return useAsyncData(reqKey,
      async () => {
        let appKey = '';
        if (platform) {
          appKey = await getAppKey();
          if (!appKey) throw new Error('플랫폼 키를 발급할 수 없습니다.');
        }

        const postConfig = {
          ...requestConfig,
          method: 'POST',
          headers: {
            ...(requestConfig.headers || {}),
            ...(platform ? { Platform: config.public.appPlatform, Key: appKey } : {}),
          },
          body: data,
        };

        try {
          return await $fetch(url, postConfig);
        } catch (err) {
          console.error('sendPostInSetup', err);
          throw err;
        }
      },
      { immediate, watch }
    );
  };

  const sendPost = async (options) => {
    const {
      url, data: body = {}, requestConfig = {}, platform = true,
    } = options;

    let data = null, error = null;
    let appKey = '';

    if (platform) {
      appKey = await getAppKey();
      if (!appKey) {
        return { data, error: new Error('플랫폼 키를 발급할 수 없습니다.') };
      }
    }

    const postConfig = {
      ...requestConfig,
      method: 'POST',
      headers: {
        ...(requestConfig.headers || {}),
        ...(platform ? { Platform: config.public.appPlatform, Key: appKey } : {}),
      },
      body,
    };

    try {
      data = await $fetch(url, postConfig);
    } catch (err) {
      console.error('sendPost', err);
      error = err;
    }

    return { data, error };
  };

  const sendRequest = async (method, options) => {
    const {
      url, data: body = {}, requestConfig = {}, platform = true,
    } = options;

    let data = null, error = null;
    let appKey = '';

    if (platform) {
      appKey = await getAppKey();
      if (!appKey) {
        return { data, error: new Error('플랫폼 키를 발급할 수 없습니다.') };
      }
    }

    const apiConfig = {
      ...requestConfig,
      method,
      headers: {
        ...(requestConfig.headers || {}),
        ...(platform ? { Platform: config.public.appPlatform, Key: appKey } : {}),
      },
      ...(method === 'GET' ? { params: body } : {}),
      ...(['POST', 'PATCH', 'DELETE'].includes(method) ? { body } : {}),
    };

    try {
      data = await $fetch(url, apiConfig);
    } catch (err) {
      console.error('sendRequest', err);
      error = err;
    }

    return { data, error };
  };

  return {
    isSSR,
    getAppKey,
    sendGetInSetup,
    sendGet,
    sendPostInSetup,
    sendPost,
    sendRequest,
  };
};
