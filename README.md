# Vue-uForm

Next vue form validator library. the library regards components as first-class citizens. All functions including data transfer and form validation, revolve around components. It has the following functions:

- Support third UI componnet library's input components
- Support custom layout, e.g. label, input, help info,validator error message and more element free combination
- Support a layout combination to act on all form fields
- Support custom submit button
- There's no need to write too much js/ts code; most of the logic is on the components
- Support some build-in validator rule

## Example

1. simple example:

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

As you can see, our library does not contain any styles.This means that you can freely combine div elements and styles, we not have build-in every input components. you should to be use arbitrary input element or third input components.

To achieve functions such as form validation, we should not only have the input element but also information like label, help, and validation message. on default, my `<u-field>` component structure is:

```html
<div class="u-field-wrap">
  <div class="u-field-input-wrap">
    <label class="u-label">MyLabel</label>
    <!-- input slot -->
  </div>
  <div class="u-field-help">My help info</div>
  <ul class="u-validation-message">
    <li>validation1 error</li>
    <!-- more validation error-->
  </ul>
</div>
```

You can add styles on this basis to customize your page. Not just that, you can customize this element structure like this:

```vue
<template>
  <u-field v-slot="{ value, update }" custom>
    <div class="my-input-wrap">
      <label>MyLabel</label>
      <input f-model />
    </div>
  </u-field>
</template>
```

Perhaps, you need to set all the fields in a form to the same structure, and this library can also meet your needs:

```vue
<script setup lang="ts">
import { h } from "vue";
import { SchemeArg } from "vue-uform";
const myScheme = (arg: SchemeArg) => {
  return h(
    "div",
    {
      style: { color: "green" },
    },
    [h("label", arg.label), arg.getSlots(), h("div", arg.help)]
  );
};
</script>
<template>
  <u-form :scheme="myScheme">
    <u-field name="username" label="Username" v-slot="{ value, update }">
      <input f-model />
    </u-field>
    <u-field name="password" label="Password" v-slot="{ value, update }">
      <input type="password" f-model />
    </u-field>
  </u-form>
</template>
```

you can using [`h`](https://vuejs.org/guide/extras/render-function.html) function freely combine elements

the `f-model` is a sugar like `v-model`, this usage is [here](./packages/vite-plugin/README.md).
