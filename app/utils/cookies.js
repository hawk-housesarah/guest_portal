/**
 * Cookie 로직
 */
export const cookie = ({ config }) => {
  const getCookieOptions = () => {
    return {
      path: '/',
      secure: config.public.envType === 'local' ? false : true,
      sameSite: config.public.envType === 'local' ? 'lax' : 'none',
      watch: true,
      readonly: false,
    };
  };

  const setCookie = (name, value, options) => {
    const cookieOptions = { ...getCookieOptions(), ...options };

    if (options?.expires) {
      const date = new Date();
      date.setDate(date.getDate() + options.expires);
      cookieOptions.expires = date;
    }

    useCookie(name, cookieOptions).value = value;
  };

  const getCookie = (name, options) => {
    const cookieOptions = { ...getCookieOptions(), ...options };
    return useCookie(name, cookieOptions);
  };

  return {
    getCookieOptions,
    setCookie,
    getCookie,
  };
};
