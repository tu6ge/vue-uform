# u-form component

The u-form component serves several purposes: initializing form data, handling form submission, resetting form data, and applying a unified scheme to all fields within the form.

Let’s explain it with an example.

## Initializing form data

```vue
<script setup>
const formValues = {
  username: "Join",
};
</script>
<template>
  <u-form :values="formValues">
    <u-field name="username" v-slot="{ value, update }">
      <input f-model />
    </u-field>
  </u-form>
</template>
```

::: tip
`u-field` uses the `name` prop to link with the data in `u-form`.
:::

## Handling form submission

```vue
<script setup>
const formValues = {
  username: "Join",
};
function handleSubmit(data) {
  console.log(data);
}
</script>
<template>
  <u-form :values="formValues" @submit="handleSubmit">
    <u-field name="username" v-slot="{ value, update }">
      <input f-model />
    </u-field>
    <u-submit></u-submit>
  </u-form>
</template>
```

When we click the submit button, our handleSubmit will receive the submitted form data.

::: tip
If there is validation information in `u-field`, the `handleSubmit` function can only be triggered after the validation passes.
:::

## Reset form

You can use the reset feature to clear the form data or populate the form with specified data.

```vue
<script setup>
import { ref } from "vue";
const formRef = ref();

function reset2() {
  formRef.value.reset({ username: "Bio" });
}
</script>
<template>
  <u-form ref="formRef">
    <u-field name="username" v-slot="{ value, update }">
      <input f-model />
    </u-field>

    <!-- click this button will clear the form -->
    <u-reset>Reset</u-reset>

    <button type="button" @click="reset2">Reset With Data</button>
  </u-form>
</template>
```

## Scheme prop

You can use the scheme prop to apply a unified HTML layout to all fields within the same form.

```vue
<script setup lang="ts">
import { h } from "vue";
import { SchemeArg } from "vue-uform";
const myScheme = (arg: SchemeArg) => {
  return h("div", { class: "myscheme-field" }, [
    h("label", { class: "myscheme-label" }, arg.label),
    h("div", { class: "myscheme-input" }, [arg.slot()]),
    arg.help ? h("div", { class: "myscheme-help" }, arg.help) : null,
    arg.messages && arg.messages.length
      ? h(
          "ul",
          { class: "myscheme-messages" },
          arg.messages.map((e: string) => h("li", e))
        )
      : null,
  ]);
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
