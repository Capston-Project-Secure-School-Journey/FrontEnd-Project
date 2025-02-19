// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VCalendar, VDateInput, VTimePicker } from "vuetify/labs/components";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VDateInput,
      VTimePicker,
      VCalendar,
    },
  });
  app.vueApp.use(vuetify);
});
