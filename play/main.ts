import { createApp } from "vue";
import App from "./App.vue";
import Plugin from "./Plugin.vue";

import { plugin } from "vue-uform";

const app = createApp(Plugin);

app.use(plugin, {}).mount("#app");
