import { createApp } from "vue";
import App from "./App.vue";
import Plugin from "./Plugin.vue";
import Checkbox2 from "./Checkbox.vue";
import MySelect from "./MySelect.vue";

import { plugin } from "vue-uform";

const app = createApp(Checkbox2);

app.use(plugin, {}).mount("#app");
