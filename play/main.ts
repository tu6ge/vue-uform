import { createApp } from "vue";
import App from "./App.vue";

import { plugin } from "vue-uform";

const app = createApp(App);

app.use(plugin, {}).mount("#app");
