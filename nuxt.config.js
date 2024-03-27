// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [ '@sidebase/nuxt-auth',
  '@nuxtjs/google-fonts' , 
],



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
 