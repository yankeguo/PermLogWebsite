import "./assets/base.css";
import "./assets/style.css";

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

// @ts-ignore
import pt from "./presets/permlog";

const app = createApp(App);

app.use(PrimeVue, {
  unstyled: true,
  pt,
});

app.mount("#app");
