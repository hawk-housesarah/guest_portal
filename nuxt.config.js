// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      envType: '',
      homeUrl: '',
      authApiHost: '',
      apiHost: '',
      apiHost2: '',
      apiVersion: process.env.API_VERSION,
      appPlatform: '',
      stibeeListId: '',
    },
  },
  devtools: { enabled: process.env.ENV_TYPE !== 'production' },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'ko', name: '한글', language: 'ko-KR', file: 'ko.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
    ],
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    compilation: {
      strictMessage: false,
    },
  },

  css: ['@/assets/main.css'],

  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.ENV_TYPE === 'production',
          drop_debugger: process.env.ENV_TYPE === 'production',
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      hmr: process.env.ENV_TYPE === 'local'
        ? {}
        : { clientPort: 443 },
      allowedHosts: process.env.ENV_TYPE === 'local'
        ? []
        : ['checkin.housesarah.net', 'luggage.housesarah.net'],
    },
  },

  app: {
    head: {
      title: 'WECO STAY',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { charset: 'utf-8' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/wecostay_web_favicon_16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/wecostay_web_favicon_32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/wecostay_web_favicon_96x96.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/wecostay_web_favicon_180x180.png' },
        { rel: 'icon', type: 'image/png', sizes: '196x196', href: '/wecostay_web_favicon_196x196.png' },
      ],
    },
  },

  compatibilityDate: '2025-07-15',
})
