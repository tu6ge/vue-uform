# Nest of Object / Array <Badge type="tip" text="+0.3.0" />

vue-uform supports nested form fields, including both objects and arrays.

## Object Nest

Here is an example of nesting with an object:

```vue
<template>
  <u-field name="address.country"></u-field>
</template>
```

We use a dot in the `name` prop of the `u-field` component to access nested object properties.

## Array Nest

We can use the `[0]` syntax to create a nested array field, like this:

```vue
<template>
  <u-field name="fruits[0]"></u-field>
  <u-field name="fruits[1]"></u-field>
</template>
```

## Reset form with nested value

You can use nested values to clear the form data or populate the form with specified data.

```vue
<script setup>
import { ref } from "vue";
const formRef = ref();

function reset2() {
  formRef.value.reset({ address: { country: "Foo" } });
}
</script>
<template>
  <u-form ref="formRef">
    <u-field name="address.country" v-slot="{ value, update }">
      <input f-model />
    </u-field>

    <!-- click this button will clear the form -->
    <u-reset>Reset</u-reset>

    <button type="button" @click="reset2">Reset With Data</button>
  </u-form>
</template>
```
