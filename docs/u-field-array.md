# u-field-array component

This component exposes some methods through slots to help you manage array fields.

this is an example:

```vue
<script setup lang="ts">
import { ref } from "vue";

let formValues: { name: string[] } = {
  name: [],
};
formValues.name = ["foo", "bar", "foobar"];
</script>
<template>
  <div>
    <u-form :values="formValues" @submit="onSave">
      <u-field-array name="name" v-slot="{ fields, remove, push }">
        <div v-for="(, key) in fields">
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
      <u-submit></u-submit>
    </u-form>
  </div>
</template>
```

you should be using `push` method to add item in array, and using `remove` and index to remove item in array.

## Support nest object

this is an example:

```vue
<script setup lang="ts">
function onSave(data: {}) {
  alert(JSON.stringify(data, null, 2));
}

let formValues2: { address: { city: string }[] } = {
  address: [],
};
formValues2.address = [{ city: "shenzhen" }, { city: "qingdao" }];
</script>
<template>
  <u-form :values="formValues2" @submit="onSave">
    <u-field-array name="address" v-slot="{ fields, remove, push }">
      <div v-for="(, key) in fields">
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
    <u-submit></u-submit>
  </u-form>
</template>
```

## Support scheme

`u-field-array` suport scheme like `u-form` and `u-field` components,Their priorities are: custom prop > u-field's scheme > u-field-array's scheme > u-form's scheme > default configure.
