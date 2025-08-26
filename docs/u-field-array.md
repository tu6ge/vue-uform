# u-field-array component

The `u-field-array` component is used to manage array-type fields within a form, such as lists of names, addresses, or nested objects.  
It provides helper methods through scoped slots so you can easily add and remove items from an array.

## Basic usage

Here is a simple example with a list of names:

```vue
<script setup lang="ts">
import { ref } from "vue";

let formValues: { name: string[] } = {
  name: ["foo", "bar", "foobar"],
};

function onSave(data: {}) {
  alert(JSON.stringify(data, null, 2));
}
</script>
<template>
  <u-form :values="formValues" @submit="onSave">
    <u-field-array name="name" v-slot="{ fields, remove, push }">
      <div v-for="(field, key) in fields" :key="key">
        <u-field
          :name="`name[${key}]`"
          :label="`Name #${key + 1}`"
          v-slot="{ value, update }"
        >
          <input f-model />

          <button type="button" @click="remove(key)">Remove Item</button>
        </u-field>
      </div>

      <button type="button" @click="push('abc')">Add Item</button>
    </u-field-array>

    <u-submit />
  </u-form>
</template>
```

You can use:

- `push(item)` to add a new item to the array
- `remove(index)` to remove an item by its index

## Nested objects

The component also works with arrays of objects. For example, here is a list of addresses:

```vue
<script setup lang="ts">
function onSave(data: {}) {
  alert(JSON.stringify(data, null, 2));
}

let formValues2: { address: { city: string }[] } = {
  address: [{ city: "shenzhen" }, { city: "qingdao" }],
};
</script>
<template>
  <u-form :values="formValues2" @submit="onSave">
    <u-field-array name="address" v-slot="{ fields, remove, push }">
      <div v-for="(field, key) in fields" :key="key">
        <u-field
          :name="`address[${key}].city`"
          :label="`City #${key + 1}`"
          v-slot="{ value, update }"
        >
          <input f-model />
          <button type="button" @click="remove(key)">Remove Item</button>
        </u-field>
      </div>
      <button type="button" @click="push({ city: 'jinan' })">Add Item</button>
    </u-field-array>
    <u-submit />
  </u-form>
</template>
```

## Schema support

Like `u-form` and `u-field`, `u-field-array` also supports `scheme` configuration.  
Priority order is:

**custom prop > u-field’s scheme > u-field-array’s scheme > u-form’s scheme > default configuration.**
