import StackblitzEmbed from "./components/StackblitzEmbed.vue";
import DefaultTheme from "vitepress/theme";
import { VPBadge } from "vitepress/theme";

import "./styles/main.css";

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    ctx.app.component("StackblitzEmbed", StackblitzEmbed);
    ctx.app.component("Badge", VPBadge);
  },
};
