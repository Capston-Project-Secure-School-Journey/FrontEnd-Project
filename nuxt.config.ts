import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_API_KEY}&libraries=places`,
          async: true,
          defer: true,
        },
      ],
    },
  },
  compatibilityDate: "2024-11-01",
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt",
    "@nuxthub/core",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  srcDir: "./src",
  css: ["~/assets/index.css"],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_BASE_URL: `${process.env.API_BASE_URL}`,
      GOOGLE_MAP_API_KEY: `${process.env.GOOGLE_MAP_API_KEY}`,
    },
  },
});
