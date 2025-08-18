# Nest of Object / Array <span style="background: #22c55e; color:#fff; border-radius:5px; padding-left:5px; padding-right:5px;">+0.3.0</span>

vue-uform support nest form field, this has object and array two way of nest.

## Object Nest

this is an example of object nest method:

```vue
<template>
  <u-field name="address.country"></u-field>
</template>
```

we can found dot in name prop of `u-field` component.

## Array Nest

we can useing `[0]` grammar to create an array nest field. like this:

```vue
<template>
  <u-field name="fruits[0]"></u-field>
  <u-field name="fruits[1]"></u-field>
</template>
```
