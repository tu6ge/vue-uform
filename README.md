# Vue-uForm

Next vue form validator library. the library regards components as first-class citizens. All functions including data transfer and form validation, revolve around components. It has the following functions:

- Support third UI componnet library's input components
- Support custom layout, e.g. label, input, help info,validator error message and more element free combination
- Support a layout combination to act on all form fields
- Support custom submit button
- There's no need to write too much js/ts code; most of the logic is on the components
- Support some build-in validator rule

This is a [introduction information](./introduction.md)

## Usage

1. install

```bash
pnpm install vue-uform
pnpm install @vue-uform/vite-plugin -D
```

2. configure vite like this:

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import uForm from "@vue-uform/vite-plugin";

export default defineConfig({
  plugins: [vue(), uForm()],
});
```

3. open a vue sfc file, and input this code:

```vue
<script setup>
const formValues = {
  username: "",
  password: "",
};
function doLogin(data) {
  console.log(data);
}
</script>
<template>
  <u-form :values="formValues" @submit="doLogin">
    <u-field name="username" label="Username" v-slot="{ value, update }">
      <input f-model />
    </u-field>
    <u-field name="password" label="Password" v-slot="{ value, update }">
      <input type="password" f-model />
    </u-field>
    <u-submit>Login</u-submit>
    <!-- or -->
    <u-submit custom v-slot="{ submit }">
      <button style="{color:'blue'}" @click="submit">Login</button>
    </u-submit>
  </u-form>
</template>
```
