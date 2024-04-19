// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [ '@sidebase/nuxt-auth',
  '@nuxtjs/google-fonts',  '@nuxtjs/tailwindcss', 'shadcn-nuxt', 
],
shadcn: {
  /**
   * Prefix for all the imported component
   */
  prefix: '',
  /**
   * Directory that the component lives in.
   * @default "./components/ui"
   */
  componentDir: './components/ui'
},


  googleFonts: {
    families: {
      Inter: [300, 500, 700],
    }
  },
  
  devtools: { enabled: false },
  css: [
    "~/assets/main.css"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  }
})
 