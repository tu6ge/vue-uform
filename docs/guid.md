# Get Started

Vue-uForm is an unstyled, flexible form validation library for Vue 3, focusing on component-driven design.

- 🎨 Works with any UI component library
- 🧩 Fully customizable layout (label, input, help info, validation messages, etc.)
- 📦 Apply layouts globally to all form fields
- 🔘 Customizable submit button
- ✨ Minimal JS/TS code — most logic stays in components
- ✅ Built-in and custom validation rules

## Why is vue-uform?

In Vue, we already have the very convenient v-model syntax sugar. It handles two essential things for us:

- When a JavaScript variable has a value, it fills the input field.
- When the input changes, the new value is passed back to JavaScript.

That’s basically what v-model does under the hood.

So why redefine two-way binding?

The reason is that I’ve been exploring a new approach to form validation. I believe the next generation of Vue form validators should be:

- Component-driven – the form behavior is powered by components, not configuration.
- Style-agnostic – no built-in styling, leaving developers free to define layouts.
- Flexible with UI libraries – should work seamlessly with input components from libraries like Naive UI, Element Plus, or even fully custom ones.

What existing validators do

When I looked at existing solutions, I found a common pattern: each form field usually comes with:

- A label
- An input
- A help message
- An error message (shown when validation fails)

Some libraries solve this by bundling their own input components and tightly integrating them with validation. While this works, it reduces flexibility.

I wanted something different: a validator that lets developers use their own UI components, while still handling value binding and validation logic cleanly.

The idea: u-field component

To achieve this, I introduced the idea of a u-field component.
You can put any input component into its slot.

The u-field exposes two key bindings to its slot:

- **value** passes the form data down to the input.
- **update** sends the new input value back up to the form.

This makes synchronization possible, and sets the stage for validation.

For example:

```vue
<template>
  <u-field v-slot="{ value, update }">
    <input :value="value" @input="($event) => update($event.target.value)" />
  </u-field>
</template>
```

Why not just v-model?

Looking at Vue’s official docs, this is exactly the kind of code v-model was meant to simplify.
But when binding with parent components (not just local state), we need another kind of syntax sugar.

So, inspired by vue-macros, I created a Vite plugin to introduce a new directive: `f-model`.

With `f-model`, the example above becomes:

```vue
<template>
  <u-field v-slot="{ value, update }">
    <input f-model />
  </u-field>
</template>
```

Beyond text inputs

Of course, text inputs are the simplest case.
For other components like radio buttons, checkboxes, or selects, special handling is still needed.

For third-party components, it’s straightforward:

- With a regular input:

```vue
<input f-model />
```

- With Naive UI’s n-input (which uses v-model:value):

```vue
<n-input f-model:value />
```

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

global register components

```ts
// ./src/main.ts
import { plugin } from "vue-uform";

const app = createApp(App);

app.use(plugin).mount("#app");
```

or import components in Vue SFC file

```vue
<script setup>
import { Form, Field, Submit, Reset } from "vue-uform";
</script>
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
      <button type="button" :style="{ color: 'blue' }" @click="submit">
        Login
      </button>
    </u-submit>
  </u-form>
</template>
```
