import { createApp } from "vue";
import App from "./App.vue";

import { Hello } from "vue-uform";

const app = createApp(App);

app.component('Hello',Hello).mount("#app");
