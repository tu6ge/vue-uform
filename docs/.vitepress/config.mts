import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue uForm",
  description: "a component-first, no-style,flexable form validation",
  base: process.env.NODE_ENV === "production" ? "/vue-uform/" : "/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      //{ text: "API", link: "/api" },
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
            text: "&lt;u-field&gt;",
            link: "/u-field",
          },
          {
            text: "&lt;u-form&gt;",
            link: "/u-form",
          },
          {
            text: "&lt;u-submit&gt;",
            link: "/u-submit",
          },
          {
            text: "&lt;u-reset&gt;",
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
            text: "f-model sugar",
            link: "/f-model",
          },
        ],
      },
      // {
      //   text: "Custom",
      //   link: "/custom",
      // },
      {
        text: "Examples",
        link: "/examples",
      },
      // {
      //   text: "Examples",
      //   items: [
      //     { text: "Markdown Examples", link: "/markdown-examples" },
      //     { text: "Runtime API Examples", link: "/api-examples" },
      //   ],
      // },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/tu6ge/vue-uform" },
    ],
  },
});
