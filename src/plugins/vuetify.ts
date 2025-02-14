// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDateInput, VTimePicker } from "vuetify/labs/components";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VDateInput,
      VTimePicker,
    },
  });
  app.vueApp.use(vuetify);
});
