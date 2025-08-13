import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue uForm",
  description: "a component-first, no-style,flexable form validation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      //{ text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Get Started",
        link: "/guid",
      },
      {
        text: "Components",
        items: [
          {
            text: "u-form",
            link: "/u-form",
          },
          {
            text: "u-field",
            link: "/u-field",
          },
          {
            text: "u-submit",
            link: "/u-submit",
          },
          {
            text: "u-reset",
            link: "/u-reset",
          },
        ],
      },
      {
        text: "Validation",
        link: "/validation",
      },
      {
        text: "Vite Plugin",
        items: [
          {
            text: "f-model",
            link: "/f-model",
          },
        ],
      },
      {
        text: "Custom",
        link: "/custom",
      },
      {
        text: "Examples",
        link: "/examples",
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/tu6ge/vue-uform" },
    ],
  },
});
