/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './components/**/*.vue',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Pretendard', 'sans-serif'],
        ui: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      screens: {
        md: '1024px',
        custom: '1024px',
      },
      colors: {
        primary: {
          black: {
            300: '#BABABA',
            400: '#767676',
            700: '#130D0E',
            600: '#171314',
            900: '#0C0507',
            title: '#101010',
          },
          info: {
            600: '#1050DB',
          },
          success: {
            500: '#20CC89',
            700: '#109279',
          },
          error: {
            500: '#FD5B1F',
            600: '#D93D16',
          },
        },
        brand: {
          web: {
            main: '#fff7de',
            point: '#FBEDBF',
          },
          yellow: {
            100: '#FEF9D8',
          },
        },
        'web-brand': '#ffcd76',
      },
    },
    fontFamily: {
      sans: ['Pretendard', 'sans-serif'],
    },
  },
  plugins: [],
}
