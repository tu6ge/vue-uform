import { createApp } from "vue";
import App from "./App.vue";
import Plugin from "./Plugin.vue";
import Checkbox2 from "./Checkbox.vue";
import MySelect from "./MySelect.vue";
import Antd from "ant-design-vue";

import { plugin } from "vue-uform";

// Element-Plus
import "element-plus/dist/index.css";

// Antd
import "ant-design-vue/dist/reset.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(Plugin);

app.use(plugin).use(vuetify).use(Antd).mount("#app");
