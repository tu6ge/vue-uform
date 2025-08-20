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
