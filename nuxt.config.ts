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
      FIREBASE_VAPID_KEY: `${process.env.FIREBASE_VAPID_KEY}`,
      FIREBASE_API_KEY: `${process.env.FIREBASE_API_KEY}`,
      FIREBASE_AUTHDOMAIN: `${process.env.FIREBASE_AUTHDOMAIN}`,
      FIREBASE_PROJECT_ID: `${process.env.FIREBASE_PROJECT_ID}`,
      FIREBASE_STORAGE_BUCKET: `${process.env.FIREBASE_STORAGE_BUCKET}`,
      FIREBASE_MESSAGING_SENDER_ID: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
      FIREBASE_APP_ID: `${process.env.FIREBASE_APP_ID}`,
      FIREBASE_MEASUREMENT_ID: `${process.env.FIREBASE_MEASUREMENT_ID}`,
    },
  },
});
