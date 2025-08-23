<script setup lang="ts">
import { ref } from "vue";

let formValues: { name: string[] } = {
  name: [],
};
formValues.name = ["foo", "bar", "foobar"];

const list = ref<number[]>([]);
list.value = [0, 1, 2];

function onSave(data: {}) {
  alert(JSON.stringify(data, null, 2));
}

let formValues2: { address: { city: string }[] } = {
  address: [],
};
//formValues2.address = [{ city: "shenzhen" }, { city: "qingdao" }];
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
    <h2>Form #2</h2>
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
  </div>
</template>
<style>
input {
  border: 1px solid #000000 !important;
}
</style>
