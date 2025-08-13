# Get Started

Vue-uForm is an unstyled, flexible form validation library for Vue 3, focusing on component-driven design.

- 🎨 Works with any UI component library
- 🧩 Fully customizable layout (label, input, help info, validation messages, etc.)
- 📦 Apply layouts globally to all form fields
- 🔘 Customizable submit button
- ✨ Minimal JS/TS code — most logic stays in components
- ✅ Built-in and custom validation rules

## Installation

```bash
pnpm install vue-uform
pnpm install @vue-uform/vite-plugin -D
```

## Configure

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import uForm from "@vue-uform/vite-plugin";

export default defineConfig({
  plugins: [vue(), uForm()],
});
```

```ts
// ./src/main.ts
import { plugin } from "vue-uform";

const app = createApp(App);

app.use(plugin, {}).mount("#app");
```

## Example

```vue
<script setup>
// init form values
const formValues = {
  username: "",
  password: "",
};

// handler form submit event
function doLogin(data) {
  console.log(data);
}
</script>
<template>
  <u-form :values="formValues" @submit="doLogin">
    <u-field
      name="username"
      label="Username"
      validation="required"
      v-slot="{ value, update }"
    >
      <input f-model />
    </u-field>
    <u-field
      name="password"
      label="Password"
      validation="required"
      v-slot="{ value, update }"
    >
      <input type="password" f-model />
    </u-field>
    <u-submit>Login</u-submit>
    <!-- or -->
    <u-submit custom v-slot="{ submit }">
      <button :style="{ color: 'blue' }" @click="submit">Login</button>
    </u-submit>
  </u-form>
</template>
```
