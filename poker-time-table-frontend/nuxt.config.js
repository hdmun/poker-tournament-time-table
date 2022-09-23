// import colors from 'vuetify/es5/util/colors'

export default {
  dev: process.env.NODE_ENV !== 'production',
  ssr: false,
  telemetry: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - poker-time-table-frontend',
    title: 'poker-time-table-frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/variables.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/axios-accessor'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: true,
  },

  proxy: {
    '/api/': {
      target: process.env.NODE_ENV === 'production' ? 'http://localhost:3001' : 'http://localhost:4001',
      pathRewrite: {
        '^/api/': '/',
      },
    },
    '/ws/': {
      target: process.env.NODE_ENV === 'production' ? 'ws://localhost:3001' : 'ws://localhost:4001',
      pathRewrite: {
        '^/ws/': '/',
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'ko',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#D2B895',
          secondary1: '#D1A576',
          secondary2: '#DB9F65',
          secondary3: '#BB9A65',
          secondary4: '#9E8864',
          accent: '#566FFF',
          accent1: '#FF5A5A',
          gray1: '#E4E4E4',
          gray2: '#B7BAC3',
          gray3: '#8A94A0',
          gray4: '#3E4C59',
          gray5: '#323E4A',
          gray6: '#1F2933',
          gray7: '#141C24',
          gray8: '#11181F'
        }
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  server: {
    port: process.env.NODE_ENV === 'production' ? 3000 : 4000,
    host: '0.0.0.0',
  },

  // StoryBook Options: https://storybook.nuxtjs.org/api/options
  storybook: {
    decorators: ['<v-app><story/></v-app>'],
  },
}
