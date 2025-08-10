# Vue-uForm

simple example:

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
    [h("label", arg.label), arg.slot(), h("div", arg.help)]
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

## Validation Usage

```vue
<script setup>
import { FieldNode } from "vue-uform";
function isfruit(node: FieldNode): boolean | string {
  const { value } = node;
  if (value.value != "apple" && value.value != "banan") {
    return "this value is not apple or banan";
  }
  return true;
}
</script>
<template>
  <u-form>
    <!-- using build-in validation rules -->
    <u-field
      validation="required|number|between:10,20"
      v-slot="{ value, update }"
    >
      <input f-model />
    </u-field>

    <!-- using custom validation rule -->
    <u-field validation="isfruit" v-slot="{ value, update }">
      <input f-model />
    </u-field>

    <!-- using custom validation message -->
    <u-field
      validation="isfruit"
      :validation-messages="{
        isfruit: 'custom error message',
      }"
      v-slot="{ value, update }"
    >
      <input f-model />
    </u-field>
  </u-form>
</template>
```
